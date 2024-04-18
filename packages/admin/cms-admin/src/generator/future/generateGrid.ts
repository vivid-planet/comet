import {
    IntrospectionEnumType,
    IntrospectionInputObjectType,
    IntrospectionInputValue,
    IntrospectionNamedTypeRef,
    IntrospectionObjectType,
    IntrospectionQuery,
} from "graphql";
import { plural } from "pluralize";

import { findInputObjectType } from "./generateGrid/findInputObjectType";
import { generateGqlFieldList } from "./generateGrid/generateGqlFieldList";
import { getPropsForFilterProp } from "./generateGrid/getPropsForFilterProp";
import { getPropsForUnsupportedRequiredGqlArgs } from "./generateGrid/getPropsForUnsupportedRequiredGqlArgs";
import { GeneratorReturn, GridConfig } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { findRootBlocks } from "./utils/findRootBlocks";
import { generateImportsCode, Imports } from "./utils/generateImportsCode";

type TsCodeRecordToStringObject = Record<string, string | number | undefined>;

function tsCodeRecordToString(object: TsCodeRecordToStringObject) {
    return `{${Object.entries(object)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value},`)
        .join("\n")}}`;
}

function findQueryType(queryName: string, schema: IntrospectionQuery) {
    const queryType = schema.__schema.types.find((type) => type.name === schema.__schema.queryType.name) as IntrospectionObjectType | undefined;
    if (!queryType) throw new Error("Can't find Query type in gql schema");
    const ret = queryType.fields.find((field) => field.name === queryName);
    if (!ret) throw new Error(`Can't find query ${queryName} in gql schema`);
    return ret;
}

function findQueryTypeOrThrow(queryName: string, schema: IntrospectionQuery) {
    const ret = findQueryType(queryName, schema);
    if (!ret) throw new Error(`Can't find query ${queryName} in gql schema`);
    return ret;
}

function findMutationType(mutationName: string, schema: IntrospectionQuery) {
    if (!schema.__schema.mutationType) throw new Error("Schema has no Mutation type");
    const queryType = schema.__schema.types.find((type) => type.name === schema.__schema.mutationType?.name) as IntrospectionObjectType | undefined;
    if (!queryType) throw new Error("Can't find Mutation type in gql schema");
    return queryType.fields.find((field) => field.name === mutationName);
}

