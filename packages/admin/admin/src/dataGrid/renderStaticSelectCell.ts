import { type GridRenderCellParams } from "@mui/x-data-grid";

import { type GridColDef } from "./GridColDef";

export const renderStaticSelectCell = ({ value, colDef }: GridRenderCellParams) => {
    // TODO: find a better solution than as cast
    const gridColDef = colDef as GridColDef;
    if (Array.isArray(gridColDef.valueOptions)) {
        const renderCellValue = gridColDef.valueOptions.find((option: any) => {
            return typeof option === "object" && option.value === value ? value.toString() : "";
        });

        if (typeof renderCellValue === "object") {
            if ("cellContent" in renderCellValue) {
                return renderCellValue.cellContent;
            }

            return renderCellValue.label;
        }
    }

    return value ? value.toString() : "";
};
