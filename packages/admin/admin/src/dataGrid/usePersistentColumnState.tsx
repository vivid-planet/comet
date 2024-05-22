import { DataGridProps, GridColumnVisibilityModel, useGridApiRef } from "@mui/x-data-grid";
import * as React from "react";

import { useStoredState } from "../hooks/useStoredState";
import { GridColDef } from "./GridColDef";

const useGridColumns = (apiRef: ReturnType<typeof useGridApiRef>) => {
    const [columns, setColumns] = React.useState<GridColDef[] | undefined>();

    React.useEffect(() => {
        // This will be `undefined` if the free version of DataGrid V5 is used.
        setColumns(apiRef.current?.getAllColumns?.());
    }, [apiRef]);

    return columns;
};

const useVisibilityModelFromColumnMediaQueries = (columns: GridColDef[] | undefined): GridColumnVisibilityModel => {
    const [visibilityModel, setVisibilityModel] = React.useState<GridColumnVisibilityModel>({});

    React.useEffect(() => {
        const updateVisibilityModel = () => {
            const visibilityModel: GridColumnVisibilityModel = {};

            columns?.forEach((column: GridColDef) => {
                if (column.visibleMediaQuery !== undefined) {
                    const mediaQuery = column.visibleMediaQuery.replace("@media", "").trim();
                    visibilityModel[column.field] = window.matchMedia(mediaQuery).matches;
                }
            });

            setVisibilityModel(visibilityModel);
        };

        updateVisibilityModel();
        window.addEventListener("resize", updateVisibilityModel);

        return () => {
            window.removeEventListener("resize", updateVisibilityModel);
        };
    }, [columns]);

    return visibilityModel;
};

export function usePersistentColumnState(stateKey: string): Omit<DataGridProps, "rows" | "columns"> {
    const apiRef = useGridApiRef();
    const columns = useGridColumns(apiRef);

    const mediaQueryColumnVisibilityModel = useVisibilityModelFromColumnMediaQueries(columns);
    const [storedColumnVisibilityModel, setStoredColumnVisibilityModel] = useStoredState<GridColumnVisibilityModel>(
        `${stateKey}ColumnVisibility`,
        {},
    );

    const handleColumnVisibilityModelChange = React.useCallback(
        (newModel: GridColumnVisibilityModel) => {
            const modelToStore: GridColumnVisibilityModel = {};

            // Do not store column visibility controlled by media queries.
            // This prevents stored values from a previous screen size from overriding the values.
            Object.entries(newModel).forEach(([field, visible]) => {
                const visibilityChangedByUser = mediaQueryColumnVisibilityModel[field] !== visible;
                if (visibilityChangedByUser) {
                    modelToStore[field] = visible;
                }
            });

            setStoredColumnVisibilityModel(modelToStore);
        },
        [mediaQueryColumnVisibilityModel, setStoredColumnVisibilityModel],
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
        columnVisibilityModel: { ...mediaQueryColumnVisibilityModel, ...storedColumnVisibilityModel },
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
