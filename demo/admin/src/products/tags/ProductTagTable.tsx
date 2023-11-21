import { useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    GridFilterButton,
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
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Box, Button, IconButton } from "@mui/material";
import { DataGridPro, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLCreateProductTagMutation,
    GQLCreateProductTagMutationVariables,
    GQLDeleteProductTagMutation,
    GQLDeleteProductTagMutationVariables,
    GQLProductsTagsListFragment,
    GQLProductTagsListQuery,
    GQLProductTagsListQueryVariables,
} from "./ProductTagTable.generated";

function ProductTagsTableToolbar() {
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
                            return filter<GQLProductsTagsListFragment>(productTagsFragment, params.row);
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
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    const rows = data?.productTags.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.productTags.totalCount);

    return (
        <Box sx={{ height: `calc(100vh - var(--comet-admin-master-layout-content-top-spacing))` }}>
            <DataGridPro
                {...dataGridProps}
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                error={error}
                components={{
                    Toolbar: ProductTagsTableToolbar,
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
