import { useQuery } from "@apollo/client";
import {
    DataGridToolbar,
    FillSpace,
    GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { Button, IconButton } from "@mui/material";
import { DataGridPro, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import { FormattedMessage } from "react-intl";

import {
    //GQLCreateProductMutation,
    //GQLCreateProductMutationVariables,
    //GQLDeleteProductMutation,
    //GQLDeleteProductMutationVariables,
    GQLProductVariantsListFragment,
    GQLProductVariantsListQuery,
    GQLProductVariantsListQueryVariables,
    //GQLUpdateProductVisibilityMutation,
    //GQLUpdateProductVisibilityMutationVariables,
} from "./ProductVariantsGrid.generated";

function ProductVariantsGridToolbar() {
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
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="products.newVariant" defaultMessage="New Variant" />
                </Button>
            </ToolbarItem>
        </DataGridToolbar>
    );
}

export function ProductVariantsGrid({ productId }: { productId: string }) {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductVariantsGrid") };
    const sortModel = dataGridProps.sortModel;
    //const client = useApolloClient();

    const columns: GridColDef<GQLProductVariantsListFragment>[] = [
        { field: "name", headerName: "Name", flex: 1 },
        /*
        {
            field: "visible",
            headerName: "Visible",
            width: 100,
            type: "boolean",
            renderCell: (params) => {
                return (
                    <CrudVisibility
                        visibility={params.row.visible}
                        onUpdateVisibility={async (visible) => {
                            await client.mutate<GQLUpdateProductVisibilityMutation, GQLUpdateProductVisibilityMutationVariables>({
                                mutation: updateProductVisibilityMutation,
                                variables: { id: params.row.id, visible },
                                optimisticResponse: {
                                    __typename: "Mutation",
                                    updateProductVisibility: { __typename: "Product", id: params.row.id, visible },
                                },
                            });
                        }}
                    />
                );
            },
        },
        */
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            width: 52,
            pinned: "right",
            renderCell: (params) => {
                return (
                    <>
                        <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit />
                        </IconButton>
                        {/*
                        <CrudContextMenu
                            ...
                        />
                        */}
                    </>
                );
            },
        },
    ];

    const { data, loading, error } = useQuery<GQLProductVariantsListQuery, GQLProductVariantsListQueryVariables>(productVariantsQuery, {
        variables: {
            product: productId,
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    if (error) {
        throw error;
    }
    const rows = data?.productVariants.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.productVariants.totalCount);

    return (
        <DataGridPro
            {...dataGridProps}
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            slots={{
                toolbar: ProductVariantsGridToolbar,
            }}
        />
    );
}
const productVariantsFragment = gql`
    fragment ProductVariantsList on ProductVariant {
        id
        name
    }
`;

const productVariantsQuery = gql`
    query ProductVariantsList(
        $product: ID!
        $offset: Int
        $limit: Int
        $sort: [ProductVariantSort!]
        $filter: ProductVariantFilter
        $search: String
    ) {
        productVariants(product: $product, offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search) {
            nodes {
                ...ProductVariantsList
            }
            totalCount
        }
    }
    ${productVariantsFragment}
`;
/*
const deleteProductMutation = gql`
    mutation DeleteProductVariant($id: ID!) {
        deleteProduct(id: $id)
    }
`;
const createProductMutation = gql`
    mutation CreateProductVariant($input: ProductVariantInput!) {
        createProduct(input: $input) {
            id
        }
    }
`;
*/
/*
const updateProductVisibilityMutation = gql`
    mutation UpdateProductVisibility($id: ID!, $visible: Boolean!) {
        updateProductVariantVisibility(id: $id, visible: $visible) {
            id
            visible
        }
    }
`;
*/
