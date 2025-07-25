/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GridColDef } from "@comet/admin";
import {
    type IntrospectionEnumType,
    type IntrospectionInputObjectType,
    type IntrospectionNamedTypeRef,
    type IntrospectionObjectType,
    type IntrospectionQuery,
} from "graphql";
import { plural, singular } from "pluralize";
import { type ReactNode } from "react";

import {
    type ActionsGridColumnConfig,
    type GeneratorReturn,
    type GQLDocumentConfigMap,
    type GridColumnConfig,
    type GridConfig,
    type StaticSelectLabelCellContent,
    type VirtualGridColumnConfig,
} from "../generate-command";
import { camelCaseToHumanReadable } from "../utils/camelCaseToHumanReadable";
import { convertConfigImport } from "../utils/convertConfigImport";
import { findMutationType } from "../utils/findMutationType";
import { findQueryTypeOrThrow } from "../utils/findQueryType";
import { findRootBlocks } from "../utils/findRootBlocks";
import { generateImportsCode, type Imports } from "../utils/generateImportsCode";
import { isGeneratorConfigCode, isGeneratorConfigImport } from "../utils/runtimeTypeGuards";
import { findInputObjectType } from "./findInputObjectType";
import { generateGqlFieldList } from "./generateGqlFieldList";
import { generateGridToolbar } from "./generateGridToolbar";
import { getForwardedGqlArgs } from "./getForwardedGqlArgs";
import { getPropsForFilterProp } from "./getPropsForFilterProp";

type TsCodeRecordToStringObject = Record<string, string | number | undefined>;

