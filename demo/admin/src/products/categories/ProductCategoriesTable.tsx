import { useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    GridFilterButton,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    Toolbar,
    ToolbarAutomaticTitleItem,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
<<<<<<< HEAD:demo/admin/src/products/categories/ProductCategoriesTable.tsx
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Box, Button, IconButton } from "@mui/material";
=======
import { Add as AddIcon, Edit, Info } from "@comet/admin-icons";
import { Button, IconButton, Typography } from "@mui/material";
>>>>>>> main:demo/admin/src/products/ProductsTable.tsx
import { DataGridPro, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { filter } from "graphql-anywhere";
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
} from "./ProductCategoriesTable.generated";

function ProductCategoriesTableToolbar() {
    return (
        <Toolbar>
            <ToolbarAutomaticTitleItem />
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarItem>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="products.newCategory" defaultMessage="New Category" />
                </Button>
            </ToolbarItem>
        </Toolbar>
    );
}

const columns: GridColDef<GQLProductsCategoriesListFragment>[] = [
    {
        field: "title",
        headerName: "Title",
        width: 150,
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
                                variables: { input: { ...input, products: [] } },
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
                            return filter<GQLProductsCategoriesListFragment>(productCategoriesFragment, params.row);
                        }}
                    />
                </>
            );
        },
    },
];

function ProductCategoriesTable() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductCategoriesGrid") };
    const sortModel = dataGridProps.sortModel;

    const { data, loading, error } = useQuery<GQLProductCategoriesListQuery, GQLProductCategoriesListQueryVariables>(productCategoriesQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    const rows = data?.productCategories.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.productCategories.totalCount);

    return (
        <MainContent fullHeight disablePadding>
            <DataGridPro
                {...dataGridProps}
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                error={error}
                components={{
                    Toolbar: ProductCategoriesTableToolbar,
                }}
            />
        </MainContent>
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

export default ProductCategoriesTable;
