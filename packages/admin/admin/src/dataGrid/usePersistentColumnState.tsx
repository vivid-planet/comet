import { Breakpoint, useTheme } from "@mui/material";
import { DataGridProps, GridColumnVisibilityModel, useGridApiRef } from "@mui/x-data-grid";
import * as React from "react";

import { useWindowSize } from "../helpers/useWindowSize";
import { useStoredState } from "../hooks/useStoredState";
import { GridColDef, GridColView } from "./GridColDef";

type UserVisibilityChange = {
    column: string;
    visible: boolean;
    view: GridColView;
};

const getUpdatedUserVisibilityChanges = (
    existingUserChanges: UserVisibilityChange[],
    newColumnVisibilities: GridColumnVisibilityModel,
    currentView: GridColView,
): UserVisibilityChange[] => {
    let updatedUserChanges = [...existingUserChanges];

    Object.keys(newColumnVisibilities).forEach((changedColumn) => {
        const newVisible = newColumnVisibilities[changedColumn];

        updatedUserChanges = updatedUserChanges.filter((change) => {
            return change.column !== changedColumn || change.view !== currentView;
        });

        updatedUserChanges.push({
            column: changedColumn,
            visible: newVisible,
            view: currentView,
        });
    });

    return updatedUserChanges;
};

const useGridColumns = (apiRef: ReturnType<typeof useGridApiRef>) => {
    const [columns, setColumns] = React.useState<GridColDef[] | undefined>();

    React.useEffect(() => {
        // This will be `undefined` if the free version of DataGrid V5 is used.
        setColumns(apiRef.current?.getAllColumns?.());
    }, [apiRef]);

    return columns;
};

const useFinalVisibilityModel = (
    userChanges: UserVisibilityChange[],
    currentView: GridColView | null,
    apiRef: ReturnType<typeof useGridApiRef>,
): GridColumnVisibilityModel => {
    const visibilityModel: GridColumnVisibilityModel = {};
    const columns = useGridColumns(apiRef);

    columns?.forEach((column: GridColDef) => {
        if (column.showOnlyInView !== undefined) {
            visibilityModel[column.field] = column.showOnlyInView === currentView;
        }
    });

    userChanges.forEach((change) => {
        if (change.view === currentView) {
            visibilityModel[change.column] = change.visible;
        }
    });

    return visibilityModel;
};

const useCurrentView = (compactViewBreakpoint: Breakpoint, apiRef: ReturnType<typeof useGridApiRef>): GridColView => {
    const columns = useGridColumns(apiRef);
    const { breakpoints } = useTheme();
    const usingCompactView = useWindowSize().width < breakpoints.values[compactViewBreakpoint];
    const enableSwitchingBetweenViews = columns?.some((column: GridColDef) => typeof column.showOnlyInView !== "undefined");

    if (!enableSwitchingBetweenViews) {
        return "default";
    }

    return usingCompactView ? "compact" : "default";
};

export function usePersistentColumnState(stateKey: string, compactViewBreakpoint: Breakpoint = "md"): Omit<DataGridProps, "rows" | "columns"> {
    const apiRef = useGridApiRef();
    const currentView = useCurrentView(compactViewBreakpoint, apiRef);

    const [userVisibilityChanges, setUserVisibilityChanges] = useStoredState<UserVisibilityChange[]>(`${stateKey}UserColumnVisibilityChanges`, []);
    const columnVisibilityModel = useFinalVisibilityModel(userVisibilityChanges, currentView, apiRef);

    const handleColumnVisibilityModelChange = React.useCallback(
        (newModel: GridColumnVisibilityModel) => {
            setUserVisibilityChanges((existingChanges) => getUpdatedUserVisibilityChanges(existingChanges, newModel, currentView));
        },
        [currentView, setUserVisibilityChanges],
    );

    const [pinnedColumns, setPinnedColumns] = useStoredState<GridColumnVisibilityModel>(`${stateKey}PinnedColumns`, {});
    const handlePinnedColumnsChange = React.useCallback(
        (newModel: GridColumnVisibilityModel) => {
            setPinnedColumns(newModel);
        },
        [setPinnedColumns],
    );

    //no API for column dimensions as controlled state, export on change instead
    const columnDimensionsKey = `${stateKey}ColumnDimensions`;
    const initialColumnDimensions = React.useMemo(() => {
        const serializedState = window.localStorage.getItem(columnDimensionsKey);
        return serializedState ? JSON.parse(serializedState) : undefined;
    }, [columnDimensionsKey]);

    const handleColumnWidthChange = React.useCallback(() => {
        const newState = apiRef.current.exportState().columns?.dimensions ?? {};
        window.localStorage.setItem(columnDimensionsKey, JSON.stringify(newState));
    }, [columnDimensionsKey, apiRef]);

    //no API for column order as controlled state, export on change instead
    const columnOrderKey = `${stateKey}ColumnOrder`;
    const initialColumnOrder = React.useMemo(() => {
        const serializedState = window.localStorage.getItem(columnOrderKey);
        return serializedState ? JSON.parse(serializedState) : undefined;
    }, [columnOrderKey]);
    const handleColumnOrderChange = React.useCallback(() => {
        const newState = apiRef.current.exportState().columns?.orderedFields ?? undefined;
        window.localStorage.setItem(columnOrderKey, JSON.stringify(newState));
    }, [columnOrderKey, apiRef]);

    const initialState = {
        columns: {
            dimensions: initialColumnDimensions,
            orderedFields: initialColumnOrder,
        },
    };

    return {
        columnVisibilityModel,
        onColumnVisibilityModelChange: handleColumnVisibilityModelChange,

        // TODO find a better solution (problem: pinnedColumns is a Pro Feature)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pinnedColumns,
        onPinnedColumnsChange: handlePinnedColumnsChange,

        onColumnWidthChange: handleColumnWidthChange,

        onColumnOrderChange: handleColumnOrderChange,

        apiRef,
        initialState,
    };
}
