import type {} from "@mui/x-data-grid/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDataGrid: GetMuiComponentTheme<"MuiDataGrid"> = (component) => ({
    ...component,
    defaultProps: {
        disableElevation: true,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiDataGrid">(component?.styleOverrides, {
        root: {
            backgroundColor: "white",
        },
        columnHeader: {
            "&:focus": {
                outline: "none",
            },
            "&:focus-within": {
                outline: "none",
            },
        },
        columnHeadersInner: {
            padding: "0 10px",
        },
        row: {
            padding: "0 10px",
        },
        cell: {
            borderTop: "1px solid #D9D9D9",
            "&:focus": {
                outline: "none",
            },
            "&:focus-within": {
                outline: "none",
            },
        },
        iconSeparator: {
            backgroundColor: "#D9D9D9",
            width: "2px",
            height: "20px",
            marginRight: "10px",
        },
    }),
});
