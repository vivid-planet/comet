import { useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    DataGridToolbar,
    FillSpace,
    filterByFragment,
    type GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridPagingToGql,
    muiGridSortToGql,
    StackLink,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGridPro, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import { FormattedMessage } from "react-intl";

import {
    type GQLCreateProductCategoryMutation,
    type GQLCreateProductCategoryMutationVariables,
    type GQLDeleteProductCategoryMutation,
    type GQLDeleteProductCategoryMutationVariables,
    type GQLProductCategoriesListQuery,
    type GQLProductCategoriesListQueryVariables,
    type GQLProductsCategoriesListFragment,
} from "./ProductCategoriesTable.generated";

function ProductCategoriesTableToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <FillSpace />
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarItem>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
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
    },
    {
        field: "actions",
        type: "actions",
        headerName: "",
        sortable: false,
        filterable: false,
        renderCell: (params) => {
            return (
                <>
                    <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                        <Edit />
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
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductCategoriesGrid") };
    const sortModel = dataGridProps.sortModel;

    const { data, loading, error } = useQuery<GQLProductCategoriesListQuery, GQLProductCategoriesListQueryVariables>(productCategoriesQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            ...muiGridPagingToGql({ page: dataGridProps.paginationModel.page, pageSize: dataGridProps.paginationModel.pageSize }),
            sort: muiGridSortToGql(sortModel),
        },
    });
    if (error) {
        throw error;
    }
    const rows = data?.productCategories.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.productCategories.totalCount);

    return (
        <DataGridPro
            {...dataGridProps}
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            slots={{
                toolbar: ProductCategoriesTableToolbar,
            }}
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

export default ProductCategoriesTable;