export type Prop = { type: string; optional: boolean; name: string };
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
            ${uniqueProps.map((prop) => `${prop.name}${prop.optional ? `?` : ``}: ${prop.type};`).join("\n")}
        };`,
        gridPropsParamsCode: `{${uniqueProps.map((prop) => prop.name).join(", ")}}: Props`,
    };
}

export function generateGrid(
    {
        exportName,
        baseOutputFilename,
        targetDirectory,
        gqlIntrospection,
    }: { exportName: string; baseOutputFilename: string; targetDirectory: string; gqlIntrospection: IntrospectionQuery },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>,
): GeneratorReturn {
    const gqlType = config.gqlType;
    const gqlTypePlural = plural(gqlType);
    //const title = config.title ?? camelCaseToHumanReadable(gqlType);
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const instanceGqlTypePlural = gqlTypePlural[0].toLowerCase() + gqlTypePlural.substring(1);
    const gridQuery = config.query ? config.query : instanceGqlType != instanceGqlTypePlural ? instanceGqlTypePlural : `${instanceGqlTypePlural}List`;
    const gqlDocuments: Record<string, string> = {};
    const imports: Imports = [];
    const props: Prop[] = [];

    const fieldList = generateGqlFieldList({ columns: config.columns.filter((column) => column.name !== "id") }); // exclude id because it's always required

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
            rootBlocks[String(field.name)].import = field.block.import;
            rootBlocks[String(field.name)].name = field.block.name;
        }
    });
    Object.values(rootBlocks).forEach((block) => {
        imports.push({
            name: block.name,
            importPath: block.import,
        });
    });

    const gridQueryType = findQueryTypeOrThrow(gridQuery, gqlIntrospection);

    const createMutationType = findMutationType(`create${gqlType}`, gqlIntrospection);

    const hasDeleteMutation = !!findMutationType(`delete${gqlType}`, gqlIntrospection);
    const hasCreateMutation = !!createMutationType;

    const allowCopyPaste = (typeof config.copyPaste === "undefined" || config.copyPaste === true) && !config.readOnly && hasCreateMutation;
    const allowAdding = (typeof config.add === "undefined" || config.add === true) && !config.readOnly;
    const allowEditing = (typeof config.edit === "undefined" || config.edit === true) && !config.readOnly;
    const allowDeleting = (typeof config.delete === "undefined" || config.delete === true) && !config.readOnly && hasDeleteMutation;

    const showActionsColumn = allowCopyPaste || allowEditing || allowDeleting;

    const actionsColumnProps = ['field: "actions"', 'headerName: ""', "sortable: false", "filterable: false", 'type: "actions"', 'align: "right"'];
    if (typeof config.actions?.columnWidth !== "undefined") {
        actionsColumnProps.push(`width: ${config.actions.columnWidth}`);
    }

    const {
        imports: unsupportedRequiredGqlArgsImports,
        props: unsupportedRequiredGqlArgsProps,
        gqlArgs,
    } = getPropsForUnsupportedRequiredGqlArgs([gridQueryType, ...(createMutationType ? [createMutationType] : [])]);
    imports.push(...unsupportedRequiredGqlArgsImports);
    props.push(...unsupportedRequiredGqlArgsProps);

    const filterArg = gridQueryType.args.find((arg) => arg.name === "filter");
    const hasFilter = !!filterArg;
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

    const { gridPropsTypeCode, gridPropsParamsCode } = generateGridPropsCode(props);

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
    }

    const hasSearch = gridQueryType.args.some((arg) => arg.name === "search");
    const hasScope = gridQueryType.args.some((arg) => arg.name === "scope");

    const schemaEntity = gqlIntrospection.__schema.types.find((type) => type.kind === "OBJECT" && type.name === gqlType) as
        | IntrospectionObjectType
        | undefined;
    if (!schemaEntity) throw new Error("didn't find entity in schema types");

    //we load /all/ fields as we need it for copy/paste TODO: lazy load during copy?
    const fieldsToLoad = schemaEntity.fields
        .filter((field) => {
            if (field.name === "id" || field.name === "scope") return false;
            return true;
        })
        .filter((field) => {
            let type = field.type;
            if (type.kind == "NON_NULL") type = type.ofType;
            if (type.kind == "LIST") return false;
            if (type.kind == "OBJECT") return false; //TODO support nested objects
            return true;
        });

    const gridColumnFields = config.columns.map((column) => {
        const type = column.type;
        const name = String(column.name);

        let renderCell: string | undefined = undefined;
        let valueGetter: string | undefined = name.includes(".") ? `({ row }) => row.${name.replace(/\./g, "?.")}` : undefined;

        let gridType: "number" | "boolean" | "dateTime" | "date" | undefined;

        if (type == "dateTime") {
            valueGetter = `({ row }) => row.${name} && new Date(row.${name})`;
            gridType = "dateTime";
        } else if (type == "date") {
            valueGetter = `({ row }) => row.${name} && new Date(row.${name})`;
            gridType = "date";
        } else if (type == "number") {
            gridType = "number";
        } else if (type == "boolean") {
            gridType = "boolean";
        } else if (column.type == "block") {
            renderCell = `(params) => {
                    return <BlockPreviewContent block={${column.block.name}} input={params.row.${name}} />;
                }`;
        } else if (type == "staticSelect") {
            if (column.values) {
                throw new Error("custom values for staticSelect is not yet supported"); // TODO add support
            }
            const introspectionField = schemaEntity.fields.find((field) => field.name === name);
            if (!introspectionField) throw new Error(`didn't find field ${name} in gql introspection type ${gqlType}`);
            const introspectionFieldType = introspectionField.type.kind === "NON_NULL" ? introspectionField.type.ofType : introspectionField.type;

            const enumType = gqlIntrospection.__schema.types.find(
                (t) => t.kind === "ENUM" && t.name === (introspectionFieldType as IntrospectionNamedTypeRef).name,
            ) as IntrospectionEnumType | undefined;
            if (!enumType) throw new Error(`Enum type not found`);
            const values = enumType.enumValues.map((i) => i.name);
            const valueOptions = `[${values
                .map((i) => {
                    const id = `${instanceGqlType}.${name}.${i.charAt(0).toLowerCase() + i.slice(1)}`;
                    const label = `intl.formatMessage({ id: "${id}", defaultMessage: "${camelCaseToHumanReadable(i)}" })`;
                    return `{value: ${JSON.stringify(i)}, label: ${label}}, `;
                })
                .join(" ")}]`;

            return {
                name,
                type,
                gridType: "singleSelect" as const,
                valueOptions,
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
                flex: column.flex,
            };
        }

        //TODO suppoort n:1 relation with singleSelect

        return {
            name,
            headerName: column.headerName,
            type,
            gridType,
            renderCell,
            valueGetter,
            width: column.width,
            minWidth: column.minWidth,
            maxWidth: column.maxWidth,
            flex: column.flex,
        };
    });

    let createMutationInputFields: readonly IntrospectionInputValue[] = [];
    {
        const inputArg = createMutationType?.args.find((arg) => arg.name === "input");
        if (inputArg) {
            const inputType = findInputObjectType(inputArg, gqlIntrospection);
            if (!inputType) throw new Error("Can't find input type");
            createMutationInputFields = inputType.inputFields.filter((field) =>
                fieldsToLoad.some((gridColumnField) => gridColumnField.name == field.name),
            );
        }
    }

    const fragmentName = config.fragmentName ?? `${gqlTypePlural}Form`;

    const code = `import { gql, useApolloClient, useQuery } from "@apollo/client";
    import {
        CrudContextMenu,
        GridFilterButton,
        MainContent,
        muiGridFilterToGql,
        muiGridSortToGql,
        StackLink,
        Toolbar,
        ToolbarActions,
        ToolbarAutomaticTitleItem,
        ToolbarFillSpace,
        ToolbarItem,
        useBufferedRowCount,
        useDataGridRemote,
        usePersistentColumnState,
    } from "@comet/admin";
    import { Add as AddIcon, Edit } from "@comet/admin-icons";
    import { BlockPreviewContent } from "@comet/blocks-admin";
    import { Alert, Button, Box, IconButton } from "@mui/material";
    import { DataGridPro, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
    import { useContentScope } from "@src/common/ContentScopeProvider";
    import {
        GQL${gqlTypePlural}GridQuery,
        GQL${gqlTypePlural}GridQueryVariables,
        GQL${fragmentName}Fragment,
        GQLCreate${gqlType}Mutation,
        GQLCreate${gqlType}MutationVariables,
        GQLDelete${gqlType}Mutation,
        GQLDelete${gqlType}MutationVariables
    } from "./${gqlTypePlural}Grid.generated";
    import { filter as filterByFragment } from "graphql-anywhere";
    import * as React from "react";
    import { FormattedMessage, useIntl } from "react-intl";
    ${generateImportsCode(imports)}

    ${Object.entries(rootBlocks)
        .map(([rootBlockKey, rootBlock]) => `import { ${rootBlock.name} } from "${rootBlock.import}";`)
        .join("\n")}

    ${config.actions?.componentImport ? `import { ${config.actions.componentImport.name} } from "${config.actions.componentImport.import}";` : ""}

    const ${instanceGqlTypePlural}Fragment = gql\`
        fragment ${fragmentName} on ${gqlType} {
            id
            ${fieldList}
        }
    \`;

    const ${instanceGqlTypePlural}Query = gql\`
        query ${gqlTypePlural}Grid(${[
        ...gqlArgs.filter((gqlArg) => gqlArg.queryOrMutationName === gridQueryType.name).map((gqlArg) => `$${gqlArg.name}: ${gqlArg.type}!`),
        ...[`$offset: Int`, `$limit: Int`],
        ...(hasSort ? [`$sort: [${gqlType}Sort!]`] : []),
        ...(hasSearch ? [`$search: String`] : []),
        ...(hasFilter ? [`$filter: ${gqlType}Filter`] : []),
        ...(hasScope ? [`$scope: ${gqlType}ContentScopeInput!`] : []),
    ].join(", ")}) {
    ${gridQuery}(${[
        ...gqlArgs.filter((gqlArg) => gqlArg.queryOrMutationName === gridQueryType.name).map((gqlArg) => `${gqlArg.name}: $${gqlArg.name}`),
        ...[`offset: $offset`, `limit: $limit`],
        ...(hasSort ? [`sort: $sort`] : []),
        ...(hasSearch ? [`search: $search`] : []),
        ...(hasFilter ? [`filter: $filter`] : []),
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
        allowDeleting
            ? `const delete${gqlType}Mutation = gql\`
                mutation Delete${gqlType}($id: ID!) {
                    delete${gqlType}(id: $id)
                }
            \`;`
            : ""
    }

    ${
        allowCopyPaste
            ? `const create${gqlType}Mutation = gql\`
        mutation Create${gqlType}(${[
                  ...gqlArgs
                      .filter((gqlArg) => gqlArg.queryOrMutationName === createMutationType.name)
                      .map((gqlArg) => `$${gqlArg.name}: ${gqlArg.type}!`),
                  ...(hasScope ? [`$scope: ${gqlType}ContentScopeInput!`] : []),
                  ...[`$input: ${gqlType}Input!`],
              ].join(", ")}) {
            create${gqlType}(${[
                  gqlArgs
                      .filter((gqlArg) => gqlArg.queryOrMutationName === createMutationType.name)
                      .map((gqlArg) => `${gqlArg.name}: $${gqlArg.name}`),
                  ...(hasScope ? [`scope: $scope`] : []),
                  ...[`input: $input`],
              ].join(", ")}) {
                id
            }
        }
    \`;`
            : ""
    }

    function ${gqlTypePlural}GridToolbar() {
        return (
            <Toolbar>
                <ToolbarAutomaticTitleItem />
                ${
                    hasSearch
                        ? `<ToolbarItem>
                    <GridToolbarQuickFilter />
                </ToolbarItem>`
                        : ""
                }
                ${
                    hasFilter
                        ? `<ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>`
                        : ""
                }
                <ToolbarFillSpace />
                ${
                    allowAdding
                        ? `<ToolbarActions>
                    <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                        <FormattedMessage id="${instanceGqlType}.new${gqlType}" defaultMessage="New ${camelCaseToHumanReadable(gqlType)}" />
                    </Button>
                </ToolbarActions>`
                        : ""
                }
            </Toolbar>
        );
    }

    ${gridPropsTypeCode}

    export function ${gqlTypePlural}Grid(${gridPropsParamsCode}): React.ReactElement {
        ${allowCopyPaste || allowDeleting ? "const client = useApolloClient();" : ""}
        const intl = useIntl();
        const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("${gqlTypePlural}Grid") };
        ${hasScope ? `const { scope } = useContentScope();` : ""}

        const columns: GridColDef<GQL${fragmentName}Fragment>[] = [
            ${gridColumnFields
                .map((column) => {
                    const columnDefinition: TsCodeRecordToStringObject = {
                        field: `"${column.name.replace(/\./g, "_")}"`, // field-name is used for api-filter, and api nests with underscore
                        headerName: `intl.formatMessage({ id: "${instanceGqlType}.${column.name}",  defaultMessage: "${
                            column.headerName || camelCaseToHumanReadable(column.name)
                        }" })`,
                        type: column.gridType ? `"${column.gridType}"` : undefined,
                        filterable: !filterFields.includes(column.name) ? `false` : undefined,
                        sortable: !sortFields.includes(column.name) ? `false` : undefined,
                        valueGetter: column.valueGetter,
                        valueOptions: column.valueOptions,
                        renderCell: column.renderCell,
                        width: column.width,
                        flex: column.flex,
                    };

                    if (typeof column.width === "undefined") {
                        const defaultMinWidth = 150;
                        columnDefinition.flex = 1;
                        columnDefinition.maxWidth = column.maxWidth;

                        if (
                            typeof column.minWidth === "undefined" &&
                            (typeof column.maxWidth === "undefined" || column.maxWidth >= defaultMinWidth)
                        ) {
                            columnDefinition.minWidth = defaultMinWidth;
                        } else if (typeof column.minWidth !== "undefined") {
                            columnDefinition.minWidth = column.minWidth;
                        }
                    }

                    return tsCodeRecordToString(columnDefinition);
                })
                .join(",\n")},
                ${
                    showActionsColumn
                        ? `{
                        ${actionsColumnProps.join(",\n")},
                        renderCell: (params) => {
                            return (
                                <>
                                ${
                                    config.actions?.componentImport?.name
                                        ? `<${config.actions.componentImport.name} renderCellParams={params} />`
                                        : ""
                                }${
                              allowEditing
                                  ? `
                                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                                            <Edit color="primary" />
                                        </IconButton>`
                                  : ""
                          }${
                              allowCopyPaste || allowDeleting
                                  ? `
                                        <CrudContextMenu
                                            ${
                                                allowCopyPaste
                                                    ? `
                                            copyData={() => {
                                                // Don't copy id, because we want to create a new entity with this data
                                                ${
                                                    createMutationInputFields.filter((field) => rootBlocks[field.name]).length
                                                        ? `const { id, ...filteredData } = filterByFragment(${instanceGqlTypePlural}Fragment, params.row);
                                                        return {
                                                            ...filteredData,
                                                            ${createMutationInputFields
                                                                .filter((field) => rootBlocks[field.name])
                                                                .map((field) => {
                                                                    if (rootBlocks[field.name]) {
                                                                        const blockName = rootBlocks[field.name].name;
                                                                        return `${field.name}: ${blockName}.state2Output(${blockName}.input2State(filteredData.${field.name}))`;
                                                                    }
                                                                })
                                                                .join(",\n")}
                                                        };`
                                                        : `const { id, ...filteredData } = filterByFragment(${instanceGqlTypePlural}Fragment, params.row);
                                                        return filteredData;`
                                                }
                                            }}
                                            onPaste={async ({ input }) => {
                                                await client.mutate<GQLCreate${gqlType}Mutation, GQLCreate${gqlType}MutationVariables>({
                                                    mutation: create${gqlType}Mutation,
                                                    variables: { ${[
                                                        ...gqlArgs
                                                            .filter((gqlArg) => gqlArg.queryOrMutationName === createMutationType.name)
                                                            .map((arg) => arg.name),
                                                        ...(hasScope ? [`scope`] : []),
                                                        ...["input"],
                                                    ].join(", ")} },
                                                });
                                            }}
                                            `
                                                    : ""
                                            }
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
                        },
                    },`
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
                    ...(hasFilter ? (hasFilterProp ? ["filter: filter ? { and: [gqlFilter, filter] } : gqlFilter"] : ["filter: gqlFilter"]) : []),
                    ...(hasSearch ? ["search: gqlSearch"] : []),
                    ...[
                        `offset: dataGridProps.page * dataGridProps.pageSize`,
                        `limit: dataGridProps.pageSize`,
                        `sort: muiGridSortToGql(dataGridProps.sortModel)`,
                    ],
                ].join(", ")}
            },
        });
        const rowCount = useBufferedRowCount(data?.${gridQuery}.totalCount);
        if (error) throw error;
        const rows = data?.${gridQuery}.nodes ?? [];

        return (
            <MainContent fullHeight disablePadding>
                <DataGridPro
                    {...dataGridProps}
                    disableSelectionOnClick
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    loading={loading}
                    components={{
                        Toolbar: ${gqlTypePlural}GridToolbar,
                    }}
                />
            </MainContent>
        );
    }
    `;

    return {
        code,
        gqlDocuments,
    };
}
