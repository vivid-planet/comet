import { useQuery } from "@apollo/client";
import {
    GridFilterButton,
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
import gql from "graphql-tag";
import * as React from "react";
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
                    <FormattedMessage id="products.newVariant" defaultMessage="New Variant" />
                </Button>
            </ToolbarItem>
        </Toolbar>
    );
}

function ProductVariantsGrid({ productId }: { productId: string }) {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductVariantsGrid") };
    //const sortModel = dataGridProps.sortModel;
    //const client = useApolloClient();

    const columns: GridColDef<GQLProductVariantsListFragment>[] = [
        { field: "name", headerName: "Name", width: 150 },
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
            productId,
            /*
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
            */
        },
    });
    const rows = data?.product.variants ?? [];
    const rowCount = useBufferedRowCount(data?.product.variants.length);

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
                    Toolbar: ProductVariantsGridToolbar,
                }}
            />
        </Box>
    );
}

const productVariantsFragment = gql`
    fragment ProductVariantsList on ProductVariant {
        id
        name
    }
`;

const productVariantsQuery = gql`
    query ProductVariantsList($productId: ID!) {
        product(id: $productId) {
            variants {
                ...ProductVariantsList
            }
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

export default ProductVariantsGrid;
