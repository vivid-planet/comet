import {
    Button,
    CrudContextMenu,
    DataGridToolbar,
    FillSpace,
    type GridColDef,
    StackLink,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit as EditIcon } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGridPro, type GridSlotsComponent } from "@mui/x-data-grid-pro";
import { trpc } from "@src/trpc/client";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

type Product = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: number | null;
    type: string;
    inStock: boolean;
    status: string;
};

function ProductsGridToolbar() {
    return (
        <DataGridToolbar>
            <FillSpace />
            <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                <FormattedMessage id="products.newProduct" defaultMessage="New Product" />
            </Button>
        </DataGridToolbar>
    );
}

export function ProductsGrid() {
    const intl = useIntl();
    const trpcUtils = trpc.useUtils();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const deleteMutation = trpc.products.delete.useMutation();

    const columns: GridColDef<Product>[] = useMemo(() => {
        return [
            {
                field: "title",
                headerName: intl.formatMessage({ id: "product.title", defaultMessage: "Title" }),
                filterable: false,
                sortable: false,
                flex: 1,
                minWidth: 150,
            },
            {
                field: "slug",
                headerName: intl.formatMessage({ id: "product.slug", defaultMessage: "Slug" }),
                filterable: false,
                sortable: false,
                flex: 1,
                minWidth: 150,
            },
            {
                field: "type",
                headerName: intl.formatMessage({ id: "product.type", defaultMessage: "Type" }),
                filterable: false,
                sortable: false,
                flex: 1,
                minWidth: 100,
            },
            {
                field: "price",
                headerName: intl.formatMessage({ id: "product.price", defaultMessage: "Price" }),
                type: "number",
                filterable: false,
                sortable: false,
                renderCell: ({ value }) => {
                    return value != null ? <FormattedNumber value={value} style="currency" currency="EUR" /> : "-";
                },
                flex: 1,
                minWidth: 100,
            },
            {
                field: "inStock",
                headerName: intl.formatMessage({ id: "product.inStock", defaultMessage: "In stock" }),
                type: "boolean",
                filterable: false,
                sortable: false,
                flex: 1,
                minWidth: 80,
            },
            {
                field: "status",
                headerName: intl.formatMessage({ id: "product.status", defaultMessage: "Status" }),
                filterable: false,
                sortable: false,
                flex: 1,
                minWidth: 100,
            },
            {
                field: "actions",
                headerName: "",
                sortable: false,
                filterable: false,
                type: "actions",
                align: "right",
                pinned: "right",
                width: 84,
                renderCell: (params) => {
                    return (
                        <>
                            <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                                <EditIcon />
                            </IconButton>
                            <CrudContextMenu
                                onDelete={async () => {
                                    await deleteMutation.mutateAsync({ id: params.row.id });
                                    await trpcUtils.products.list.invalidate();
                                }}
                            />
                        </>
                    );
                },
            },
        ];
    }, [deleteMutation, intl, trpcUtils]);

    const { data, isLoading, error } = trpc.products.list.useQuery({ offset: 0, limit: 25, sort: { field: "title", direction: "ASC" } });
    const rowCount = useBufferedRowCount(data?.totalCount);
    if (error) throw error;
    const rows = data?.nodes ?? [];

    return (
        <DataGridPro
            {...dataGridProps}
            disableRowSelectionOnClick
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={isLoading}
            slots={{
                toolbar: ProductsGridToolbar as GridSlotsComponent["toolbar"],
            }}
        />
    );
}
