import { useQuery } from "@apollo/client";
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
import {
    GQLShopProductCategoriesQuery,
    GQLShopProductCategoriesQueryVariables,
} from "@src/shop/shopProductPage/tabs/shopProductCategories/ShopProductCategoriesSelectDialog.generated";
import gql from "graphql-tag";
import * as React from "react";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

interface ShopProductCategoriesSelectDialogProps {
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    selectedCategories: GridSelectionModel;
    setRows: React.Dispatch<
        React.SetStateAction<{ __typename?: "ShopProductCategory" | undefined; id: string; name: string; description: string; isNew: boolean }[]>
    >;
    setAllowFiltering: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ShopProductCategoriesSelectDialog: React.FC<ShopProductCategoriesSelectDialogProps> = ({
    dialogOpen,
    setDialogOpen,
    selectedCategories,
    setRows,
    setAllowFiltering,
}) => {
    const onMenuClose = () => {
        setDialogOpen(false);
    };
    const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("AllCategoriesGrid") };
    const sortModel = dataGridProps.sortModel;
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
    const handleSelectionModelChange = (newSelectionModel: GridSelectionModel) => {
        setSelectionModel(newSelectionModel);
    };
    const handleApply = () => {
        setAllowFiltering(false);
        setRows(rows.filter((row) => selectionModel.includes(row.id)).map((row) => ({ ...row, isNew: !selectedCategories.includes(row.id) })));
        onMenuClose();
    };
    useEffect(() => {
        setSelectionModel(selectedCategories);
    }, [selectedCategories]);
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
                <Button variant="contained" type="submit" onClick={handleApply}>
                    <FormattedMessage {...messages.apply} />
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
