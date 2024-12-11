import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiMenu: GetMuiComponentTheme<"MuiMenu"> = (component, theme) => ({
    ...component,
    defaultProps: {
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiMenu">(component?.styleOverrides, {
        paper: { minWidth: 220, borderRadius: "4px" },
        root: {
            "& .MuiMenuItem-root": {
                padding: "8px 15px 8px 30px !important",
                columnGap: "10px",
            },

            "& .MuiDivider-root": {
                margin: "8px 10px",
                borderColor: theme.palette.grey[50],
            },
        },
    }),
});
