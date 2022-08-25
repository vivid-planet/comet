import { DataGridProProps, GridColumnVisibilityModel, useGridApiRef } from "@mui/x-data-grid-pro";
import * as React from "react";

import { useStoredState } from "../hooks/useStoredState";

export function usePersistentColumnState(stateKey: string): Omit<DataGridProProps, "rows" | "columns"> {
    const apiRef = useGridApiRef();

    const [columnVisibilityModel, setColumnVisibilityModel] = useStoredState<GridColumnVisibilityModel>(`${stateKey}ColumnVisibility`, {});
    const handleColumnVisibilityModelChange = React.useCallback(
        (newModel: GridColumnVisibilityModel) => {
            setColumnVisibilityModel(newModel);
        },
        [setColumnVisibilityModel],
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

        pinnedColumns,
        onPinnedColumnsChange: handlePinnedColumnsChange,

        onColumnWidthChange: handleColumnWidthChange,

        onColumnOrderChange: handleColumnOrderChange,

        apiRef,
        initialState,
    };
}
