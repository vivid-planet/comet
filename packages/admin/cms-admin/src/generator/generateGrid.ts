import {
    IntrospectionEnumType,
    IntrospectionInputObjectType,
    IntrospectionInputValue,
    IntrospectionNamedTypeRef,
    IntrospectionObjectType,
    IntrospectionQuery,
} from "graphql";

import { CrudGeneratorConfig } from "./types";
import { buildNameVariants } from "./utils/buildNameVariants";
import { camelCaseToHumanReadable } from "./utils/camelCaseToHumanReadable";
import { findRootBlocks } from "./utils/findRootBlocks";
import { writeGenerated } from "./utils/writeGenerated";

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

export async function writeCrudGrid(
    { target: targetDirectory, entityName, ...generatorOptions }: CrudGeneratorConfig,
    schema: IntrospectionQuery,
): Promise<void> {
    const rootBlocks = findRootBlocks({ target: targetDirectory, entityName, ...generatorOptions }, schema);

    const instanceEntityName = entityName[0].toLowerCase() + entityName.substring(1);

    const { instanceNameSingular, instanceNamePlural, classNamePlural } = buildNameVariants(entityName);
    const gridQuery = instanceNameSingular != instanceNamePlural ? instanceNamePlural : `${instanceNamePlural}List`;
    const gridQueryType = findQueryTypeOrThrow(gridQuery, schema);

    const createMutationType = findMutationType(`create${entityName}`, schema);

    const hasDeleteMutation = !!findMutationType(`delete${entityName}`, schema);
    const hasCreateMutation = !!createMutationType;

    const filterArg = gridQueryType.args.find((arg) => arg.name === "filter");
    const hasFilter = !!filterArg;
    let filterFields: string[] = [];
    if (filterArg) {
        const filterType = findInputObjectType(filterArg, schema);
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
        const sortType = schema.__schema.types.find((type) => type.kind === "INPUT_OBJECT" && type.name === sortTypeName) as
            | IntrospectionInputObjectType
            | undefined;
        if (!sortType) throw new Error("Can't find sort type");
        const sortField = sortType.inputFields.find((i) => i.name == "field");
        if (!sortField) throw new Error("Can't find sortFieldName");
        if (sortField.type.kind !== "NON_NULL") throw new Error("sortField must be NON_NULL");
        if (sortField.type.ofType.kind != "ENUM") throw new Error("sortField must be NON_NULL->ENUM");
        const sortFieldEnumName = sortField.type.ofType.name;
        const sortInputEnum = schema.__schema.types.find((type) => type.kind === "ENUM" && type.name === sortFieldEnumName) as
            | IntrospectionEnumType
            | undefined;
        if (!sortInputEnum) throw new Error("Can't find sortInputEnum");
        sortFields = sortInputEnum.enumValues.map((v) => v.name);
    }

    const hasSearch = gridQueryType.args.some((arg) => arg.name === "search");
    const hasScope = gridQueryType.args.some((arg) => arg.name === "scope");
    const schemaEntity = schema.__schema.types.find((type) => type.kind === "OBJECT" && type.name === entityName) as
        | IntrospectionObjectType
        | undefined;
    if (!schemaEntity) throw new Error("didn't find entity in schema types");

    const gridColumnFields = schemaEntity.fields
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
        })
        .map((field) => {
            let type = field.type;
            if (type.kind == "NON_NULL") type = type.ofType;

            let renderCell: string | undefined = undefined;
            let valueGetter: string | undefined = undefined;

            let gridType: "number" | "boolean" | "dateTime" | "date" | undefined;
            if (type.kind == "SCALAR") {
                if (type.name == "Float" || type.name == "Int") {
                    gridType = "number" as const;
                } else if (type.name == "Boolean") {
                    gridType = "boolean" as const;
                } else if (type.name == "DateTime") {
                    gridType = "dateTime" as const;
                    valueGetter = `({ value }) => value && new Date(value)`;
                } else if (type.name == "Date") {
                    // ISO date
                    gridType = "date" as const;
                    valueGetter = `({ value }) => value && new Date(value)`;
                } else {
                    if (rootBlocks[field.name]) {
                        renderCell = `(params) => {
                            return <BlockPreviewContent block={${rootBlocks[field.name].name}} input={params.row.${field.name}} />;
                        }`;
                    }
                }
            } else if (type.kind == "ENUM") {
                const enumType = schema.__schema.types.find((t) => t.kind === "ENUM" && t.name === (type as IntrospectionNamedTypeRef).name) as
                    | IntrospectionEnumType
                    | undefined;
                if (!enumType) throw new Error(`Enum type not found`);
                const values = enumType.enumValues.map((i) => i.name);
                const valueOptions = `[${values
                    .map((i) => {
                        const id = `${instanceEntityName}.${field.name}.${i.charAt(0).toLowerCase() + i.slice(1)}`;
                        const label = `intl.formatMessage({ id: "${id}", defaultMessage: "${camelCaseToHumanReadable(i)}" })`;
                        return `{value: ${JSON.stringify(i)}, label: ${label}}, `;
                    })
                    .join(" ")}]`;

                return {
                    name: field.name,
                    description: field.description,
                    type,
                    gridType: "singleSelect" as const,
                    valueOptions,
                };
            }
            //TODO suppoort n:1 relation with singleSelect

            return {
                name: field.name,
                description: field.description,
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
            const inputType = findInputObjectType(inputArg, schema);
            if (!inputType) throw new Error("Can't find input type");
            createMutationInputFields = inputType.inputFields.filter((field) =>
                gridColumnFields.some((gridColumnField) => gridColumnField.name == field.name),
            );
        }
    }

    const out = `import { gql, useApolloClient, useQuery } from "@apollo/client";
    import {
        Button,
        CrudContextMenu,
        DataGridToolbar,
        GridColDef,
        GridFilterButton,
        MainContent,
        muiGridFilterToGql,
        muiGridSortToGql,
        StackLink,
        ToolbarActions,
        ToolbarFillSpace,
        ToolbarItem,
        useBufferedRowCount,
        useDataGridRemote,
        usePersistentColumnState,
    } from "@comet/admin";
    import { Add as AddIcon, Edit } from "@comet/admin-icons";
    import { BlockPreviewContent } from "@comet/blocks-admin";
    import { Alert, Box, IconButton } from "@mui/material";
    import { DataGridPro, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
    import { useContentScope } from "@src/common/ContentScopeProvider";
    import {
        GQL${classNamePlural}GridQuery,
        GQL${classNamePlural}GridQueryVariables,
        GQL${classNamePlural}ListFragment,
        GQLCreate${entityName}Mutation,
        GQLCreate${entityName}MutationVariables,
        GQLDelete${entityName}Mutation,
        GQLDelete${entityName}MutationVariables 
    } from "./${classNamePlural}Grid.generated";
    import * as React from "react";
    import { FormattedMessage, useIntl } from "react-intl";
    ${Object.entries(rootBlocks)
        .map(([rootBlockKey, rootBlock]) => `import { ${rootBlock.name} } from "${rootBlock.import}";`)
        .join("\n")}

    const ${instanceNamePlural}Fragment = gql\`
        fragment ${classNamePlural}List on ${entityName} {
            id
            ${gridColumnFields.map((field) => field.name).join("\n")}
        }
    \`;
    
    const ${instanceNamePlural}Query = gql\`
        query ${classNamePlural}Grid($offset: Int, $limit: Int${hasSort ? `, $sort: [${entityName}Sort!]` : ""}${
        hasSearch ? `, $search: String` : ""
    }${hasFilter ? `, $filter: ${entityName}Filter` : ""}${hasScope ? `, $scope: ${entityName}ContentScopeInput!` : ""}) {
            ${gridQuery}(offset: $offset, limit: $limit${hasSort ? `, sort: $sort` : ""}${hasSearch ? `, search: $search` : ""}${
        hasFilter ? `, filter: $filter` : ""
    }${hasScope ? `, scope: $scope` : ""}) {
                nodes {
                    ...${classNamePlural}List
                }
                totalCount
            }
        }
        \${${instanceNamePlural}Fragment}
    \`;
    
    ${
        hasDeleteMutation
            ? `const delete${entityName}Mutation = gql\`
                mutation Delete${entityName}($id: ID!) {
                    delete${entityName}(id: $id)
                }
            \`;`
            : ""
    }

    ${
        hasCreateMutation
            ? `const create${entityName}Mutation = gql\`
        mutation Create${entityName}(${hasScope ? `$scope: ${entityName}ContentScopeInput!, ` : ""}$input: ${entityName}Input!) {
            create${entityName}(${hasScope ? `scope: $scope, ` : ""}input: $input) {
                id
            }
        }
    \`;`
            : ""
    }

    function ${classNamePlural}GridToolbar() {
        return (
            <DataGridToolbar>
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
                    <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                        <FormattedMessage id="${instanceEntityName}.new${entityName}" defaultMessage="New ${entityName}" />
                    </Button>
                </ToolbarActions>`
                        : ""
                }
            </DataGridToolbar>
        );
    }
    
    export function ${classNamePlural}Grid(): React.ReactElement {
        const client = useApolloClient();
        const intl = useIntl();
        const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("${classNamePlural}Grid") };
        ${hasScope ? `const { scope } = useContentScope();` : ""}
    
        const columns: GridColDef<GQL${classNamePlural}ListFragment>[] = [
            ${gridColumnFields
                .map((field) =>
                    tsCodeRecordToString({
                        field: `"${field.name}"`,
                        headerName: `intl.formatMessage({ id: "${instanceEntityName}.${field.name}",  defaultMessage: "${camelCaseToHumanReadable(
                            field.name,
                        )}" })`,
                        type: field.gridType ? `"${field.gridType}"` : undefined,
                        filterable: !filterFields.includes(field.name) ? `false` : undefined,
                        sortable: !sortFields.includes(field.name) ? `false` : undefined,
                        valueGetter: field.valueGetter,
                        valueOptions: field.valueOptions,
                        width: "150",
                        renderCell: field.renderCell,
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
                                    await client.mutate<GQLCreate${entityName}Mutation, GQLCreate${entityName}MutationVariables>({
                                        mutation: create${entityName}Mutation,
                                        variables: { ${hasScope ? `scope, ` : ""}input },
                                    });
                                }}
                                `
                                        : ""
                                }
                                ${
                                    hasDeleteMutation
                                        ? `
                                onDelete={async () => {
                                    await client.mutate<GQLDelete${entityName}Mutation, GQLDelete${entityName}MutationVariables>({
                                        mutation: delete${entityName}Mutation,
                                        variables: { id: params.row.id },
                                    });
                                }}
                                `
                                        : ""
                                }
                                refetchQueries={[${instanceNamePlural}Query]}
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
    
        const { data, loading, error } = useQuery<GQL${classNamePlural}GridQuery, GQL${classNamePlural}GridQueryVariables>(${instanceNamePlural}Query, {
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
            <MainContent fullHeight>
                <DataGridPro
                    {...dataGridProps}
                    disableSelectionOnClick
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    loading={loading}
                    components={{
                        Toolbar: ${classNamePlural}GridToolbar,
                    }}
                />
            </MainContent>
        );
    }
    `;
    writeGenerated(`${targetDirectory}/${classNamePlural}Grid.tsx`, out);
}
