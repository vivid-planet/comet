import { GridSortModel } from "@mui/x-data-grid";

export function muiGridSortToGql(sortModel?: GridSortModel, fieldMapping?: Record<string, string>) {
    if (!sortModel) return undefined;

    return sortModel.map((i) => {
        return {
            field: (fieldMapping?.[i.field] || i.field) as any, // any to be compatible with enum
            direction: (i.sort == "desc" ? "DESC" : "ASC") as "DESC" | "ASC",
        };
    });
}
