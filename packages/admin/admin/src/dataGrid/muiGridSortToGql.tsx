import { GridSortModel } from "@mui/x-data-grid";

export function muiGridSortToGql(sortModel?: GridSortModel) {
    if (!sortModel) return undefined;
    return sortModel.map((i) => {
        return {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            field: i.field as any, //as any to be compatible with enum
            direction: (i.sort == "desc" ? "DESC" : "ASC") as "DESC" | "ASC",
        };
    });
}
