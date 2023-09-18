import { useQuery } from "@apollo/client";
import { muiGridFilterToGql, StackLink, useBufferedRowCount, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { Box, IconButton } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { GQLProductsListFragment } from "@src/products/ProductsGrid.generated";
import {
    GQLShopProductQuery,
    GQLShopProductQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesPage.generated";
import { ShopProductCategoriesSelectDialog } from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesSelectDialog";
import { ShopProductCategoriesToolbar } from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesToolbar";
import gql from "graphql-tag";
import React from "react";

export const ShopProductCategoriesPage: React.FunctionComponent<{ shopProductId: string }> = ({ shopProductId }) => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ShopProductCategoriesGrid") };
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const columns: GridColDef<GQLProductsListFragment>[] = [
        { field: "name", headerName: "Name", width: 150 },
        { field: "description", headerName: "Description", width: 600, flex: 1 },
        {
            field: "action",
            headerName: "Actions",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit color="primary" />
                        </IconButton>
                    </>
                );
            },
        },
    ];
    const { data, loading, error } = useQuery<GQLShopProductQuery, GQLShopProductQueryVariables>(shopProductCategoriesByShopProductIdQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            id: shopProductId,
        },
    });
    const rows = data?.shopProduct.category ?? [];
    const rowCount = useBufferedRowCount(data?.shopProduct.category.length);

    return (
        <>
            <Box sx={{ height: 700, width: "100%" }}>
                <DataGridPro
                    {...dataGridProps}
                    disableSelectionOnClick
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    loading={loading}
                    error={error}
                    components={{
                        Toolbar: () => {
                            return <ShopProductCategoriesToolbar setDialogOpen={setDialogOpen} />;
                        },
                    }}
                />
            </Box>
            <ShopProductCategoriesSelectDialog
                shopProductId={shopProductId}
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                selectedCategories={rows.map((category) => category.id)}
            />
        </>
    );
};

const shopProductCategoriesByShopProductIdQuery = gql`
    query ShopProduct($id: ID!) {
        shopProduct(id: $id) {
            id
            name
            description
            category {
                id
                name
                description
            }
        }
    }
`;
