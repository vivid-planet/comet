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
import { DataGridPro, type GridRowOrderChangeParams, type GridSlotsComponent } from "@mui/x-data-grid-pro";
import { trpc } from "@src/trpc/client";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

type ProductCategory = { id: string; title: string; slug: string; position: number };

function ProductCategoriesGridToolbar() {
    return (
        <DataGridToolbar>
            <FillSpace />
            <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                <FormattedMessage id="productCategory.productCategoriesGrid.newEntry" defaultMessage="New Product Category" />
            </Button>
        </DataGridToolbar>
    );
}

export function ProductCategoriesGrid() {
    const intl = useIntl();
    const trpcUtils = trpc.useUtils();
    const dataGridProps = { ...useDataGridRemote({ queryParamsPrefix: "productCategories" }), ...usePersistentColumnState("ProductCategoriesGrid") };
    const updatePositionMutation = trpc.productCategories.updatePosition.useMutation();
    const deleteMutation = trpc.productCategories.delete.useMutation();

    const handleRowOrderChange = async ({ row: { id }, targetIndex }: GridRowOrderChangeParams) => {
        await updatePositionMutation.mutateAsync({ id, position: targetIndex + 1 });
        await trpcUtils.productCategories.list.invalidate();
    };

    const columns: GridColDef<ProductCategory>[] = useMemo(() => {
        return [
            {
                field: "title",
                headerName: intl.formatMessage({ id: "productCategory.title", defaultMessage: "Title" }),
                filterable: false,
                sortable: false,
                flex: 1,
                minWidth: 150,
            },
            {
                field: "slug",
                headerName: intl.formatMessage({ id: "productCategory.slug", defaultMessage: "Slug" }),
                filterable: false,
                sortable: false,
                flex: 1,
                minWidth: 150,
            },
            {
                field: "position",
                headerName: intl.formatMessage({ id: "productCategory.position", defaultMessage: "Position" }),
                type: "number",
                filterable: false,
                sortable: false,
                renderCell: ({ value }) => {
                    return typeof value === "number" ? <FormattedNumber value={value} minimumFractionDigits={0} maximumFractionDigits={0} /> : "";
                },
                flex: 1,
                minWidth: 150,
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
                                    await trpcUtils.productCategories.list.invalidate();
                                }}
                            />
                        </>
                    );
                },
            },
        ];
    }, [deleteMutation, intl, trpcUtils]);

    const { data, isLoading, error } = trpc.productCategories.list.useQuery({ offset: 0, limit: 100, sort: { field: "position", direction: "ASC" } });
    const rowCount = useBufferedRowCount(data?.totalCount);
    if (error) throw error;
    const rows = data?.nodes.map((node) => ({ ...node, __reorder__: node.title })) ?? [];

    return (
        <DataGridPro
            {...dataGridProps}
            disableRowSelectionOnClick
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={isLoading}
            slots={{
                toolbar: ProductCategoriesGridToolbar as GridSlotsComponent["toolbar"],
            }}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
            hideFooterPagination
        />
    );
}
