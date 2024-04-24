import { useTheme } from "@mui/material";
import { DataGrid, GridColumnVisibilityModel } from "@mui/x-data-grid";
import * as React from "react";

import { useWindowSize } from "../helpers/useWindowSize";

type UserVisibilityChange = {
    column: string;
    visible: boolean;
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

const getInitialColumnVisibilityModel = (columnVisibility: ColumnVisibility, usingCompactView: boolean): GridColumnVisibilityModel => {
    const initialVisibilityModel: GridColumnVisibilityModel = {};

    Object.keys(columnVisibility).forEach((columnKey) => {
        const value = usingCompactView ? columnVisibility[columnKey].compactView : columnVisibility[columnKey].defaultView;
        initialVisibilityModel[columnKey] = value;
    });

    return initialVisibilityModel;
};

const getColumnVisibilityModelWithUserChanges = (
    initialVisibilityModel: GridColumnVisibilityModel,
    userVisibilityChanges: UserVisibilityChange[],
    usingCompactView: boolean,
): GridColumnVisibilityModel => {
    const visibilityModel: GridColumnVisibilityModel = { ...initialVisibilityModel };

    for (const change of userVisibilityChanges) {
        if ((usingCompactView && change.usingCompactView) || (!usingCompactView && !change.usingCompactView)) {
            visibilityModel[change.column] = change.visible;
        }
    }

    return visibilityModel;
};

const getUpdatedUserVisibilityChanges = (
    existingChanges: UserVisibilityChange[],
    initialVisibilityModel: GridColumnVisibilityModel,
    newColumnVisibilities: GridColumnVisibilityModel,
    usingCompactView: boolean,
): UserVisibilityChange[] => {
    let updatedChanges = [...existingChanges];

    Object.keys(newColumnVisibilities).map((changedColumn) => {
        const newVisible = newColumnVisibilities[changedColumn];
        const shouldBeStoredInState = initialVisibilityModel[changedColumn] !== newVisible;

        updatedChanges = updatedChanges.filter((change) => {
            return change.column !== changedColumn || change.usingCompactView !== usingCompactView;
        });

        if (shouldBeStoredInState) {
            updatedChanges.push({
                column: changedColumn,
                visible: newVisible,
                usingCompactView,
            });
        }
    });

    return updatedChanges;
};

export const useDynamicGridVisibilityModel = (columnVisibility: ColumnVisibility, breakpointValue?: number): DynamicVisibilityGridProps => {
    const { breakpoints } = useTheme();
    const usingCompactView = useWindowSize().width < (breakpointValue ?? breakpoints.values.md);
    const [userVisibilityChanges, setUserVisibilityChanges] = React.useState<UserVisibilityChange[]>([]);
    const initialVisibilityModel = getInitialColumnVisibilityModel(columnVisibility, usingCompactView);

    return {
        onColumnVisibilityModelChange: (newColumnVisibilities: GridColumnVisibilityModel) => {
            setUserVisibilityChanges((existingChanges) =>
                getUpdatedUserVisibilityChanges(existingChanges, initialVisibilityModel, newColumnVisibilities, usingCompactView),
            );
        },
        columnVisibilityModel: getColumnVisibilityModelWithUserChanges(initialVisibilityModel, userVisibilityChanges, usingCompactView),
    };
};
