import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    DataGridToolbar,
    filterByFragment,
    GridColDef,
    StackLink,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Button, IconButton } from "@mui/material";
import { DataGridPro, GridRowOrderChangeParams } from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLCreateProductCategoryMutation,
    GQLCreateProductCategoryMutationVariables,
    GQLDeleteProductCategoryMutation,
    GQLDeleteProductCategoryMutationVariables,
    GQLProductCategoriesListQuery,
    GQLProductCategoriesListQueryVariables,
    GQLProductsCategoriesListFragment,
    GQLUpdateProductCategoryMutation,
    GQLUpdateProductCategoryMutationVariables,
} from "./ProductCategoriesTable.generated";

function ProductCategoriesTableToolbar() {
    return (
        <DataGridToolbar>
            {/* quickfilter and filter removed because of dnd */}
            <ToolbarFillSpace />
            <ToolbarItem>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="products.newCategory" defaultMessage="New Category" />
                </Button>
            </ToolbarItem>
        </DataGridToolbar>
    );
}

const columns: GridColDef<GQLProductsCategoriesListFragment>[] = [
    {
        field: "title",
        headerName: "Title",
        width: 150,
        sortable: false, // disabled because of dnd-sorting
        filterable: false, // disabled because of dnd-sorting
    },
    {
        field: "action",
        headerName: "",
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            return (
                <>
                    <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                        <Edit color="primary" />
                    </IconButton>
                    <CrudContextMenu
                        onPaste={async ({ input, client }) => {
                            await client.mutate<GQLCreateProductCategoryMutation, GQLCreateProductCategoryMutationVariables>({
                                mutation: createProductMutation,
                                variables: {
                                    input: {
                                        title: input.title,
                                        slug: input.slug,
                                    },
                                },
                            });
                        }}
                        onDelete={async ({ client }) => {
                            await client.mutate<GQLDeleteProductCategoryMutation, GQLDeleteProductCategoryMutationVariables>({
                                mutation: deleteProductMutation,
                                variables: { id: params.row.id },
                            });
                        }}
                        refetchQueries={["ProductCategoriesList"]}
                        copyData={() => {
                            return filterByFragment<GQLProductsCategoriesListFragment>(productCategoriesFragment, params.row);
                        }}
                    />
                </>
            );
        },
    },
];

function ProductCategoriesTable() {
    // dnd-sorting disables sorting, paging and filtering
    const client = useApolloClient();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductCategoriesGrid") };

    const { data, loading, error } = useQuery<GQLProductCategoriesListQuery, GQLProductCategoriesListQueryVariables>(productCategoriesQuery, {
        variables: {
            sort: [{ field: "position", direction: "ASC" }], // fixed to position because of dnd
        },
    });
    const rows = data?.productCategories.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.productCategories.totalCount);

    const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
        await client.mutate<GQLUpdateProductCategoryMutation, GQLUpdateProductCategoryMutationVariables>({
            mutation: updateProductCategoryPositionMutation,
            variables: {
                id: params.row.id,
                position: params.targetIndex + 1,
            },
        });
    };

    return (
        <DataGridPro
            {...dataGridProps}
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            error={error}
            components={{
                Toolbar: ProductCategoriesTableToolbar,
            }}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
            pagination={false}
            disableColumnFilter
        />
    );
}

const productCategoriesFragment = gql`
    fragment ProductsCategoriesList on ProductCategory {
        id
        slug
        title
        products {
            id
            title
        }
    }
`;

const productCategoriesQuery = gql`
    query ProductCategoriesList($offset: Int, $limit: Int, $sort: [ProductCategorySort!], $filter: ProductCategoryFilter, $search: String) {
        productCategories(offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search) {
            nodes {
                id
                ...ProductsCategoriesList
            }
            totalCount
        }
    }
    ${productCategoriesFragment}
`;

const deleteProductMutation = gql`
    mutation DeleteProductCategory($id: ID!) {
        deleteProductCategory(id: $id)
    }
`;

const createProductMutation = gql`
    mutation CreateProductCategory($input: ProductCategoryInput!) {
        createProductCategory(input: $input) {
            id
        }
    }
`;

const updateProductCategoryPositionMutation = gql`
    mutation UpdateProductCategory($id: ID!, $position: Int!) {
        updateProductCategoryPosition(id: $id, position: $position)
    }
`;

export default ProductCategoriesTable;
