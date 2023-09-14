import { useApolloClient, useQuery } from "@apollo/client";
import {
    messages,
    muiGridFilterToGql,
    muiGridSortToGql,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Info } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { GridSelectionModel } from "@mui/x-data-grid";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { GQLShopProductCategory } from "@src/graphql.generated";
import { useSaveShopProductHandler } from "@src/shop/shopProductPage/SaveShopProductHandler";
import {
    GQLShopProductCategoriesQuery,
    GQLShopProductCategoriesQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesSelectDialog.generated";
import { updateShopProductMutation } from "@src/shop/shopProductPage/tabs/shopProductInformation/ShopProductInformationPage";
import {
    GQLUpdateShopProductMutation,
    GQLUpdateShopProductMutationVariables,
} from "@src/shop/shopProductPage/tabs/shopProductInformation/ShopProductInformationPage.generated";
import gql from "graphql-tag";
import * as React from "react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

interface ShopProductCategoriesSelectDialogProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    shopProductId: string;
    selectedCategories: GridSelectionModel;
}

export const ShopProductCategoriesSelectDialog: React.FC<ShopProductCategoriesSelectDialogProps> = ({
    dialogOpen,
    setDialogOpen,
    shopProductId,
    selectedCategories,
}) => {
    const onMenuClose = () => {
        setDialogOpen(false);
    };
    const { registerHandleSubmit } = useSaveShopProductHandler();
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("AllCategoriesGrid") };
    const sortModel = dataGridProps.sortModel;
    useEffect(() => {
        setSelectionModel(selectedCategories);
    }, [selectedCategories]);
    const client = useApolloClient();
    const handleSelectionModelChange = (newSelectionModel: GridSelectionModel) => {
        setSelectionModel(newSelectionModel);
    };
    const handleSubmit = async (categoryIdList: GridSelectionModel) => {
        onMenuClose();
        return client.mutate<GQLUpdateShopProductMutation, GQLUpdateShopProductMutationVariables>({
            mutation: updateShopProductMutation,
            variables: { id: shopProductId, input: { category: categoryIdList.map((id) => id.toString()) } },
        });
    };
    registerHandleSubmit(handleSubmit);
    const NameHeader = () => (
        <div style={{ display: "flex", alignItems: "center" }}>
            <Typography fontWeight={400} fontSize={14}>
                Name
            </Typography>
            <Tooltip
                trigger="click"
                title={<FormattedMessage id="shopProducts.categories.dialog.datagrid.name" defaultMessage="The title/name of the category" />}
            >
                <IconButton>
                    <Info />
                </IconButton>
            </Tooltip>
        </div>
    );
    const columns: GridColDef<GQLShopProductCategory>[] = [
        {
            field: "name",
            headerName: "Name",
            width: 150,
            renderHeader: () => <NameHeader />,
        },
        { field: "description", headerName: "Description", width: 600 },
    ];
    const { data, loading, error } = useQuery<GQLShopProductCategoriesQuery, GQLShopProductCategoriesQueryVariables>(shopProductCategoriesQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    const rows = data?.shopProductCategories.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.shopProductCategories.totalCount);

    return (
        <Dialog
            open={dialogOpen}
            onClose={() => {
                setDialogOpen(false);
                onMenuClose();
            }}
            maxWidth="md"
        >
            <DialogTitle>
                <FormattedMessage id="shopProducts.categories.dialog.title" defaultMessage="Select Categories" />
            </DialogTitle>
            <DialogContent>
                <DataGridPro
                    {...dataGridProps}
                    disableSelectionOnClick
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    loading={loading}
                    error={error}
                    checkboxSelection={true}
                    selectionModel={selectionModel}
                    onSelectionModelChange={handleSelectionModelChange}
                    autoHeight={true}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    type="button"
                    onClick={() => {
                        onMenuClose();
                    }}
                >
                    <FormattedMessage {...messages.cancel} />
                </Button>
                <Button
                    type="submit"
                    onClick={() => {
                        handleSubmit(selectionModel);
                    }}
                >
                    <FormattedMessage {...messages.ok} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const shopProductCategoriesQuery = gql`
    query ShopProductCategories($offset: Int!, $limit: Int!, $sort: [ShopProductCategorySort!], $filter: ShopProductCategoryFilter) {
        shopProductCategories(offset: $offset, limit: $limit, sort: $sort, filter: $filter) {
            totalCount
            nodes {
                id
                name
                description
            }
        }
    }
`;
