import { GridColDef, ValueOption } from "./GridColDef";

export const renderStaticSelectCell: GridColDef["renderCell"] = ({ value, colDef }) => {
    if (Array.isArray(colDef.valueOptions)) {
        const renderCellValue: ValueOption | undefined = colDef.valueOptions.find((option) =>
            typeof option === "object" && option.value === value ? value.toString() : "",
        );

        if (typeof renderCellValue === "object") {
            if ("cellContent" in renderCellValue) {
                return renderCellValue.cellContent;
            }

            return renderCellValue.label;
        }
    }

    return value ? value.toString() : "";
};
