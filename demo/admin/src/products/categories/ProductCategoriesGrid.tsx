import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    DataGridToolbar,
    filterByFragment,
    GridColDef,
    ToolbarActions,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { useTheme } from "@mui/material";
import { DataGridPro, GridRenderCellParams, GridRowOrderChangeParams } from "@mui/x-data-grid-pro";
import * as React from "react";
import { useIntl } from "react-intl";

import {
    GQLCreateProductCategoryMutation,
    GQLCreateProductCategoryMutationVariables,
    GQLDeleteProductCategoryMutation,
    GQLDeleteProductCategoryMutationVariables,
    GQLProductCategoriesGridQuery,
    GQLProductCategoriesGridQueryVariables,
    GQLProductCategoryGridFutureFragment,
    GQLUpdateProductCategoryPositionMutation,
    GQLUpdateProductCategoryPositionMutationVariables,
} from "./ProductCategoriesGrid.generated";

const productCategoriesFragment = gql`
    fragment ProductCategoryGridFuture on ProductCategory {
        id
        title
        slug
        position
    }
`;

const productCategoriesQuery = gql`
    query ProductCategoriesGrid($offset: Int!, $limit: Int!, $sort: [ProductCategorySort!]) {
        productCategories(offset: $offset, limit: $limit, sort: $sort) {
            nodes {
                ...ProductCategoryGridFuture
            }
            totalCount
        }
    }
    ${productCategoriesFragment}
`;

const deleteProductCategoryMutation = gql`
    mutation DeleteProductCategory($id: ID!) {
        deleteProductCategory(id: $id)
    }
`;

const createProductCategoryMutation = gql`
    mutation CreateProductCategory($input: ProductCategoryInput!) {
        createProductCategory(input: $input) {
            id
        }
    }
`;

const updateProductCategoryPositionMutation = gql`
    mutation UpdateProductCategoryPosition($id: ID!, $input: ProductCategoryUpdateInput!) {
        updateProductCategory(id: $id, input: $input) {
            id
            updatedAt
            position
        }
    }
`;

function ProductCategoriesGridToolbar({ toolbarAction }: { toolbarAction?: React.ReactNode }) {
    return (
        <DataGridToolbar>
            <ToolbarActions>{toolbarAction}</ToolbarActions>
        </DataGridToolbar>
    );
}

type Props = {
    toolbarAction?: React.ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowAction?: (params: GridRenderCellParams<any, GQLProductCategoryGridFutureFragment, any>) => React.ReactNode;
    actionsColumnWidth?: number;
};

export function ProductCategoriesGrid({ toolbarAction, rowAction, actionsColumnWidth = 52 }: Props): React.ReactElement {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductCategoriesGrid") };

    const handleRowOrderChange = async ({ row: { id }, targetIndex }: GridRowOrderChangeParams) => {
        await client.mutate<GQLUpdateProductCategoryPositionMutation, GQLUpdateProductCategoryPositionMutationVariables>({
            mutation: updateProductCategoryPositionMutation,
            variables: { id, input: { position: targetIndex + 1 } },
            awaitRefetchQueries: true,
            refetchQueries: [productCategoriesQuery],
        });
    };

    const theme = useTheme();

    const columns: GridColDef<GQLProductCategoryGridFutureFragment>[] = [
        {
            field: "title",
            headerName: intl.formatMessage({ id: "productCategory.title", defaultMessage: "Titel" }),
            flex: 1,
            visible: theme.breakpoints.up("md"),
            minWidth: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: "slug",
            headerName: intl.formatMessage({ id: "productCategory.slug", defaultMessage: "Slug" }),
            flex: 1,
            minWidth: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: "position",
            headerName: intl.formatMessage({ id: "productCategory.position", defaultMessage: "Position" }),
            type: "number",
            filterable: false,
            sortable: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            align: "right",
            pinned: "right",
            width: actionsColumnWidth,
            renderCell: (params) => {
                return (
                    <>
                        {rowAction && rowAction(params)}
                        <CrudContextMenu
                            copyData={() => {
                                // Don't copy id, because we want to create a new entity with this data
                                const { id, ...filteredData } = filterByFragment(productCategoriesFragment, params.row);
                                return filteredData;
                            }}
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateProductCategoryMutation, GQLCreateProductCategoryMutationVariables>({
                                    mutation: createProductCategoryMutation,
                                    variables: { input },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteProductCategoryMutation, GQLDeleteProductCategoryMutationVariables>({
                                    mutation: deleteProductCategoryMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={[productCategoriesQuery]}
                        />
                    </>
                );
            },
        },
    ];

    const { data, loading, error } = useQuery<GQLProductCategoriesGridQuery, GQLProductCategoriesGridQueryVariables>(productCategoriesQuery, {
        variables: {
            offset: 0,
            limit: 100,
            sort: { field: "position", direction: "ASC" },
        },
    });
    const rowCount = useBufferedRowCount(data?.productCategories.totalCount);
    if (error) throw error;
    const rows =
        data?.productCategories.nodes.map((node) => ({
            ...node,
            __reorder__: node.title,
        })) ?? [];

    return (
        <DataGridPro
            {...dataGridProps}
            disableSelectionOnClick
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            components={{
                Toolbar: ProductCategoriesGridToolbar,
            }}
            componentsProps={{
                toolbar: { toolbarAction },
            }}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
            hideFooterPagination
        />
    );
}
