import { useTheme } from "@mui/material";
import { DataGrid, GridColumnVisibilityModel } from "@mui/x-data-grid";
import * as React from "react";

import { useWindowSize } from "../helpers/useWindowSize";

type VisibilityChange = {
    column: string;
    visibility: boolean;
    usingCompactView: boolean;
};

type ColumnVisibility = Record<
    string,
    {
        defaultView: boolean;
        compactView: boolean;
    }
>;

type DynamicVisibilityGridProps = {
    onColumnVisibilityModelChange: React.ComponentProps<typeof DataGrid>["onColumnVisibilityModelChange"];
    columnVisibilityModel: GridColumnVisibilityModel;
};

export const useDynamicGridVisibilityModel = (columnVisibility: ColumnVisibility, breakpointValue?: number): DynamicVisibilityGridProps => {
    const { breakpoints } = useTheme();
    const usingCompactView = useWindowSize().width < (breakpointValue ?? breakpoints.values.md);
    const [visibilityChanges, setVisibilityChanges] = React.useState<VisibilityChange[]>([]);

    const initialVisibilityModel: GridColumnVisibilityModel = {};

    Object.keys(columnVisibility).forEach((columnKey) => {
        const value = usingCompactView ? columnVisibility[columnKey].compactView : columnVisibility[columnKey].defaultView;
        initialVisibilityModel[columnKey] = value;
    });

    const getVisibilityModel = (): GridColumnVisibilityModel => {
        const visibilityModel: GridColumnVisibilityModel = { ...initialVisibilityModel };

        for (const change of visibilityChanges) {
            if ((usingCompactView && change.usingCompactView) || (!usingCompactView && !change.usingCompactView)) {
                visibilityModel[change.column] = change.visibility;
            }
        }

        return visibilityModel;
    };

    const onColumnVisibilityModelChange: React.ComponentProps<typeof DataGrid>["onColumnVisibilityModelChange"] = (newColumnVisibilities) => {
        setVisibilityChanges((existingChanges) => {
            let updatedChanges = [...existingChanges];

            Object.keys(newColumnVisibilities).map((changedColumn) => {
                const newVisibility = newColumnVisibilities[changedColumn];
                const shouldBeStoredInState = initialVisibilityModel[changedColumn] !== newVisibility;

                updatedChanges = updatedChanges.filter((change) => {
                    return change.column !== changedColumn || change.usingCompactView !== usingCompactView;
                });

                if (shouldBeStoredInState) {
                    updatedChanges.push({
                        column: changedColumn,
                        visibility: newVisibility,
                        usingCompactView,
                    });
                }
            });

            return updatedChanges;
        });
    };

    return {
        onColumnVisibilityModelChange: onColumnVisibilityModelChange,
        columnVisibilityModel: getVisibilityModel(),
    };
};
