import {
    IntrospectionEnumType,
    IntrospectionField,
    IntrospectionInputObjectType,
    IntrospectionInputValue,
    IntrospectionNamedTypeRef,
    IntrospectionObjectType,
    IntrospectionQuery,
} from "graphql";
import { plural } from "pluralize";

import { GeneratorReturn, GridColumnConfig, GridConfig } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { findRootBlocks } from "./utils/findRootBlocks";
import { generateFieldListGqlStringForGrid } from "./utils/generateFieldList";
import { generateGqlParamDefinition } from "./utils/generateGqlParamDefinition";

type TsCodeRecordToStringObject = Record<string, string | number | undefined>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleGridColumnConfig = GridColumnConfig<any> & { name: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SimpleGridConfig = Omit<GridConfig<any>, "columns"> & { columns: SimpleGridColumnConfig[] };

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

function findInputObjectType(input: IntrospectionInputValue, schema: IntrospectionQuery) {
    let type = input.type;
    if (type.kind == "NON_NULL") {
        type = type.ofType;
    }
    if (type.kind !== "INPUT_OBJECT") {
        throw new Error("must be INPUT_OBJECT");
    }
    const typeName = type.name;
    const filterType = schema.__schema.types.find((type) => type.kind === "INPUT_OBJECT" && type.name === typeName) as
        | IntrospectionInputObjectType
        | undefined;
    return filterType;
}

function getRequiredQueryArgs({ gridQueryType }: { gridQueryType: IntrospectionField }) {
    const skipParams = ["offset", "limit", "sort", "search", "filter", "scope"];
    const requiredParams: IntrospectionInputValue[] = [];
    gridQueryType.args.forEach((arg) => {
        if (skipParams.includes(arg.name)) return;
        if (arg.type.kind === "NON_NULL") {
            requiredParams.push(arg);
        }
    });
    return requiredParams;
}

function getRequiredMutationArgs({ createMutationType }: { createMutationType: IntrospectionField }) {
    const skipParams = ["input"];
    const requiredParams: IntrospectionInputValue[] = [];
    createMutationType.args.forEach((arg) => {
        if (skipParams.includes(arg.name)) return;
        if (arg.type.kind === "NON_NULL") {
            requiredParams.push(arg);
        }
    });
    return requiredParams;
}

function getFilterGQLTypeString({
    gridQueryType,
    gqlIntrospection,
}: {
    gridQueryType: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}): string | undefined {
    const filterArg = gridQueryType.args.find((arg) => arg.name === "filter");
    if (!filterArg) return;

    const filterType = findInputObjectType(filterArg, gqlIntrospection);
    if (!filterType) return;

    return `GQL${filterType.name}`;
}

function hasGridPropFilter({
    config,
    gridQueryType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    return config.filterProp && !!getFilterGQLTypeString({ gridQueryType, gqlIntrospection });
}

function getRequiredGqlArgs({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    const params: IntrospectionInputValue[] = [];
    getRequiredQueryArgs({ gridQueryType }).forEach((param) => {
        params.push(param);
    });
    if (createMutationType) {
        getRequiredMutationArgs({ createMutationType }).forEach((arg) => {
            // skip similar params
            if (params.find((addedArg) => addedArg.name === arg.name)) return;
            params.push(arg);
        });
    }

    const requiredParams: { type: string; name: string }[] = [];
    params.forEach((arg) => {
        if (arg.type.kind !== "NON_NULL") return;

        if (arg.type.ofType.kind === "SCALAR") {
            const nativeScalars = ["ID", "String", "Boolean", "Int", "Float", "DateTime", "JSONObject"];
            if (!nativeScalars.includes(arg.type.ofType.name)) {
                // probably just add to requiredParams-array, but needs to be tested
                console.warn(
                    `Currently not supported special SCALAR of type ${arg.type.ofType.name} in required param ${arg.name} of ${gridQueryType.name}${
                        createMutationType ? ` or ${createMutationType.name}` : ``
                    }`,
                );
            } else {
                requiredParams.push({ type: arg.type.ofType.name, name: arg.name });
            }
        } else if (arg.type.ofType.kind === "INPUT_OBJECT") {
            requiredParams.push({ type: arg.type.ofType.name, name: arg.name });
        } else if (arg.type.ofType.kind === "LIST") {
            console.warn(
                `Currently not supported kind LIST in required param ${arg.name} of ${gridQueryType.name}${
                    createMutationType ? ` or ${createMutationType.name}` : ``
                }`,
            );
        } else if (arg.type.ofType.kind === "ENUM") {
            console.warn(
                `Currently not  supported kind ENUM in required param ${arg.name} of ${gridQueryType.name}${
                    createMutationType ? ` or ${createMutationType.name}` : ``
                }`,
            );
        } else {
            throw new Error(`Not supported kind ${arg.type.ofType.kind}`);
        }
    });
    return requiredParams;
}
function getRequiredGqlArgTypesForImport({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    const types: string[] = [];
    const filterType = getFilterGQLTypeString({ gridQueryType, gqlIntrospection });
    if (filterType) {
        types.push(filterType);
    }
    getRequiredGqlArgs({ config, gridQueryType, createMutationType, gqlIntrospection }).forEach((arg) => {
        const nativeScalars = ["ID", "String", "Boolean", "Int", "Float", "DateTime", "JSONObject"];
        if (nativeScalars.includes(arg.type)) return;
        types.push(arg.type);
    });
    return types;
}

function generateGridPropsType({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gqlIntrospection: IntrospectionQuery;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
}) {
    const props: string[] = [];
    if (hasGridPropFilter({ config, gridQueryType, gqlIntrospection })) {
        const filterType = getFilterGQLTypeString({ gridQueryType, gqlIntrospection });
        props.push(`filter?: ${filterType};`);
    }
    getRequiredGqlArgs({ config, gridQueryType, createMutationType, gqlIntrospection }).forEach((arg) => {
        let type = arg.type;
        if (arg.type === "ID" || arg.type === "String" || arg.type === "DateTime") {
            type = "string";
        } else if (arg.type === "Boolean") {
            type = "boolean";
        } else if (arg.type === "Int" || arg.type === "Float") {
            type = "number";
        } else if (arg.type === "JSONObject") {
            type = "unknown"; // because any needs eslint-disable
        }
        props.push(`${arg.name}: ${type};`);
    });
    return props.length
        ? `type Props = {
        ${props.join("\n")}
    };`
        : undefined;
}

function generateGridProps({
    config,
    gridQueryType,
    createMutationType,
    gqlIntrospection,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: GridConfig<any>;
    gridQueryType: IntrospectionField;
    createMutationType?: IntrospectionField;
    gqlIntrospection: IntrospectionQuery;
}) {
    const props: string[] = [];
    getRequiredGqlArgs({ config, gridQueryType, createMutationType, gqlIntrospection }).forEach((requiredParam) => {
        props.push(requiredParam.name);
    });
    if (hasGridPropFilter({ config, gridQueryType, gqlIntrospection })) {
        props.push("filter");
    }
    return props.length ? `{${props.join(", ")}}: Props` : undefined;
}

export function generateGrid(
    {
        exportName,
        baseOutputFilename,
        targetDirectory,
        gqlIntrospection,
    }: { exportName: string; baseOutputFilename: string; targetDirectory: string; gqlIntrospection: IntrospectionQuery },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: SimpleGridConfig,
): GeneratorReturn {
    const gqlQueryScopeParamName = "scope";
    const gqlType = config.gqlType;
    const gqlTypePlural = plural(gqlType);
    //const title = config.title ?? camelCaseToHumanReadable(gqlType);
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const instanceGqlTypePlural = gqlTypePlural[0].toLowerCase() + gqlTypePlural.substring(1);
    const gridQuery = instanceGqlType != instanceGqlTypePlural ? instanceGqlTypePlural : `${instanceGqlTypePlural}List`;
    const gqlDocuments: Record<string, string> = {};
    //const imports: Imports = [];

    const fieldList = generateFieldListGqlStringForGrid(config.columns.filter((column) => String(column.name) !== "id")); // exclude id as it's always fetched

    const queries = gqlIntrospection.__schema.types.find((type) => type.name === "Query");
    if (!queries || queries.kind !== "OBJECT") throw new Error(`Missing Query-Type in schema. Do any queries exist?`);
    const mutations = gqlIntrospection.__schema.types.find((type) => type.name === "Mutation");
    if (!mutations || mutations.kind !== "OBJECT") throw new Error(`Missing Mutation-Type in schema. Do any mutations exist?`);

    const rootBlocks = findRootBlocks({ gqlType, targetDirectory }, gqlIntrospection);

    const gridQueryType = findQueryTypeOrThrow(gridQuery, gqlIntrospection);
    const queryScopeParam = gridQueryType?.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const createMutationType = findMutationType(`create${gqlType}`, gqlIntrospection);
    const createMutationScopeParam = createMutationType?.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const deleteMutationType = findMutationType(`delete${gqlType}`, gqlIntrospection);
    const deleteMutationScopeParam = deleteMutationType?.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const hasDeleteMutation = !!deleteMutationType;
    const hasCreateMutation = !!createMutationType;

    const allowCopyPaste = (typeof config.copyPaste === "undefined" || config.copyPaste === true) && !config.readOnly && hasCreateMutation;
    const allowAdding = (typeof config.add === "undefined" || config.add === true) && !config.readOnly;
    const allowEditing = (typeof config.edit === "undefined" || config.edit === true) && !config.readOnly;
    const allowDeleting = (typeof config.delete === "undefined" || config.delete === true) && !config.readOnly && hasDeleteMutation;

    const showActionsColumn = allowCopyPaste || allowEditing || allowDeleting;

    const filterArg = gridQueryType.args.find((arg) => arg.name === "filter");
    const hasFilter = !!filterArg;
    let filterFields: string[] = [];
    if (filterArg) {
        const filterType = findInputObjectType(filterArg, gqlIntrospection);
        if (!filterType) throw new Error("Can't find filter type");
        filterFields = filterType.inputFields.map((f) => f.name);
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
        sortFields = sortInputEnum.enumValues.map((v) => v.name);
    }

    const hasSearch = gridQueryType.args.some((arg) => arg.name === "search");
    const requiresScope = !!(queryScopeParam || createMutationScopeParam || deleteMutationScopeParam);

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

    // TODO compare result with this: https://github.com/vivid-planet/comet/pull/1751/files#diff-5e4664a3c7f414c9b2a7472fafb8a39d9adbb48c394d83e17d63ecfc6c438351
    const gridColumnFields = config.columns.map((column) => {
        const type = column.type;
        const name = String(column.name);

        let renderCell: string | undefined = undefined;
        let valueGetter: string | undefined = name.includes(".") ? `({ row }) => row.${name.replace(/\./g, "?.")}` : undefined;

        // TODO implement value-getter detection für nested
        let gridType: "number" | "boolean" | "dateTime" | "date" | undefined;

        if (type == "dateTime") {
            valueGetter = `({ row }) => row.${name} && new Date(row.${name})`;
            gridType = "dateTime";
        } else if (type == "date") {
            valueGetter = `({ row }) => row.${name} && new Date(row.${name})`;
            gridType = "date";
        } else if (type == "block") {
            if (rootBlocks[name]) {
                renderCell = `(params) => {
                        return <BlockPreviewContent block={${rootBlocks[name].name}} input={params.row.${name}} />;
                    }`;
            }
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

    ${(() => {
        const types = getRequiredGqlArgTypesForImport({ config, createMutationType, gqlIntrospection, gridQueryType });
        return types.length ? `import { ${types.join(", ")} }  from "@src/graphql.generated";` : ``;
    })()}
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
    import { filter as objectFilter } from "graphql-anywhere";
    import * as React from "react";
    import { FormattedMessage, useIntl } from "react-intl";
    ${Object.entries(rootBlocks)
        .map(([rootBlockKey, rootBlock]) => `import { ${rootBlock.name} } from "${rootBlock.import}";`)
        .join("\n")}

    const ${instanceGqlTypePlural}Fragment = gql\`
        fragment ${fragmentName} on ${gqlType} {
            id
            ${fieldList}
        }
    \`;

    const ${instanceGqlTypePlural}Query = gql\`
        query ${gqlTypePlural}Grid(${getRequiredQueryArgs({ gridQueryType }).reduce((acc, arg) => {
        let introspectionType = arg.type;
        let isRequired = false;
        if (arg.type.kind === "NON_NULL") {
            isRequired = true;
            introspectionType = arg.type.ofType;
        }
        let type = "";
        if (introspectionType.kind === "SCALAR") {
            type = introspectionType.name;
        } else {
            throw new Error(`Non scalar types not yet supported in required query params. Query: ${gqlTypePlural}Grid, Arg: ${arg.name}`);
        }
        if (!type) return acc;

        return `${acc}$${arg.name}: ${type}${isRequired ? "!" : ""},`;
    }, "")}$offset: Int, $limit: Int${hasSort ? `, $sort: [${gqlType}Sort!]` : ""}${hasSearch ? `, $search: String` : ""}${
        hasFilter ? `, $filter: ${gqlType}Filter` : ""
    }${queryScopeParam ? `, $scope: ${generateGqlParamDefinition(queryScopeParam)}` : ""}) {
            ${gridQuery}(${getRequiredQueryArgs({ gridQueryType }).reduce((acc, arg) => {
        return `${acc}${arg.name}: $${arg.name}, `;
    }, "")}offset: $offset, limit: $limit${hasSort ? `, sort: $sort` : ""}${hasSearch ? `, search: $search` : ""}${
        hasFilter ? `, filter: $filter` : ""
    }${queryScopeParam ? `, scope: $scope` : ""}) {
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
                mutation Delete${gqlType}($id: ID!${
                  deleteMutationScopeParam ? `, $scope: ${generateGqlParamDefinition(deleteMutationScopeParam)}` : ""
              }) {
                    delete${gqlType}(id: $id${deleteMutationScopeParam ? `, scope: $scope` : ""})
                }
            \`;`
            : ""
    }

    ${
        allowCopyPaste
            ? `const create${gqlType}Mutation = gql\`
        mutation Create${gqlType}(${getRequiredMutationArgs({ createMutationType }).reduce((acc, arg) => {
                  let introspectionType = arg.type;
                  let isRequired = false;
                  if (arg.type.kind === "NON_NULL") {
                      isRequired = true;
                      introspectionType = arg.type.ofType;
                  }
                  let type = "";
                  if (introspectionType.kind === "SCALAR") {
                      type = introspectionType.name;
                  } else {
                      throw new Error(`Non scalar types not yet supported in required mutation params. Mutation: create${gqlType}, Arg: ${arg.name}`);
                  }
                  if (!type) return acc;

                  return `${acc}$${arg.name}: ${type}${isRequired ? "!" : ""},`;
              }, "")}${createMutationScopeParam ? `$scope: ${generateGqlParamDefinition(createMutationScopeParam)}, ` : ""}$input: ${gqlType}Input!) {
            create${gqlType}(${getRequiredQueryArgs({ gridQueryType }).reduce((acc, arg) => {
                  return `${acc}${arg.name}: $${arg.name}, `;
              }, "")}${createMutationScopeParam ? `scope: $scope, ` : ""}input: $input) {
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

    ${generateGridPropsType({ config, gridQueryType, createMutationType, gqlIntrospection }) ?? ""}

    export function ${gqlTypePlural}Grid(${
        generateGridProps({ config, gridQueryType, createMutationType, gqlIntrospection }) ?? ""
    }): React.ReactElement {
        ${allowCopyPaste || allowDeleting ? "const client = useApolloClient();" : ""}
        const intl = useIntl();
        const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("${gqlTypePlural}Grid") };
        ${requiresScope ? `const { scope } = useContentScope();` : ""}

        const columns: GridColDef<GQL${fragmentName}Fragment>[] = [
            ${gridColumnFields
                .map((column) => {
                    const columnDefinition: TsCodeRecordToStringObject = {
                        field: `"${column.name}"`,
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
                field: "actions",
                headerName: "",
                sortable: false,
                filterable: false,
                type: "actions",
                align: "right",
                renderCell: (params) => {
                    return (
                        <>
                        ${
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
                                                const row = params.row;
                                                return {
                                                    ${createMutationInputFields
                                                        .map((field) => {
                                                            if (rootBlocks[field.name]) {
                                                                const blockName = rootBlocks[field.name].name;
                                                                return `${field.name}: ${blockName}.state2Output(${blockName}.input2State(row.${field.name}))`;
                                                            } else {
                                                                return `${field.name}: row.${field.name}`;
                                                            }
                                                        })
                                                        .join(",\n")}
                                                };
                                            }}
                                            onPaste={async ({ input }) => {
                                                await client.mutate<GQLCreate${gqlType}Mutation, GQLCreate${gqlType}MutationVariables>({
                                                    mutation: create${gqlType}Mutation,
                                                    variables: { ${[
                                                        ...getRequiredMutationArgs({ createMutationType }).map((arg) => arg.name),
                                                        ...(createMutationScopeParam ? [`scope`] : []),
                                                        ...[`input: objectFilter(${instanceGqlTypePlural}Fragment, input)`],
                                                    ].join(", ")} }
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
                                                    variables: { id: params.row.id${deleteMutationScopeParam ? `, scope` : ""} },
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
                    ...getRequiredQueryArgs({ gridQueryType }).map((arg) => arg.name),
                    ...(queryScopeParam ? ["scope"] : []),
                    `filter: { and: [${hasFilter ? `gqlFilter,` : ""} ${
                        hasGridPropFilter({ config, gridQueryType, gqlIntrospection }) ? `...(filter ? [filter] : []),` : "" // TODO handle disable GUI-element for filter defined in filter
                    }] }`,
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
