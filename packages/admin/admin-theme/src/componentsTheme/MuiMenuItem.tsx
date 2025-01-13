import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiMenuItem: GetMuiComponentTheme<"MuiMenuItem"> = (component, theme) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiMenuItem">(component?.styleOverrides, {
        root: {
            "& .MuiListItemIcon-root": {
                minWidth: 0,
            },
        },
    }),
});
