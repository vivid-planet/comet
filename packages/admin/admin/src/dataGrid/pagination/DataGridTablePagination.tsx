import { type ComponentsOverrides, TablePagination, type TablePaginationProps, type Theme, type Typography, useThemeProps } from "@mui/material";
import { gridPageCountSelector, gridPaginationSelector, useGridApiContext, useGridRootProps, useGridSelector } from "@mui/x-data-grid-pro";
import { type ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import { type ChangeEvent, type FunctionComponent, useCallback } from "react";
import { FormattedMessage } from "react-intl";

import { Root, Title } from "./DataGridTablePagination.styles";
import { DataGridTablePaginationActions } from "./tablePaginationActions/DataGridTablePaginationActions";

export type DataGridTablePaginationClassKey = "root" | "title";

export type DataGridTablePaginationProps = ThemedComponentBaseProps<{
    root: "div";
    title: typeof Typography;
}>;

export const DataGridTablePagination: FunctionComponent<DataGridTablePaginationProps> = (inProps) => {
    const {
        sx,
        className,
        slotProps = {},
    } = useThemeProps({
        props: inProps,
        name: "CometAdminDataGridTablePagination",
    });

    const apiRef = useGridApiContext();
    const rootProps = useGridRootProps();

    const paginationState = useGridSelector(apiRef, gridPaginationSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    const handlePageChange = useCallback<TablePaginationProps["onPageChange"]>(
        (event, page) => {
            apiRef.current.setPage(page);
        },
        [apiRef],
    );

    const handlePageSizeChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const newPageSize = Number(event.target.value);
            apiRef.current.setPageSize(newPageSize);
        },
        [apiRef],
    );

    return (
        <Root sx={sx} className={className} {...slotProps.root}>
            <Title variant="body2" {...slotProps.title}>
                <FormattedMessage
                    id="comet.dataGridTablePagination.itemsPerPage"
                    defaultMessage="{itemsFrom}-{itemsTo} of {itemsTotal} items"
                    values={{
                        itemsFrom: paginationState.paginationModel.page * paginationState.paginationModel.pageSize + 1,
                        itemsTo: Math.min(
                            (paginationState.paginationModel.page + 1) * paginationState.paginationModel.pageSize,
                            paginationState.rowCount,
                        ),
                        itemsTotal: paginationState.rowCount,
                    }}
                />
            </Title>

            <TablePagination
                ActionsComponent={DataGridTablePaginationActions}
                component="div"
                count={paginationState.rowCount}
                labelDisplayedRows={() => {
                    return null;
                }}
                labelRowsPerPage={<FormattedMessage defaultMessage="Items per page:" id="comet.dataGridTablePagination.itemsPerPageLabel" />}
                page={paginationState.paginationModel.page <= pageCount ? paginationState.paginationModel.page : pageCount}
                rowsPerPage={paginationState.paginationModel.pageSize}
                rowsPerPageOptions={rootProps.pageSizeOptions?.includes(paginationState.paginationModel.pageSize) ? rootProps.pageSizeOptions : []}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handlePageSizeChange}
            />
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDataGridTablePagination: DataGridTablePaginationProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDataGridTablePagination: DataGridTablePaginationClassKey;
    }

    interface Components {
        CometAdminDataGridTablePagination?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDataGridTablePagination"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDataGridTablePagination"];
        };
    }
}
