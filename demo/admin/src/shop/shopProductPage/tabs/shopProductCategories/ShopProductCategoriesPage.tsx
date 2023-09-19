import { useApolloClient, useQuery } from "@apollo/client";
import { CrudContextMenu, muiGridFilterToGql, useBufferedRowCount, useDataGridRemote, usePersistentColumnState } from "@comet/admin";
import { Edit } from "@comet/admin-icons";
import { RemoveCircleOutlineSharp } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { DataGridPro, GridCellParams, GridColDef } from "@mui/x-data-grid-pro";
import { useSaveShopProductHandler } from "@src/shop/shopProductPage/SaveShopProductHandler";
import {
    GQLShopProductQuery,
    GQLShopProductQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesPage.generated";
import { ShopProductCategoriesSelectDialog } from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesSelectDialog";
import { ShopProductCategoriesToolbar } from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesToolbar";
import { updateShopProductMutation } from "@src/shop/shopProductPage/tabs/shopProductInformation/ShopProductInformationPage";
import {
    GQLUpdateShopProductMutation,
    GQLUpdateShopProductMutationVariables,
} from "@src/shop/shopProductPage/tabs/shopProductInformation/ShopProductInformationPage.generated";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";

interface ShopProductCategoriesPageProps {
    shopProductId: string;
}

interface ShopProductCategoriesRow {
    __typename?: "ShopProductCategory";
    id: string;
    name: string;
    description: string;
    isNew?: boolean;
}

export const ShopProductCategoriesPage: React.FunctionComponent<ShopProductCategoriesPageProps> = ({ shopProductId }) => {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ShopProductCategoriesGrid") };
    const client = useApolloClient();
    const { registerHandleSubmit } = useSaveShopProductHandler();
    const [rows, setRows] = useState<ShopProductCategoriesRow[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [allowFiltering, setAllowFiltering] = useState(true);
    const rowCount = useBufferedRowCount(rows.length);
    const columns: GridColDef<ShopProductCategoriesRow>[] = [
        { field: "name", headerName: "Name", width: 150 },
        { field: "description", headerName: "Description", width: 600, flex: 1 },
        {
            field: "action",
            headerName: "",
            width: 150,
            sortable: false,
            filterable: false,
            renderCell: (params) => renderEditButton(params),
        },
    ];
    const { data, loading, error } = useQuery<GQLShopProductQuery, GQLShopProductQueryVariables>(shopProductCategoriesByShopProductIdQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            id: shopProductId,
        },
    });
    const renderEditButton = (params: GridCellParams) => {
        const handleRemove = () => {
            setAllowFiltering(false);
            setRows(rows.filter((row) => row.id !== params.row.id));
        };
        return (
            <>
                <IconButton onClick={handleRemove}>
                    <RemoveCircleOutlineSharp color="action" />
                </IconButton>
                <IconButton>
                    <Edit color="primary" />
                </IconButton>
                <IconButton>
                    <CrudContextMenu />
                </IconButton>
            </>
        );
    };

    useEffect(() => {
        if (data?.shopProduct) {
            setRows(data.shopProduct.category ?? []);
        }
    }, [data?.shopProduct]);
    useEffect(() => {
        const handleSubmit = async () => {
            return client.mutate<GQLUpdateShopProductMutation, GQLUpdateShopProductMutationVariables>({
                mutation: updateShopProductMutation,
                variables: { id: shopProductId, input: { category: rows.map((row) => row.id.toString()) } },
            });
        };
        registerHandleSubmit(handleSubmit);
    }, [client, registerHandleSubmit, rows, shopProductId]);

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
                        Toolbar: () => <ShopProductCategoriesToolbar setDialogOpen={setDialogOpen} allowFiltering={allowFiltering} />,
                    }}
                />
            </Box>
            <ShopProductCategoriesSelectDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                selectedCategories={rows.map((category) => category.id)}
                setRows={setRows}
                setAllowFiltering={setAllowFiltering}
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
