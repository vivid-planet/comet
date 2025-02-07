import { Add, Check, Close, Reset } from "@comet/admin-icons";
import { ComponentsOverrides, css, Dialog, DialogContent, Divider, Theme, Typography, useMediaQuery, useTheme, useThemeProps } from "@mui/material";
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

import { Button } from "../common/buttons/Button";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

const panelTypeTitle: Record<GridPreferencePanelsValue, ReactNode> = {
    [GridPreferencePanelsValue.filters]: <FormattedMessage id="dataGrid.panel.filters" defaultMessage="Filters" />,
    [GridPreferencePanelsValue.columns]: <FormattedMessage id="dataGrid.panel.columns" defaultMessage="Columns" />,
};

type Slot =
    | "desktopGridPanel"
    | "desktopFilterPanelFooterDivider"
    | "desktopFilterPanelFooter"
    | "desktopAddFilterButton"
    | "mobileDialog"
    | "mobileDialogHeader"
    | "mobileDialogTitle"
    | "mobileDialogCloseButton"
    | "mobileDialogContent"
    | "mobileDialogFooter"
    | "mobileAddFilterButtonWrapper"
    | "mobileAddFilterButton"
    | "mobileFilterPanelFooterDivider"
    | "mobileDialogFooterActions"
    | "resetFiltersButton"
    | "applyButton";

export type DataGridPanelClassKey = Slot;

export type DataGridPanelProps = Pick<GridPanelProps, "open" | "children"> &
    Omit<
        ThemedComponentBaseProps<{
            desktopGridPanel: typeof GridPanel;
            desktopFilterPanelFooterDivider: typeof Divider;
            desktopFilterPanelFooter: "div";
            desktopAddFilterButton: typeof Button;
            mobileDialog: typeof Dialog;
            mobileDialogHeader: "div";
            mobileDialogTitle: typeof Typography;
            mobileDialogCloseButton: typeof Button;
            mobileDialogContent: typeof DialogContent;
            mobileDialogFooter: "div";
            mobileAddFilterButtonWrapper: "div";
            mobileAddFilterButton: typeof Button;
            mobileFilterPanelFooterDivider: typeof Divider;
            mobileDialogFooterActions: "div";
            resetFiltersButton: typeof Button;
            applyButton: typeof Button;
        }>,
        "sx"
    > & {
        iconMapping?: {
            closeDialog?: ReactNode;
            addFilter?: ReactNode;
            reset?: ReactNode;
            apply?: ReactNode;
        };
    };

type OwnerState = {
    openedPanelValue: GridPreferencePanelsValue | undefined;
};

const addFilterText = <FormattedMessage id="dataGrid.panel.addFilter" defaultMessage="Add filter" />;

export const DataGridPanel = (inProps: DataGridPanelProps) => {
    const { children, open, slotProps, iconMapping = {} } = useThemeProps({ props: inProps, name: "CometAdminDataGridPanel" });
    const apiRef = useGridApiContext();
    const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
    const filterableColumns = useGridSelector(apiRef, gridFilterableColumnDefinitionsSelector);
    const { openedPanelValue } = useGridSelector(apiRef, gridPreferencePanelStateSelector);

    const {
        closeDialog: closeDialogIcon = <Close />,
        addFilter: addFilterIcon = <Add />,
        reset: resetIcon = <Reset />,
        apply: applyIcon = <Check />,
    } = iconMapping;

    const rootProps = useGridRootProps();

    // Copied from MUI
    // TODO: Can we use the existing function from MUI somehow?
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
    // TODO: Can we use the existing function from MUI somehow?
    const filterItems = useMemo<GridFilterItem[]>(() => {
        if (filterModel.items.length) {
            return filterModel.items;
        }

        const defaultItem = getDefaultFilterItem();

        return defaultItem ? [defaultItem] : [];
    }, [filterModel.items, getDefaultFilterItem]);

    // Copied from MUI
    // TODO: Can we use the existing function from MUI somehow?
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

    const ownerState: OwnerState = {
        openedPanelValue,
    };

    const resetFiltersButton = (
        <ResetFiltersButton variant="outlined" startIcon={resetIcon} onClick={resetFilters} {...slotProps?.resetFiltersButton}>
            <FormattedMessage id="dataGrid.panel.reset" defaultMessage="Reset filters" />
        </ResetFiltersButton>
    );

    const applyButton = (
        <ApplyButton startIcon={applyIcon} onClick={closeDialog} {...slotProps?.applyButton}>
            <FormattedMessage id="dataGrid.panel.apply" defaultMessage="Apply" />
        </ApplyButton>
    );

    if (renderFullScreen) {
        return (
            <MobileDialog open={open} onClose={closeDialog} fullScreen {...slotProps?.mobileDialog}>
                <MobileDialogHeader {...slotProps?.mobileDialogHeader}>
                    <MobileDialogTitle {...slotProps?.mobileDialogTitle}>{!!openedPanelValue && panelTypeTitle[openedPanelValue]}</MobileDialogTitle>
                    <MobileDialogCloseButton {...slotProps?.mobileDialogCloseButton} variant="textDark" onClick={closeDialog}>
                        {closeDialogIcon}
                    </MobileDialogCloseButton>
                </MobileDialogHeader>
                <MobileDialogContent {...slotProps?.mobileDialogContent}>{children}</MobileDialogContent>
                <MobileDialogFooter {...slotProps?.mobileDialogFooter}>
                    {openedPanelValue === GridPreferencePanelsValue.filters && !rootProps.disableMultipleColumnsFiltering && (
                        <>
                            <MobileAddFilterButtonWrapper {...slotProps?.mobileAddFilterButtonWrapper}>
                                <MobileAddFilterButton
                                    variant="textDark"
                                    startIcon={addFilterIcon}
                                    onClick={addNewFilter}
                                    {...slotProps?.mobileAddFilterButton}
                                >
                                    {addFilterText}
                                </MobileAddFilterButton>
                            </MobileAddFilterButtonWrapper>
                            <MobileFilterPanelFooterDivider {...slotProps?.mobileFilterPanelFooterDivider} />
                        </>
                    )}
                    <MobileDialogFooterActions {...slotProps?.mobileDialogFooterActions}>
                        {openedPanelValue === GridPreferencePanelsValue.filters ? resetFiltersButton : <div />}
                        {applyButton}
                    </MobileDialogFooterActions>
                </MobileDialogFooter>
            </MobileDialog>
        );
    }

    return (
        <DesktopGridPanel
            onResize={undefined} // TODO: Can be removed in v8
            onResizeCapture={undefined} // TODO: Can be removed in v8
            open={open}
            ownerState={ownerState}
            {...slotProps?.desktopGridPanel}
        >
            {children}
            {openedPanelValue === GridPreferencePanelsValue.filters && (
                <>
                    <DesktopFilterPanelFooterDivider {...slotProps?.desktopFilterPanelFooterDivider} />
                    <DesktopFilterPanelFooter {...slotProps?.desktopFilterPanelFooter}>
                        <div>
                            {!rootProps.disableMultipleColumnsFiltering && (
                                <DesktopAddFilterButton variant="outlined" startIcon={addFilterIcon} onClick={addNewFilter}>
                                    {addFilterText}
                                </DesktopAddFilterButton>
                            )}
                        </div>
                        {resetFiltersButton}
                    </DesktopFilterPanelFooter>
                </>
            )}
        </DesktopGridPanel>
    );
};

