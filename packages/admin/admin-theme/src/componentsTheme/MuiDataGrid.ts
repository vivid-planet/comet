import type {} from "@mui/x-data-grid/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDataGrid: GetMuiComponentTheme<"MuiDataGrid"> = (component) => ({
    ...component,
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
            borderTop: `1px solid ${palette.grey[100]}`,
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
        filterForm: {
            padding: 20,
            "& .MuiInputLabel-root": {
                display: "none",
            },
            "& .MuiInput-root": {
                marginTop: 0,
            },
            "& .MuiInputAdornment-root": {
                paddingRight: 5,
            },
        },
        filterFormDeleteIcon: {
            justifyContent: "center",
            "& .MuiSvgIcon-root": {
                width: 16,
                height: 16,
            },
        },
        filterFormColumnInput: {
            marginRight: 20,
            marginLeft: 20,
        },
        filterFormOperatorInput: {
            marginRight: 20,
        },
        paper: {
            boxShadow: "0 0 8px 0 rgb(0 0 0 / 10%)",
        },
    }),
});
