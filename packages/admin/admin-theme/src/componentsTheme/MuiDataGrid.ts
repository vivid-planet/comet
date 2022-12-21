import type {} from "@mui/x-data-grid/themeAugmentation";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDataGrid: GetMuiComponentTheme<"MuiDataGrid"> = (component, { palette, shadows, spacing }) => ({
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
            padding: spacing(0, 2),
        },
        row: {
            padding: spacing(0, 2),
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
            backgroundColor: palette.grey[100],
            width: "2px",
            height: "20px",
            marginRight: "10px",
        },
        filterForm: {
            padding: spacing(4),
            "& .MuiInputLabel-root": {
                display: "none",
            },
            "& .MuiInput-root": {
                marginTop: 0,
            },
            "& .MuiInputAdornment-root": {
                padding: spacing(0, 1, 0, 0),
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
            margin: spacing(0, 4),
        },
        filterFormOperatorInput: {
            margin: spacing(0, 4, 0, 0),
        },
        paper: {
            boxShadow: shadows[1],
        },
    }),
});
