import { Add, Check, Close, Reset } from "@comet/admin-icons";
import { Box, Button, Dialog, DialogContent, Divider, Typography, useMediaQuery, useTheme } from "@mui/material";
import {
    gridFilterableColumnDefinitionsSelector,
    GridFilterItem,
    gridFilterModelSelector,
    GridPanel,
    GridPanelProps,
    gridPreferencePanelStateSelector,
    GridPreferencePanelsValue,
    useGridApiContext,
    useGridRootProps,
    useGridSelector,
} from "@mui/x-data-grid";
import { ReactNode, useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";

const panelTypeTitle: Record<GridPreferencePanelsValue, ReactNode> = {
    [GridPreferencePanelsValue.filters]: <FormattedMessage id="dataGrid.panel.filters" defaultMessage="Filter" />,
    [GridPreferencePanelsValue.columns]: <FormattedMessage id="dataGrid.panel.columns" defaultMessage="Columns" />,
};

export const DataGridPanel = ({ children, open, ...restGridPanelProps }: GridPanelProps) => {
    const apiRef = useGridApiContext();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const { openedPanelValue } = useGridSelector(apiRef, gridPreferencePanelStateSelector);

    const rootProps = useGridRootProps();

    // Copied from MUI
    const getDefaultFilterItem = useCallback((): GridFilterItem | null => {
        const firstColumnWithOperator = filterableColumns.find((colDef) => colDef.filterOperators?.length);

        if (!firstColumnWithOperator) {
            return null;
        }

        return {
            columnField: firstColumnWithOperator.field,
            operatorValue: firstColumnWithOperator.filterOperators![0].value,
            id: Math.round(Math.random() * 1e5),
        };
    }, [filterableColumns]);

    // Copied from MUI
    const filterItems = useMemo<GridFilterItem[]>(() => {
        if (filterModel.items.length) {
            return filterModel.items;
        }

        const defaultItem = getDefaultFilterItem();

        return defaultItem ? [defaultItem] : [];
    }, [filterModel.items, getDefaultFilterItem]);

    // Copied from MUI
    const addNewFilter = () => {
        const defaultItem = getDefaultFilterItem();
        if (!defaultItem) {
            return;
        }
        apiRef.current.upsertFilterItems([...filterItems, defaultItem]);
    };

    const resetFilters = () => {
        apiRef.current.setFilterModel({ items: [] });
    };

    const closeDialog = () => {
        if (openedPanelValue === GridPreferencePanelsValue.filters) {
            apiRef.current.hideFilterPanel();
        } else {
            apiRef.current.hidePreferences();
        }
    };

    const theme = useTheme();
    const renderFullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const mobileDialogHeader = (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 4,
                py: 2,
                boxShadow: 4,
            }}
        >
            <Typography>{!!openedPanelValue && panelTypeTitle[openedPanelValue]}</Typography>
            <Button onClick={closeDialog} endIcon={<Close />} variant="text" color="info">
                <FormattedMessage id="dataGrid.panel.close" defaultMessage="Close" />
            </Button>
        </Box>
    );

    const mobileDialogFooter = (
        <Box>
            {openedPanelValue === GridPreferencePanelsValue.filters && !rootProps.disableMultipleColumnsFiltering && (
                <>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            px: 4,
                            py: 2,
                            boxShadow: 4,
                        }}
                    >
                        <Button startIcon={<Add />} onClick={addNewFilter}>
                            <FormattedMessage id="dataGrid.panel.addFilter" defaultMessage="Add filter" />
                        </Button>
                    </Box>
                    <Divider />
                </>
            )}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 4,
                    boxShadow: 4,
                }}
            >
                <div>
                    {openedPanelValue === GridPreferencePanelsValue.filters && (
                        <Button color="info" startIcon={<Reset />} onClick={resetFilters}>
                            <FormattedMessage id="dataGrid.panel.reset" defaultMessage="Reset all" />
                        </Button>
                    )}
                </div>
                <Button variant="contained" startIcon={<Check />} sx={{ flexBasis: "50%" }} onClick={closeDialog}>
                    <FormattedMessage id="dataGrid.panel.apply" defaultMessage="Apply" />
                </Button>
            </Box>
        </Box>
    );

    const desktopFiltersFooter = (
        <Box sx={{ display: "flex", justifyContent: "space-between", padding: 4 }}>
            <div>
                {!rootProps.disableMultipleColumnsFiltering && (
                    <Button color="info" startIcon={<Add />} onClick={addNewFilter}>
                        <FormattedMessage id="dataGrid.panel.addFilter" defaultMessage="Add filter" />
                    </Button>
                )}
            </div>
            <Button color="info" startIcon={<Reset />} onClick={resetFilters}>
                <FormattedMessage id="dataGrid.panel.resetFilters" defaultMessage="Reset filters" />
            </Button>
        </Box>
    );

    if (renderFullScreen) {
        return (
            <Dialog
                open={open}
                onClose={closeDialog}
                fullScreen
                sx={{
                    "& .MuiDataGrid-panelContent": {
                        maxHeight: "none",
                    },

                    "& .MuiDataGrid-panelFooter": {
                        // Hide MUIs footer so we can add our own with a better structure for styling
                        display: "none",
                    },

                    "& .MuiDataGrid-panelHeader": {
                        // Hide MUIs header as we don't need it according to our design
                        display: "none",
                    },
                }}
            >
                {mobileDialogHeader}
                <DialogContent sx={{ padding: 0, background: "transparent" }}>{children}</DialogContent>
                {mobileDialogFooter}
            </Dialog>
        );
    }

    return (
        <GridPanel
            onResize={undefined}
            onResizeCapture={undefined}
            open={open}
            {...restGridPanelProps}
            sx={{
                ...(openedPanelValue === GridPreferencePanelsValue.filters && {
                    "& .MuiDataGrid-panelFooter": {
                        // Hide MUIs footer so we can add our own with a better structure for styling
                        display: "none",
                    },
                }),
            }}
        >
            {children}
            {openedPanelValue === GridPreferencePanelsValue.filters && (
                <>
                    <Divider />
                    {desktopFiltersFooter}
                </>
            )}
        </GridPanel>
    );
};