const DesktopGridPanel = createComponentSlot(GridPanel)<DataGridPanelClassKey, OwnerState>({
    componentName: "DataGridPanel",
    slotName: "desktopGridPanel",
})(
    ({ ownerState }) => css`
        ${ownerState.openedPanelValue === GridPreferencePanelsValue.filters &&
        css`
            .MuiDataGrid-panelFooter {
                // Hide MUIs footer so we can add our own with a better structure for styling
                display: none;
            }
        `}
    `,
);

const DesktopFilterPanelFooterDivider = createComponentSlot(Divider)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "desktopFilterPanelFooterDivider",
})();

const DesktopFilterPanelFooter = createComponentSlot("div")<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "desktopFilterPanelFooter",
})(
    ({ theme }) => css`
        display: flex;
        justify-content: space-between;
        padding: ${theme.spacing(4)};
    `,
);

const DesktopAddFilterButton = createComponentSlot(Button)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "desktopAddFilterButton",
})();

const MobileDialog = createComponentSlot(Dialog)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileDialog",
})(css`
    .MuiDataGrid-panelContent {
        max-height: none;
    }

    .MuiDataGrid-panelFooter {
        // Hide MUIs footer so we can add our own with a better structure for styling
        display: none;
    }

    .MuiDataGrid-panelHeader {
        // Hide MUIs header as we don't need it according to our design
        display: none;
    }
`);

const MobileDialogHeader = createComponentSlot("div")<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileDialogHeader",
})(
    ({ theme }) => css`
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(2)};
        padding-left: ${theme.spacing(4)};
        box-shadow: ${theme.shadows[4]};
    `,
);

const MobileDialogTitle = createComponentSlot(Typography)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileDialogTitle",
})();

const MobileDialogCloseButton = createComponentSlot(Button)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileDialogCloseButton",
})(css`
    min-width: 0; // TODO: Should this be done in the theme?
`);

const MobileDialogContent = createComponentSlot(DialogContent)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileDialogContent",
})(
    ({ theme }) => css`
        padding: 0;
        background-color: white;

        ${theme.breakpoints.up("sm")} {
            padding: 0;
        }
    `,
);

const MobileDialogFooter = createComponentSlot("div")<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileDialogFooter",
})();

const MobileAddFilterButtonWrapper = createComponentSlot("div")<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileAddFilterButtonWrapper",
})(
    ({ theme }) => css`
        position: relative;
        display: flex;
        justify-content: center;
        padding: ${theme.spacing(2)} ${theme.spacing(4)};
        box-shadow: ${theme.shadows[4]};
    `,
);

const MobileAddFilterButton = createComponentSlot(Button)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileAddFilterButton",
})();

const MobileFilterPanelFooterDivider = createComponentSlot(Divider)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileFilterPanelFooterDivider",
})();

const MobileDialogFooterActions = createComponentSlot("div")<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "mobileDialogFooterActions",
})(
    ({ theme }) => css`
        display: flex;
        justify-content: space-between;
        padding: ${theme.spacing(4)};
        box-shadow: ${theme.shadows[4]};
    `,
);

const ResetFiltersButton = createComponentSlot(Button)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "resetFiltersButton",
})();

const ApplyButton = createComponentSlot(Button)<DataGridPanelClassKey>({
    componentName: "DataGridPanel",
    slotName: "applyButton",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminDataGridPanel: DataGridPanelProps;
    }

    interface ComponentNameToClassKey {
        CometAdminDataGridPanel: DataGridPanelClassKey;
    }

    interface Components {
        CometAdminDataGridPanel?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDataGridPanel"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDataGridPanel"];
        };
    }
}
