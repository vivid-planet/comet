import {
    IntrospectionEnumType,
    IntrospectionInputObjectType,
    IntrospectionInputValue,
    IntrospectionNamedTypeRef,
    IntrospectionObjectType,
    IntrospectionQuery,
} from "graphql";
import { plural } from "pluralize";

import { GeneratorReturn, GridConfig } from "./generator";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { findRootBlocks } from "./utils/findRootBlocks";
import { generateGqlParamDefinition } from "./utils/generateGqlParamDefinition";

function tsCodeRecordToString(object: Record<string, string | undefined>) {
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
    const gqlQueryScopeParamName = "scope";
    const gqlType = config.gqlType;
    const gqlTypePlural = plural(gqlType);
    //const title = config.title ?? camelCaseToHumanReadable(gqlType);
    const instanceGqlType = gqlType[0].toLowerCase() + gqlType.substring(1);
    const instanceGqlTypePlural = gqlTypePlural[0].toLowerCase() + gqlTypePlural.substring(1);
    const gridQuery = instanceGqlType != instanceGqlTypePlural ? instanceGqlTypePlural : `${instanceGqlTypePlural}List`;
    const gqlDocuments: Record<string, string> = {};
    //const imports: Imports = [];

    const queries = gqlIntrospection.__schema.types.find((type) => type.name === "Query");
    if (!queries || queries.kind !== "OBJECT") throw new Error(`Missing Query-Type in schema. Do any queries exist?`);
    const mutations = gqlIntrospection.__schema.types.find((type) => type.name === "Mutation");
    if (!mutations || mutations.kind !== "OBJECT") throw new Error(`Missing Mutation-Type in schema. Do any mutations exist?`);

    const queryName = instanceGqlType;
    const introspectedQueryField = queries.fields.find((field) => field.name === queryName);
    if (!introspectedQueryField) throw new Error(`query "${queryName}" for ${gqlType} in schema not found`);
    const queryScopeParam = introspectedQueryField.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const createMutationName = `create${gqlType}`;
    const introspectedCreateMutationField = mutations.fields.find((field) => field.name === createMutationName);
    if (!introspectedCreateMutationField) throw new Error(`create-mutation "${createMutationName}" for ${gqlType} in schema not found`);
    const createMutationScopeParam = introspectedCreateMutationField.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const deleteMutationName = `delete${gqlType}`;
    const introspectedDeleteMutationField = mutations.fields.find((field) => field.name === deleteMutationName);
    if (!introspectedDeleteMutationField) throw new Error(`delete-mutation "${deleteMutationName}" for ${gqlType} in schema not found`);
    const deleteMutationScopeParam = introspectedDeleteMutationField.args.find((arg) => arg.name === gqlQueryScopeParamName);

    const rootBlocks = findRootBlocks({ gqlType, targetDirectory }, gqlIntrospection);

    const gridQueryType = findQueryTypeOrThrow(gridQuery, gqlIntrospection);

    const createMutationType = findMutationType(`create${gqlType}`, gqlIntrospection);

    const hasDeleteMutation = !!findMutationType(`delete${gqlType}`, gqlIntrospection);
    const hasCreateMutation = !!createMutationType;

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
        let valueGetter: string | undefined = undefined;

        let gridType: "number" | "boolean" | "dateTime" | "date" | undefined;

        if (type == "dateTime") {
            valueGetter = `({ value }) => value && new Date(value)`;
            gridType = "dateTime";
        } else if (type == "date") {
            valueGetter = `({ value }) => value && new Date(value)`;
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
            };
        }

        //TODO suppoort n:1 relation with singleSelect

        return {
            name,
            headerName: column.headerName,
            width: column.width,
            type,
            gridType,
            renderCell,
            valueGetter,
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
    import * as React from "react";
    import { FormattedMessage, useIntl } from "react-intl";
    ${Object.entries(rootBlocks)
        .map(([rootBlockKey, rootBlock]) => `import { ${rootBlock.name} } from "${rootBlock.import}";`)
        .join("\n")}
    
    const ${instanceGqlTypePlural}Fragment = gql\`
        fragment ${fragmentName} on ${gqlType} {
            id
            ${fieldsToLoad.map((field) => field.name).join("\n")}
        }
    \`;
    
    const ${instanceGqlTypePlural}Query = gql\`
        query ${gqlTypePlural}Grid($offset: Int, $limit: Int${hasSort ? `, $sort: [${gqlType}Sort!]` : ""}${hasSearch ? `, $search: String` : ""}${
        hasFilter ? `, $filter: ${gqlType}Filter` : ""
    }${queryScopeParam ? `, $scope: ${generateGqlParamDefinition(queryScopeParam)}` : ""}) {
            ${gridQuery}(offset: $offset, limit: $limit${hasSort ? `, sort: $sort` : ""}${hasSearch ? `, search: $search` : ""}${
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
        hasDeleteMutation
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
        hasCreateMutation
            ? `const create${gqlType}Mutation = gql\`
        mutation Create${gqlType}(${
                  createMutationScopeParam ? `$scope: ${generateGqlParamDefinition(createMutationScopeParam)}, ` : ""
              }$input: ${gqlType}Input!) {
            create${gqlType}(${createMutationScopeParam ? `scope: $scope, ` : ""}input: $input) {
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
                    hasCreateMutation
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

        
    export function ${gqlTypePlural}Grid(): React.ReactElement {
        const client = useApolloClient();
        const intl = useIntl();
        const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("${gqlTypePlural}Grid") };
        ${hasScope ? `const { scope } = useContentScope();` : ""}
    
        const columns: GridColDef<GQL${fragmentName}Fragment>[] = [
            ${gridColumnFields
                .map((column) =>
                    tsCodeRecordToString({
                        field: `"${column.name}"`,
                        headerName: `intl.formatMessage({ id: "${instanceGqlType}.${column.name}",  defaultMessage: "${
                            column.headerName || camelCaseToHumanReadable(column.name)
                        }" })`,
                        type: column.gridType ? `"${column.gridType}"` : undefined,
                        filterable: !filterFields.includes(column.name) ? `false` : undefined,
                        sortable: !sortFields.includes(column.name) ? `false` : undefined,
                        valueGetter: column.valueGetter,
                        valueOptions: column.valueOptions,
                        width: column.width ? String(column.width) : "150",
                        renderCell: column.renderCell,
                    }),
                )
                .join(",\n")},
            {
                field: "actions",
                headerName: "",
                sortable: false,
                filterable: false,
                type: "actions",
                renderCell: (params) => {
                    return (
                        <>
                            <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                                <Edit color="primary" />
                            </IconButton>
                            <CrudContextMenu
                                ${
                                    hasCreateMutation
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
                                        variables: { ${createMutationScopeParam ? `scope, ` : ""}input },
                                    });
                                }}
                                `
                                        : ""
                                }
                                ${
                                    hasDeleteMutation
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
                        </>
                    );
                },
            },
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
                ${hasScope ? `scope,` : ""}
                ${hasFilter ? `filter: gqlFilter,` : ""}
                ${hasSearch ? `search: gqlSearch,` : ""}
                offset: dataGridProps.page * dataGridProps.pageSize,
                limit: dataGridProps.pageSize,
                sort: muiGridSortToGql(dataGridProps.sortModel),
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
