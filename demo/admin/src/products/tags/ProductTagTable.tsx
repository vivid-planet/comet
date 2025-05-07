import { useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    FillSpace,
    filterByFragment,
    type GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    Toolbar,
    ToolbarAutomaticTitleItem,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Box, IconButton } from "@mui/material";
import { DataGridPro, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import { FormattedMessage } from "react-intl";

import {
    type GQLCreateProductTagMutation,
    type GQLCreateProductTagMutationVariables,
    type GQLDeleteProductTagMutation,
    type GQLDeleteProductTagMutationVariables,
    type GQLProductsTagsListFragment,
    type GQLProductTagsListQuery,
    type GQLProductTagsListQueryVariables,
} from "./ProductTagTable.generated";

function ProductTagsTableToolbar() {
    return (
        <Toolbar>
            <ToolbarAutomaticTitleItem />
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <FillSpace />
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarItem>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                    <FormattedMessage id="products.newTag" defaultMessage="New Tag" />
                </Button>
            </ToolbarItem>
        </Toolbar>
    );
}

const columns: GridColDef<GQLProductsTagsListFragment>[] = [
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
                            await client.mutate<GQLCreateProductTagMutation, GQLCreateProductTagMutationVariables>({
                                mutation: createProductMutation,
                                variables: { input: { ...input, products: [] } },
                            });
                        }}
                        onDelete={async ({ client }) => {
                            await client.mutate<GQLDeleteProductTagMutation, GQLDeleteProductTagMutationVariables>({
                                mutation: deleteProductMutation,
                                variables: { id: params.row.id },
                            });
                        }}
                        refetchQueries={["ProductTagsList"]}
                        copyData={() => {
                            return filterByFragment<GQLProductsTagsListFragment>(productTagsFragment, params.row);
                        }}
                    />
                </>
            );
        },
    },
];

function ProductTagsTable() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductTagsGrid") };
    const sortModel = dataGridProps.sortModel;

    const { data, loading, error } = useQuery<GQLProductTagsListQuery, GQLProductTagsListQueryVariables>(productTagsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    if (error) {
        throw error;
    }
    const rows = data?.productTags.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.productTags.totalCount);

    return (
        <Box sx={{ height: `calc(100vh - var(--comet-admin-master-layout-content-top-spacing))` }}>
            <DataGridPro
                {...dataGridProps}
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                slots={{
                    toolbar: ProductTagsTableToolbar,
                }}
            />
        </Box>
    );
}

const productTagsFragment = gql`
    fragment ProductsTagsList on ProductTag {
        id
        title
        products {
            id
            title
        }
    }
`;

const productTagsQuery = gql`
    query ProductTagsList($offset: Int, $limit: Int, $sort: [ProductTagSort!], $filter: ProductTagFilter, $search: String) {
        productTags(offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search) {
            nodes {
                id
                ...ProductsTagsList
            }
            totalCount
        }
    }
    ${productTagsFragment}
`;

const deleteProductMutation = gql`
    mutation DeleteProductTag($id: ID!) {
        deleteProductTag(id: $id)
    }
`;

const createProductMutation = gql`
    mutation CreateProductTag($input: ProductTagInput!) {
        createProductTag(input: $input) {
            id
        }
    }
`;

export default ProductTagsTable;
