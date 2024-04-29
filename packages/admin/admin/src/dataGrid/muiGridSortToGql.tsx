import { GridSortModel } from "@mui/x-data-grid";

type SortEntry = {
    field: any; // any to be compatible with enum
    direction: "ASC" | "DESC";
};

export function muiGridSortToGql(sortModel?: GridSortModel, fieldMapping?: Record<string, string | string[]>) {
    if (!sortModel) return undefined;

    const gqlSortModel: SortEntry[] = [];

    sortModel.forEach((item) => {
        const field = fieldMapping?.[item.field] || item.field;
        const fields = typeof field === "string" ? [field] : field;
        const direction = (item.sort == "desc" ? "DESC" : "ASC") as "DESC" | "ASC";

        fields.forEach((field) => {
            gqlSortModel.push({
                field,
                direction,
            });
        });
    });

    return gqlSortModel;
}
