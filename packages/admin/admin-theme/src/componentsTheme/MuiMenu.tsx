import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiMenu: GetMuiComponentTheme<"MuiMenu"> = (component, theme) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiMenu">(component?.styleOverrides, {
        paper: { minWidth: 220, borderRadius: "4px" },
        root: {
            "& .MuiMenuItem-root": {
                padding: "8px 15px 8px 30px",
                columnGap: "10px",
            },

            "& .MuiDivider-root": {
                borderColor: theme.palette.grey[50],
            },

            "& .MuiDivider-root, &.MuiMenuItem-root+.MuiDivider-root": {
                margin: "8px 10px",
            },
        },
    }),
});
