import { useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    GridFilterButton,
    muiGridFilterToGql,
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
import { Alert, Button, IconButton } from "@mui/material";
import { DataGridPro, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { GQLProductsListQuery, GQLProductsListQueryVariables } from "@src/graphql.generated";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

function ProductsTableToolbar() {
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
                    <FormattedMessage id="cometDemo.products.newProduct" defaultMessage="New Product" />
                </Button>
            </ToolbarItem>
        </Toolbar>
    );
}

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "price", headerName: "Price", width: 150, type: "number" },
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
                            await client.mutate({
                                mutation: createProductMutation,
                                variables: { input },
                            });
                        }}
                        onDelete={async ({ id, client }) => {
                            await client.mutate({
                                mutation: deleteProductMutation,
                                variables: { id },
                            });
                        }}
                        // url={url}
                        id={params.id}
                        refetchQueries={["ProductsList"]}
                        copyData={{
                            name: params.row.name,
                            description: params.row.description,
                            price: params.row.price,
                        }}
                    />
                </>
            );
        },
    },
];
function ProductsTable() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;

    const { filter, query } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            filter,
            query,
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sortColumnName: sortModel && sortModel.length > 0 ? sortModel[0].field : undefined,
            sortDirection: sortModel && sortModel.length > 0 ? (sortModel[0].sort == "desc" ? "DESC" : "ASC") : undefined,
        },
    });
    const rows = data?.products.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.products.totalCount);

    if (error) {
        return (
            <Alert severity="error">
                <FormattedMessage id="comet.error.abstractErrorMessage" defaultMessage="An error has occurred" />
            </Alert>
        );
        //return <>ERROR: {JSON.stringify(error)}</>;
    }

    return (
        <div>
            <div style={{ height: 600, width: "100%" /* TODO use full height (DataGrid fullHeight will make paging scroll down) */ }}>
                <DataGridPro
                    {...dataGridProps}
                    disableSelectionOnClick
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    loading={loading}
                    components={{
                        Toolbar: ProductsTableToolbar,
                    }}
                />
            </div>
        </div>
    );
}

const productsQuery = gql`
    query ProductsList($offset: Int, $limit: Int, $sortColumnName: String, $sortDirection: SortDirection, $filter: ProductFilter, $query: String) {
        products(offset: $offset, limit: $limit, sortColumnName: $sortColumnName, sortDirection: $sortDirection, filter: $filter, query: $query) {
            nodes {
                id
                name
                description
                price
            }
            totalCount
        }
    }
`;

const deleteProductMutation = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`;

const createProductMutation = gql`
    mutation CreateProduct($input: ProductInput!) {
        addProduct(data: $input) {
            id
        }
    }
`;

export default ProductsTable;
