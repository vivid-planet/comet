import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    DataGridToolbar,
    filterByFragment,
    GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridPagingToGql,
    muiGridSortToGql,
    StackLink,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Button, IconButton } from "@mui/material";
import { DataGridPro, GridRowOrderChangeParams, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
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
        </DataGridToolbar>
    );
}

// this should move into component-function (like generated), sortable should depend on enableDragAndDrop
const columns: GridColDef<GQLProductsCategoriesListFragment>[] = [
    {
        field: "title",
        headerName: "Title",
        width: 150,
        sortable: false,
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
    const enableDragAndDrop = true;
    const client = useApolloClient();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductCategoriesGrid") };
    const sortModel = dataGridProps.sortModel;

    const { data, loading, error } = useQuery<GQLProductCategoriesListQuery, GQLProductCategoriesListQueryVariables>(productCategoriesQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            ...muiGridPagingToGql({ page: dataGridProps.page, pageSize: dataGridProps.pageSize }),
            sort: enableDragAndDrop ? [{ field: "position", direction: "ASC" }] : muiGridSortToGql(sortModel),
        },
    });
    const rows = data?.productCategories.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.productCategories.totalCount);

    const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
        await client.mutate<GQLUpdateProductCategoryMutation, GQLUpdateProductCategoryMutationVariables>({
            mutation: updateProductCategoryPositionMutation,
            variables: {
                id: params.row.id,
                position: dataGridProps.page ? dataGridProps.page * dataGridProps.pageSize + params.targetIndex : params.targetIndex + 1,
            },
        });
    };

    return (
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
            rowReordering={
                enableDragAndDrop &&
                (dataGridProps.filterModel?.items.length ?? 0) === 0 && // probably check muiGridFilterToGql because empty filter can exist
                (dataGridProps.filterModel?.quickFilterValues?.length ?? 0) === 0
            }
            onRowOrderChange={handleRowOrderChange}
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