function tsCodeRecordToString(object: TsCodeRecordToStringObject, spreadAbove?: string) {
    return `{${spreadAbove ? `${spreadAbove}` : ""}${Object.entries(object)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value},`)
        .join("\n")}}`;
}

export type Prop = {
    type: string;
    optional: boolean;
    name: string;
    defaultValue?: string | number;
};

function generateGridPropsCode(props: Prop[]): { gridPropsTypeCode: string; gridPropsParamsCode: string } {
    if (!props.length) return { gridPropsTypeCode: "", gridPropsParamsCode: "" };
    const uniqueProps = props.reduce<Prop[]>((acc, prop) => {
        const propWithSameName = acc.find((filteredProps) => filteredProps.name === prop.name);
        if (propWithSameName) {
            if (propWithSameName.type === prop.type) {
                // ignore prop, it's a duplicate. e.g. same prop for mutation and for query
            } else {
                throw new Error(`Prop ${prop.name} with same name but different types (${propWithSameName.type} and ${prop.type}) detected.`);
            }
        } else {
            acc.push(prop);
        }
        return acc;
    }, []);
    return {
        gridPropsTypeCode: `type Props = {
            ${uniqueProps
                .map(
                    (prop) =>
                        `${
                            prop.type.includes("any")
                                ? `// eslint-disable-next-line @typescript-eslint/no-explicit-any
                                `
                                : ``
                        }${prop.name}${prop.optional ? `?` : ``}: ${prop.type};`,
                )
                .join("\n")}
        };`,
        gridPropsParamsCode: `{${uniqueProps.map((prop) => `${prop.name} ${prop.defaultValue ? `= ${prop.defaultValue}` : ""}`).join(", ")}}: Props`,
    };
}

const getSortByValue = (sortBy: GridColDef["sortBy"]) => {
    if (Array.isArray(sortBy)) {
        return `[${sortBy.map((i) => `"${i}"`).join(", ")}]`;
    }

    if (typeof sortBy === "string") {
        return `"${sortBy}"`;
    }

    return sortBy;
};

type LabelData = {
    textLabel: string;
    gridCellContent?: ReactNode;
};

const getValueOptionsLabelData = (messageId: string, label: string | StaticSelectLabelCellContent): LabelData => {
    if (typeof label === "string") {
        return {
            textLabel: `intl.formatMessage({ id: "${messageId}", defaultMessage: "${label}" })`,
        };
    }

    const textLabelParts: string[] = [];
    const gridCellContentProps: Record<string, string> = {};

    if (label.primaryText) {
        const primaryMessageId = `${messageId}.primary`;
        textLabelParts.push(`intl.formatMessage({ id: "${primaryMessageId}", defaultMessage: "${label.primaryText}" })`);
        gridCellContentProps.primaryText = `<FormattedMessage id="${primaryMessageId}" defaultMessage="${label.primaryText}" />`;
    }

    if (label.secondaryText) {
        const secondaryMessageId = `${messageId}.secondary`;
        textLabelParts.push(`intl.formatMessage({ id: "${secondaryMessageId}", defaultMessage: "${label.secondaryText}" })`);
        gridCellContentProps.secondaryText = `<FormattedMessage id="${secondaryMessageId}" defaultMessage="${label.secondaryText}" />`;
    }

    if (typeof label.icon === "string") {
        gridCellContentProps.icon = `<${label.icon}Icon />`;
    } else if (typeof label.icon === "object") {
        if ("import" in label.icon) {
            gridCellContentProps.icon = `<${label.icon.name} />`;
        } else {
            const { name, ...iconProps } = label.icon;
            gridCellContentProps.icon = `<${name}Icon
                ${Object.entries(iconProps)
                    .map(([key, value]) => `${key}="${value}"`)
                    .join("\n")}
            />`;
        }
    }

    const gridCellContent = `<GridCellContent
        ${Object.entries(gridCellContentProps)
            .map(([key, value]) => `${key}={${value}}`)
            .join("\n")}
    />`;

    return {
        textLabel: textLabelParts.join(" + ' ' + "),
        gridCellContent,
    };
};

export function generateGrid(
    {
        exportName,
        baseOutputFilename,
        targetDirectory,
        gqlIntrospection,
    }: { exportName: string; baseOutputFilename: string; targetDirectory: string; gqlIntrospection: IntrospectionQuery },

    config: GridConfig<any>,
): GeneratorReturn {
    const gqlType = config.gqlType;
    const gqlTypePlural = plural(gqlType);
    //const title = config.title ?? camelCaseToHumanReadable(gqlType);
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const instanceGqlTypePlural = gqlTypePlural[0].toLowerCase() + gqlTypePlural.substring(1);
    const gridQuery = config.query ? config.query : instanceGqlType != instanceGqlTypePlural ? instanceGqlTypePlural : `${instanceGqlTypePlural}List`;
    const gqlDocuments: GQLDocumentConfigMap = {};
    const imports: Imports = [
        { name: "FormattedMessage", importPath: "react-intl" },
        { name: "FormattedNumber", importPath: "react-intl" },
        { name: "useIntl", importPath: "react-intl" },
        { name: "ReactNode", importPath: "react" },
        { name: "gql", importPath: "@apollo/client" },
        { name: "useApolloClient", importPath: "@apollo/client" },
        { name: "useQuery", importPath: "@apollo/client" },
        { name: "Button", importPath: "@comet/admin" },
        { name: "CrudContextMenu", importPath: "@comet/admin" },
        { name: "CrudMoreActionsMenu", importPath: "@comet/admin" },
        { name: "DataGridToolbar", importPath: "@comet/admin" },
        { name: "ExportApi", importPath: "@comet/admin" },
        { name: "filterByFragment", importPath: "@comet/admin" },
        { name: "GridFilterButton", importPath: "@comet/admin" },
        { name: "GridCellContent", importPath: "@comet/admin" },
        { name: "GridColDef", importPath: "@comet/admin" },
        { name: "dataGridDateTimeColumn", importPath: "@comet/admin" },
        { name: "dataGridDateColumn", importPath: "@comet/admin" },
        { name: "dataGridIdColumn", importPath: "@comet/admin" },
        { name: "dataGridManyToManyColumn", importPath: "@comet/admin" },
        { name: "dataGridOneToManyColumn", importPath: "@comet/admin" },
        { name: "renderStaticSelectCell", importPath: "@comet/admin" },
        { name: "messages", importPath: "@comet/admin" },
        { name: "muiGridFilterToGql", importPath: "@comet/admin" },
        { name: "muiGridSortToGql", importPath: "@comet/admin" },
        { name: "StackLink", importPath: "@comet/admin" },
        { name: "FillSpace", importPath: "@comet/admin" },
        { name: "Tooltip", importPath: "@comet/admin" },
        { name: "useBufferedRowCount", importPath: "@comet/admin" },
        { name: "useDataGridExcelExport", importPath: "@comet/admin" },
        { name: "useDataGridRemote", importPath: "@comet/admin" },
        { name: "usePersistentColumnState", importPath: "@comet/admin" },
        { name: "BlockPreviewContent", importPath: "@comet/cms-admin" },
        { name: "useContentScope", importPath: "@comet/cms-admin" },
        { name: "Alert", importPath: "@mui/material" },
        { name: "Box", importPath: "@mui/material" },
        { name: "IconButton", importPath: "@mui/material" },
        { name: "Typography", importPath: "@mui/material" },
        { name: "useTheme", importPath: "@mui/material" },
        { name: "Menu", importPath: "@mui/material" },
        { name: "MenuItem", importPath: "@mui/material" },
        { name: "ListItemIcon", importPath: "@mui/material" },
        { name: "ListItemText", importPath: "@mui/material" },
        { name: "CircularProgress", importPath: "@mui/material" },
        { name: "DataGridPro", importPath: "@mui/x-data-grid-pro" },
        { name: "GridLogicOperator", importPath: "@mui/x-data-grid-pro" },
        { name: "GridRenderCellParams", importPath: "@mui/x-data-grid-pro" },
        { name: "GridSlotsComponent", importPath: "@mui/x-data-grid-pro" },
        { name: "GridToolbarProps", importPath: "@mui/x-data-grid-pro" },
        { name: "GridColumnHeaderTitle", importPath: "@mui/x-data-grid-pro" },
        { name: "GridToolbarQuickFilter", importPath: "@mui/x-data-grid-pro" },
        { name: "GridRowOrderChangeParams", importPath: "@mui/x-data-grid-pro" },
    ];

    const iconsToImport: string[] = ["Add", "Edit", "Info", "Excel"];
    const props: Prop[] = [];

    const fieldList = generateGqlFieldList({
        columns: config.columns.filter((column) => {
            return (
                // exclude id because it's always required
                column.type !== "actions" && column.name !== "id"
            );
        }),
    });

    // all root blocks including those we don't have columns for (required for copy/paste)
    // this is not configured in the grid config, it's just an heuristics
    const rootBlocks = findRootBlocks({ gqlType, targetDirectory }, gqlIntrospection);

    const rootBlockColumns = config.columns
        .filter((column) => column.type == "block")
        .map((column) => {
            // map is for ts to infer block type correctly
            if (column.type !== "block") throw new Error("Field is not a block field");
            return column;
        });

    rootBlockColumns.forEach((field) => {
        if (rootBlocks[String(field.name)]) {
            // update rootBlocks if they are also used in columns
            const block = field.block;
            if (isGeneratorConfigImport(block)) {
                rootBlocks[String(field.name)].import = block.import;
                rootBlocks[String(field.name)].name = block.name;
            }
        }
    });
    Object.values(rootBlocks).forEach((block) => {
        if (isGeneratorConfigImport(block)) {
            imports.push(convertConfigImport(block));
        }
    });

    const gridQueryType = findQueryTypeOrThrow(gridQuery, gqlIntrospection);

    const createMutationType = findMutationType(`create${gqlType}`, gqlIntrospection);
    const updateMutationType = findMutationType(`update${gqlType}`, gqlIntrospection);

    const hasDeleteMutation = !!findMutationType(`delete${gqlType}`, gqlIntrospection);
    const hasUpdateMutation = !!updateMutationType;

    const allowAdding = (typeof config.add === "undefined" || config.add === true) && !config.readOnly;
    const allowEditing = (typeof config.edit === "undefined" || config.edit === true) && !config.readOnly;
    const allowDeleting = (typeof config.delete === "undefined" || config.delete === true) && !config.readOnly && hasDeleteMutation;
    const allowRowReordering = typeof config.rowReordering?.enabled !== "undefined" && config.rowReordering?.enabled && hasUpdateMutation;

    const updateInputArg = updateMutationType?.args.find((arg) => arg.name === "input");
    if (allowRowReordering && updateInputArg) {
        const inputType = findInputObjectType(updateInputArg, gqlIntrospection);
        if (!inputType) throw new Error("Can't find update input type");
        if (!inputType.inputFields?.find((field) => field.name === "position")) {
            throw new Error("Position field is needed when using 'rowReordering'");
        }
    }

    const hasRowReorderingOnDragField = allowRowReordering && typeof config.rowReordering?.dragPreviewField !== "undefined";

    if (
        hasRowReorderingOnDragField &&
        !config.columns.find((column) => column.type !== "actions" && column?.name === config.rowReordering?.dragPreviewField)
    ) {
        throw new Error(`rowReorderingOnDragField '${config.rowReordering?.dragPreviewField}' must exist in columns`);
    }

    const forwardRowAction = allowEditing && config.rowActionProp;

    const showActionsColumn = allowEditing || allowDeleting;
    const showCrudContextMenuInActionsColumn = allowDeleting;
    const showEditInActionsColumn = allowEditing && !forwardRowAction;

    const defaultActionsColumnWidth = getDefaultActionsColumnWidth(showCrudContextMenuInActionsColumn, showEditInActionsColumn);

    const {
        imports: forwardedGqlArgsImports,
        props: forwardedGqlArgsProps,
        gqlArgs,
    } = getForwardedGqlArgs([gridQueryType, ...(createMutationType ? [createMutationType] : [])]);
    imports.push(...forwardedGqlArgsImports);
    props.push(...forwardedGqlArgsProps);

    const renderToolbar = config.toolbar ?? true;

    const filterArg = gridQueryType.args.find((arg) => arg.name === "filter");
    const hasFilter = !!filterArg && renderToolbar && !allowRowReordering;
    let hasFilterProp = false;
    let filterFields: string[] = [];
    if (filterArg) {
        const filterType = findInputObjectType(filterArg, gqlIntrospection);
        if (!filterType) throw new Error("Can't find filter type");
        filterFields = filterType.inputFields.map((f) => f.name.replace(/_/g, "."));

        const {
            hasFilterProp: tempHasFilterProp,
            imports: filterPropImports,
            props: filterPropProps,
        } = getPropsForFilterProp({ config, filterType });
        hasFilterProp = tempHasFilterProp;
        imports.push(...filterPropImports);
        props.push(...filterPropProps);
    }

    const forwardToolbarAction = allowAdding && renderToolbar && config.toolbarActionProp;
    if (forwardToolbarAction) {
        props.push({ name: "toolbarAction", type: "ReactNode", optional: true });
    }

    const sortArg = gridQueryType.args.find((arg) => arg.name === "sort");
    const hasSort = !!sortArg;
    let sortFields: string[] = [];
    if (sortArg) {
        if (sortArg.type.kind !== "LIST") {
            throw new Error("Sort argument must be LIST");
        }
        if (sortArg.type.ofType.kind !== "NON_NULL") {
            throw new Error("Sort argument must be LIST->NON_NULL");
        }
        if (sortArg.type.ofType.ofType.kind !== "INPUT_OBJECT") {
            throw new Error("Sort argument must be LIST->NON_NULL->INPUT_OBJECT");
        }
        const sortTypeName = sortArg.type.ofType.ofType.name;
        const sortType = gqlIntrospection.__schema.types.find((type) => type.kind === "INPUT_OBJECT" && type.name === sortTypeName) as
            | IntrospectionInputObjectType
            | undefined;
        if (!sortType) throw new Error("Can't find sort type");
        const sortField = sortType.inputFields.find((i) => i.name == "field");
        if (!sortField) throw new Error("Can't find sortFieldName");
        if (sortField.type.kind !== "NON_NULL") throw new Error("sortField must be NON_NULL");
        if (sortField.type.ofType.kind != "ENUM") throw new Error("sortField must be NON_NULL->ENUM");
        const sortFieldEnumName = sortField.type.ofType.name;
        const sortInputEnum = gqlIntrospection.__schema.types.find((type) => type.kind === "ENUM" && type.name === sortFieldEnumName) as
            | IntrospectionEnumType
            | undefined;
        if (!sortInputEnum) throw new Error("Can't find sortInputEnum");
        sortFields = sortInputEnum.enumValues.map((v) => v.name.replace(/_/g, "."));
        if (allowRowReordering && !sortFields.includes("position")) {
            throw new Error("Sort argument must include 'position' field for row reordering");
        }
    }

    const hasSearch = gridQueryType.args.some((arg) => arg.name === "search") && !allowRowReordering;
    const hasScope = gridQueryType.args.some((arg) => arg.name === "scope");

    const schemaEntity = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
        | IntrospectionObjectType
        | undefined;
    if (!schemaEntity) throw new Error("didn't find entity in schema types");

    const actionsColumnConfig = config.columns.find((column) => column.type === "actions") as ActionsGridColumnConfig;
    const {
        component: actionsColumnComponent,
        type: actionsColumnType,
        headerName: actionsColumnHeaderName,
        pinned: actionsColumnPinned = "right",
        width: actionsColumnWidth = defaultActionsColumnWidth,
        visible: actionsColumnVisible = undefined,
        ...restActionsColumnConfig
    } = actionsColumnConfig ?? {};
    if (actionsColumnComponent) {
        if (!isGeneratorConfigImport(actionsColumnComponent)) {
            throw new Error("Unsupported actionsColumnComponent, only imports are supported");
        }
        imports.push(convertConfigImport(actionsColumnComponent));
    }

    const gridNeedsTheme = config.columns.some((column) => typeof column.visible === "string");

    const gridColumnFields = (
        config.columns.filter((column) => column.type !== "actions") as Array<GridColumnConfig<any> | VirtualGridColumnConfig<any>>
    ).map((column) => {
        const type = column.type;
        const name = String(column.name);

        let gridColumnType: string | undefined = undefined;
        let renderCell: string | undefined = undefined;
        let valueFormatter: string | undefined = undefined;

        let gridType: "number" | "boolean" | "dateTime" | "date" | undefined;

        let filterOperators: string | undefined;
        if (column.type != "virtual" && column.filterOperators) {
            if (isGeneratorConfigImport(column.filterOperators)) {
                imports.push(convertConfigImport(column.filterOperators));
                filterOperators = column.filterOperators.name;
            } else {
                throw new Error("Unsupported filterOperators, only imports are supported for now");
            }
        }

        if (type == "dateTime") {
            gridColumnType = "...dataGridDateTimeColumn,";
        } else if (type == "date") {
            gridColumnType = "...dataGridDateColumn,";
        } else if (type == "number") {
            gridType = "number";
            const defaultDecimals = column.currency ? 2 : 0;
            const decimals = typeof column.decimals === "number" ? column.decimals : defaultDecimals;
            const currencyProps = column.currency ? `style="currency" currency="${column.currency}"` : "";
            renderCell = `({ value }) => {
                return (typeof value === "number") ? <FormattedNumber value={value} ${currencyProps} minimumFractionDigits={${decimals}} maximumFractionDigits={${decimals}} /> : "";
            }`;
        } else if (type == "boolean") {
            gridType = "boolean";
            valueFormatter = `(value, row) => typeof row.${name} === "boolean" ? row.${name}.toString() : ""`;
        } else if (column.type == "block") {
            renderCell = `(params) => {
                    return <BlockPreviewContent block={${column.block.name}} input={params.row.${name}} />;
                }`;
        } else if (type == "staticSelect") {
            valueFormatter = `(value, row) => row.${name}?.toString()`;
            const introspectionField = schemaEntity.fields.find((field) => field.name === name);
            if (!introspectionField) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
            const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;

            const enumType = gqlIntrospection.__schema.types.find(
                (t) => t.kind === "ENUM" && t.name === (introspectionFieldType as IntrospectionNamedTypeRef).name,
            ) as IntrospectionEnumType | undefined;

            column.values?.forEach((value) => {
                if (typeof value === "object" && typeof value.label === "object" && typeof value.label.icon !== "undefined") {
                    if (typeof value.label.icon === "string") {
                        iconsToImport.push(value.label.icon);
                    } else if (typeof value.label.icon?.name === "string") {
                        if (isGeneratorConfigImport(value.label.icon)) {
                            imports.push(convertConfigImport(value.label.icon));
                        } else {
                            iconsToImport.push(value.label.icon.name);
                        }
                    }
                }
            });

            let columnValues = [];

            if (column.values) {
                columnValues = column.values;
            } else if (enumType) {
                columnValues = enumType.enumValues.map((i) => i.name);
            } else {
                throw new Error(`Enum type not found`);
            }

            const values = columnValues.map((value) => {
                if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                    return {
                        value,
                        label: camelCaseToHumanReadable(value.toString()),
                    };
                } else {
                    return value;
                }
            });

            const valueOptions = `[${values
                .map(({ value, label }) => {
                    const labelData = getValueOptionsLabelData(
                        `${instanceGqlType}.${name}.${value.toString().charAt(0).toLowerCase() + value.toString().slice(1)}`,
                        label,
                    );
                    return `{
                        value: ${JSON.stringify(value)},
                        label: ${labelData.textLabel},
                        ${labelData.gridCellContent !== undefined ? `cellContent: ${labelData.gridCellContent},` : ""}
                    },`;
                })
                .join(" ")}]`;

            renderCell = `renderStaticSelectCell`;

            return {
                name,
                headerName: column.headerName,
                type,
                gridType: "singleSelect" as const,
                columnType: gridColumnType,
                valueOptions,
                renderCell,
                valueFormatter,
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                flex: column.flex,
                headerInfoTooltip: column.headerInfoTooltip,
                visible: column.visible && `theme.breakpoints.${column.visible}`,
                pinned: column.pinned,
                disableExport: column.disableExport,
            };
        } else if (type == "id") {
            gridColumnType = "...dataGridIdColumn,";
        } else if (type == "manyToMany") {
            gridColumnType = "...dataGridManyToManyColumn,";
        } else if (type == "oneToMany") {
            gridColumnType = "...dataGridOneToManyColumn,";
        }

        if (
            (column.type == "text" ||
                column.type == "number" ||
                column.type == "boolean" ||
                column.type == "date" ||
                column.type == "dateTime" ||
                column.type == "virtual" ||
                column.type == "id" ||
                column.type == "manyToMany" ||
                column.type == "oneToMany") &&
            column.renderCell
        ) {
            if (isGeneratorConfigCode(column.renderCell)) {
                renderCell = column.renderCell.code;
                imports.push(...column.renderCell.imports.map((imprt: any) => convertConfigImport(imprt)));
            } else {
                throw new Error(`Unsupported renderCell for column '${name}', only arrow functions are supported`);
            }
        }

        if ((column.type === "manyToMany" || column.type === "oneToMany") && !column.renderCell) {
            if (!column.labelField) {
                throw new Error(`labelField is required for ${column.type} column '${name}' if no custom renderCell is provided`);
            }

            renderCell = `({ row }) => <>{row.${column.name}.map((${singular(column.name)}) => ${singular(column.name)}.${column.labelField}).join(", ")}</>`;
        }

        //TODO support n:1 relation with singleSelect

        return {
            name,
            fieldName: column.fieldName,
            headerName: column.headerName,
            type,
            gridType,
            columnType: gridColumnType,
            renderCell,
            valueGetter: name.includes(".") ? `(params, row) => row.${name.replace(/\./g, "?.")}` : undefined,
            filterOperators: filterOperators,
            valueFormatter,
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
            flex: column.flex,
            headerInfoTooltip: column.headerInfoTooltip,
            visible: column.visible && `theme.breakpoints.${column.visible}`,
            pinned: column.pinned,
            disableExport: column.disableExport,
            sortBy: "sortBy" in column ? column.sortBy : undefined,
        };
    });

    iconsToImport.forEach((icon) => {
        imports.push({
            name: `${icon} as ${icon}Icon`,
            importPath: "@comet/admin-icons",
        });
    });

    const fragmentName = config.fragmentName ?? `${gqlTypePlural}Form`;

    if (forwardRowAction) {
        props.push({
            name: "rowAction",
            type: `(params: GridRenderCellParams<any, GQL${fragmentName}Fragment, any>) => ReactNode`,
            optional: true,
        });
        props.push({
            name: "actionsColumnWidth",
            type: `number`,
            optional: true,
            defaultValue: defaultActionsColumnWidth,
        });
    }

    if (config.selectionProps) {
        imports.push({ name: "DataGridProProps", importPath: "@mui/x-data-grid-pro" });
        props.push({
            name: "rowSelectionModel",
            type: `DataGridProProps["rowSelectionModel"]`,
            optional: true,
        });
        props.push({
            name: "onRowSelectionModelChange",
            type: `DataGridProProps["onRowSelectionModelChange"]`,
            optional: true,
        });
    }

    const { gridPropsTypeCode, gridPropsParamsCode } = generateGridPropsCode(props);
    const gridToolbarComponentName = `${gqlTypePlural}GridToolbar`;
    const dataGridRemoteParameters =
        config.initialSort || config.queryParamsPrefix || config.initialFilter
            ? `{${
                  config.initialSort
                      ? ` initialSort: [${config.initialSort
                            .map((item) => {
                                return `{field: "${item.field}", sort: "${item.sort}"}`;
                            })
                            .join(",\n")} ], `
                      : ""
              }
              ${
                  config.initialFilter
                      ? `initialFilter:{ ${
                            config.initialFilter.linkOperator
                                ? `linkOperator: GridLogicOperator.${config.initialFilter.linkOperator === "or" ? "Or" : "And"},`
                                : ""
                        }
                      items: [${config.initialFilter.items
                          .map((item) => {
                              return `{ field: "${item.field}", operator: "${item.operator}", value: "${item.value}" }`;
                          })
                          .join(",\n")} ],},`
                      : ""
              }
              ${config.queryParamsPrefix ? `queryParamsPrefix: "${config.queryParamsPrefix}",` : ""}
              }`
            : "";

    const code = `import {
        GQL${gqlTypePlural}GridQuery,
        GQL${gqlTypePlural}GridQueryVariables,
        GQL${fragmentName}Fragment,
        GQLCreate${gqlType}Mutation,
        GQLCreate${gqlType}MutationVariables,
        GQLUpdate${gqlType}PositionMutation,
        GQLUpdate${gqlType}PositionMutationVariables,
        GQLDelete${gqlType}Mutation,
        GQLDelete${gqlType}MutationVariables
    } from "./${baseOutputFilename}.generated";
    ${generateImportsCode(imports)}

    const ${instanceGqlTypePlural}Fragment = gql\`
        fragment ${fragmentName} on ${gqlType} {
            id
            ${fieldList}
        }
    \`;

    const ${instanceGqlTypePlural}Query = gql\`
        query ${gqlTypePlural}Grid(${[
            ...gqlArgs.filter((gqlArg) => gqlArg.queryOrMutationName === gridQueryType.name).map((gqlArg) => `$${gqlArg.name}: ${gqlArg.type}!`),
            ...[`$offset: Int!`, `$limit: Int!`],
            ...(hasSort ? [`$sort: [${gqlType}Sort!]`] : []),
            ...(hasSearch ? [`$search: String`] : []),
            ...(filterArg && (hasFilter || hasFilterProp) ? [`$filter: ${gqlType}Filter`] : []),
            ...(hasScope ? [`$scope: ${gqlType}ContentScopeInput!`] : []),
        ].join(", ")}) {
    ${gridQuery}(${[
        ...gqlArgs.filter((gqlArg) => gqlArg.queryOrMutationName === gridQueryType.name).map((gqlArg) => `${gqlArg.name}: $${gqlArg.name}`),
        ...[`offset: $offset`, `limit: $limit`],
        ...(hasSort ? [`sort: $sort`] : []),
        ...(hasSearch ? [`search: $search`] : []),
        ...(filterArg && (hasFilter || hasFilterProp) ? [`filter: $filter`] : []),
        ...(hasScope ? [`scope: $scope`] : []),
    ].join(", ")}) {
                nodes {
                    ...${fragmentName}
                }
                totalCount
            }
        }
        \${${instanceGqlTypePlural}Fragment}
    \`;

    ${
        allowRowReordering
            ? `const update${gqlType}PositionMutation = gql\`
                mutation Update${gqlType}Position($id: ID!, $input: ${gqlType}UpdateInput!) {
                    update${gqlType}(id: $id, input: $input) {
                        id
                        position
                        updatedAt
                    }
                }
            \`;`
            : ""
    }

    ${
        allowDeleting
            ? `const delete${gqlType}Mutation = gql\`
                mutation Delete${gqlType}($id: ID!) {
                    delete${gqlType}(id: $id)
                }
            \`;`
            : ""
    }


    ${
        renderToolbar
            ? generateGridToolbar({
                  componentName: gridToolbarComponentName,
                  forwardToolbarAction,
                  hasSearch,
                  hasFilter,
                  allowAdding,
                  instanceGqlType,
                  gqlType,
                  excelExport: config.excelExport,
                  newEntryText: config.newEntryText,
                  fragmentName,
              })
            : ""
    }

    ${gridPropsTypeCode}

    export function ${gqlTypePlural}Grid(${gridPropsParamsCode}) {
        ${showCrudContextMenuInActionsColumn ? "const client = useApolloClient();" : ""}
        const intl = useIntl();
        const dataGridProps = { ...useDataGridRemote(${dataGridRemoteParameters}), ...usePersistentColumnState("${gqlTypePlural}Grid")${
            config.selectionProps === "multiSelect"
                ? `, rowSelectionModel, onRowSelectionModelChange, checkboxSelection: true, keepNonExistentRowsSelected: true`
                : config.selectionProps === "singleSelect"
                  ? `, rowSelectionModel, onRowSelectionModelChange, checkboxSelection: false, keepNonExistentRowsSelected: false, disableSelectionOnClick: true`
                  : ``
        } };
        ${hasScope ? `const { scope } = useContentScope();` : ""}
        ${gridNeedsTheme ? `const theme = useTheme();` : ""}

        ${generateHandleRowOrderChange(allowRowReordering, gqlType, instanceGqlTypePlural)}

        const columns: GridColDef<GQL${fragmentName}Fragment>[] = [
            ${gridColumnFields
                .map((column) => {
                    const defaultMinWidth = 150;
                    const defaultColumnFlex = 1;
                    let minWidth;
                    let maxWidth;
                    let tooltipColumnWidth = column.width;

                    if (typeof column.width === "undefined") {
                        maxWidth = column.maxWidth;

                        if (
                            typeof column.minWidth === "undefined" &&
                            (typeof column.maxWidth === "undefined" || column.maxWidth >= defaultMinWidth)
                        ) {
                            minWidth = defaultMinWidth;
                            tooltipColumnWidth = defaultMinWidth;
                        } else if (typeof column.minWidth !== "undefined") {
                            minWidth = column.minWidth;
                            tooltipColumnWidth = column.minWidth;
                        }
                    }

                    const columnDefinition: TsCodeRecordToStringObject = {
                        field: column.fieldName ? `"${column.fieldName}"` : `"${column.name.replace(/\./g, "_")}"`, // field-name is used for api-filter, and api nests with underscore
                        renderHeader: column.headerInfoTooltip
                            ? `() => (
                                    <>
                                        <GridColumnHeaderTitle label={intl.formatMessage({ id: "${instanceGqlType}.${
                                            column.name
                                        }",   defaultMessage: "${
                                            column.headerName || camelCaseToHumanReadable(column.name)
                                        }"})} columnWidth= {${tooltipColumnWidth}}
                              />
                                        <Tooltip
                                            title={<FormattedMessage id="${instanceGqlType}.${column.name}.tooltip" defaultMessage="${
                                                column.headerInfoTooltip
                                            }" />}
                                        >
                                            <InfoIcon sx={{ marginLeft: 1 }} />
                                        </Tooltip>
                                    </>
                                )`
                            : undefined,
                        headerName: `intl.formatMessage({ id: "${instanceGqlType}.${column.name}", defaultMessage: "${
                            column.headerName || camelCaseToHumanReadable(column.name)
                        }" })`,
                        type: column.gridType ? `"${column.gridType}"` : undefined,
                        filterable: (!column.filterOperators && !filterFields.includes(column.name)) || allowRowReordering ? `false` : undefined,
                        sortable: (!sortFields.includes(column.name) || allowRowReordering) && !column.sortBy ? `false` : undefined,
                        valueGetter: column.valueGetter,
                        valueFormatter: column.valueFormatter,
                        valueOptions: column.valueOptions,
                        renderCell: column.renderCell,
                        filterOperators: column.filterOperators,
                        width: column.width,
                        flex: column.flex,
                        pinned: column.pinned && `"${column.pinned}"`,
                        visible: column.visible,
                        disableExport: column.disableExport ? "true" : undefined,
                    };

                    if ("sortBy" in column && column.sortBy) {
                        columnDefinition["sortBy"] = getSortByValue(column.sortBy);
                    }

                    if (typeof column.width === "undefined") {
                        columnDefinition.flex = defaultColumnFlex;
                        columnDefinition.minWidth = minWidth;
                        columnDefinition.maxWidth = maxWidth;
                    }

                    return tsCodeRecordToString(columnDefinition, column.columnType);
                })
                .join(",\n")},
                ${
                    showActionsColumn
                        ? tsCodeRecordToString({
                              field: '"actions"',
                              headerName: actionsColumnHeaderName
                                  ? `intl.formatMessage({ id: "${instanceGqlType}.actions", defaultMessage: "${actionsColumnHeaderName}" })`
                                  : `""`,
                              sortable: "false",
                              filterable: "false",
                              type: '"actions"',
                              align: '"right"',
                              pinned: `"${actionsColumnPinned}"`,
                              width: forwardRowAction ? "actionsColumnWidth" : actionsColumnWidth,
                              visible: actionsColumnVisible && `theme.breakpoints.${actionsColumnVisible}`,
                              ...restActionsColumnConfig,
                              disableExport: config.excelExport ? "true" : undefined,
                              renderCell: `(params) => {
                            return (
                                <>
                                ${actionsColumnComponent?.name ? `<${actionsColumnComponent.name} {...params} />` : ""}${
                                    allowEditing
                                        ? forwardRowAction
                                            ? `{rowAction && rowAction(params)}`
                                            : `
                                        <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                                            <EditIcon />
                                        </IconButton>`
                                        : ""
                                }${
                                    showCrudContextMenuInActionsColumn
                                        ? `
                                        <CrudContextMenu
                                            ${
                                                allowDeleting
                                                    ? `
                                            onDelete={async () => {
                                                await client.mutate<GQLDelete${gqlType}Mutation, GQLDelete${gqlType}MutationVariables>({
                                                    mutation: delete${gqlType}Mutation,
                                                    variables: { id: params.row.id },
                                                });
                                            }}
                                            `
                                                    : ""
                                            }
                                            refetchQueries={[${instanceGqlTypePlural}Query]}
                                        />
                                    `
                                        : ""
                                }
                                </>
                            );
                                }`,
                          })
                        : ""
                }
        ];

        ${
            hasFilter || hasSearch
                ? `const { ${hasFilter ? `filter: gqlFilter, ` : ""}${
                      hasSearch ? `search: gqlSearch, ` : ""
                  } } = muiGridFilterToGql(columns, dataGridProps.filterModel);`
                : ""
        }

        const { data, loading, error } = useQuery<GQL${gqlTypePlural}GridQuery, GQL${gqlTypePlural}GridQueryVariables>(${instanceGqlTypePlural}Query, {
            variables: {
                ${[
                    ...gqlArgs.filter((gqlArg) => gqlArg.queryOrMutationName === gridQueryType.name).map((arg) => arg.name),
                    ...(hasScope ? ["scope"] : []),
                    ...(filterArg
                        ? hasFilter && hasFilterProp
                            ? ["filter: filter ? { and: [gqlFilter, filter] } : gqlFilter"]
                            : hasFilter
                              ? ["filter: gqlFilter"]
                              : hasFilterProp
                                ? ["filter"]
                                : []
                        : []),
                    ...(hasSearch ? ["search: gqlSearch"] : []),
                    ...(!allowRowReordering
                        ? [
                              `offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize`,
                              `limit: dataGridProps.paginationModel.pageSize`,
                              `sort: muiGridSortToGql(dataGridProps.sortModel, columns)`,
                          ]
                        : // TODO: offset and limit should not be necessary for row reordering but not yet possible to disable in the api generator
                          [`offset: 0`, `limit: 100`, `sort: { field: "position", direction: "ASC" }`]),
                ].join(", ")}
            },
        });
        const rowCount = useBufferedRowCount(data?.${gridQuery}.totalCount);
        if (error) throw error;
        const rows = ${
            !allowRowReordering ? `data?.${gridQuery}.nodes` : generateRowReorderingRows(gridQuery, fieldList, config.rowReordering?.dragPreviewField)
        } ?? [];

        ${generateGridExportApi(config.excelExport, gqlTypePlural, gridQuery)}

        return (
            <DataGridPro
                {...dataGridProps}
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                ${
                    renderToolbar
                        ? `slots={{
                                toolbar: ${gridToolbarComponentName} as GridSlotsComponent["toolbar"],
                            }}
                            ${getDataGridSlotProps(gridToolbarComponentName, forwardToolbarAction, config.excelExport)}`
                        : ""
                }
                ${
                    allowRowReordering
                        ? `rowReordering
                           onRowOrderChange={handleRowOrderChange}
                           hideFooterPagination`
                        : ""
                }
            />
        );
    }
    `;

    return {
        code,
        gqlDocuments,
    };
}

const generateRowReorderingRows = (gridQuery: string, fieldList: string, dragPreviewField?: string) => {
    const fields = fieldList.split(" ");
    const reorderField = dragPreviewField || fields.find((field) => field === "title" || field === "name") || "id";

    return `data?.${gridQuery}.nodes.map((node) => ({
        ...node,
        __reorder__: node.${reorderField}
    }))`;
};

const getDefaultActionsColumnWidth = (showCrudContextMenu: boolean, showEdit: boolean) => {
    let numberOfActions = 0;

    if (showCrudContextMenu) {
        numberOfActions += 1;
    }

    if (showEdit) {
        numberOfActions += 1;
    }

    const widthOfSingleAction = 32;
    const spacingAroundActions = 20;

    return numberOfActions * widthOfSingleAction + spacingAroundActions;
};

const getDataGridSlotProps = (componentName: string, forwardToolbarAction: boolean | undefined, excelExport: boolean | undefined) => {
    if (!forwardToolbarAction && !excelExport) {
        return "";
    }

    const values = `{
        ${forwardToolbarAction ? `toolbarAction,` : ""}
        ${excelExport ? `exportApi,` : ""}
    } as ${componentName}ToolbarProps`.replace(/\n/g, "");

    return `slotProps={{
        toolbar: ${values}  
    }}`;
};

const generateGridExportApi = (excelExport: boolean | undefined, gqlTypePlural: string, gridQuery: string) => {
    if (!excelExport) {
        return "";
    }

    return `const exportApi = useDataGridExcelExport<GQL${gqlTypePlural}GridQuery["${gridQuery}"]["nodes"][0], GQL${gqlTypePlural}GridQuery, Omit<GQL${gqlTypePlural}GridQueryVariables, "offset" | "limit">>({
        columns,
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
        },
        query: ${gridQuery}Query,
        resolveQueryNodes: (data) => data.${gridQuery}.nodes,
        totalCount: data?.${gridQuery}.totalCount ?? 0,
        exportOptions: {
            fileName: "${gqlTypePlural}",
        },
    });`;
};

const generateHandleRowOrderChange = (allowRowReordering: boolean, gqlType: string, instanceGqlTypePlural: string) => {
    if (!allowRowReordering) {
        return "";
    }
    return `const handleRowOrderChange = async ({ row: { id }, targetIndex }: GridRowOrderChangeParams) => {
        await client.mutate<GQLUpdate${gqlType}PositionMutation, GQLUpdate${gqlType}PositionMutationVariables>({
            mutation: update${gqlType}PositionMutation,
            variables: { id, input: { position: targetIndex + 1 } },
            awaitRefetchQueries: true,
            refetchQueries: [${instanceGqlTypePlural}Query]
        });
    };`;
};
