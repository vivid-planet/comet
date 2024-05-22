import { GridSortModel, useGridApiRef } from "@mui/x-data-grid";

import { GridColDef } from "./GridColDef";

type SortEntry = {
    field: any; // any to be compatible with enum
    direction: "ASC" | "DESC";
};

export function muiGridSortToGql(sortModel?: GridSortModel, apiRef?: ReturnType<typeof useGridApiRef>) {
    if (!sortModel) return undefined;

    const sortFieldMapping: Record<string, string[]> = {};

    apiRef?.current.getAllColumns?.().forEach((column: GridColDef) => {
        if (column.sortBy) {
            sortFieldMapping[column.field] = typeof column.sortBy === "string" ? [column.sortBy] : column.sortBy;
        }
    });

    const gqlSortModel: SortEntry[] = [];

    sortModel.forEach((item) => {
        const sortFields = sortFieldMapping?.[item.field] || [item.field];
        const direction = (item.sort == "desc" ? "DESC" : "ASC") as "DESC" | "ASC";

        sortFields.forEach((field) => {
            gqlSortModel.push({
                field,
                direction,
            });
        });
    });

    return gqlSortModel;
}
