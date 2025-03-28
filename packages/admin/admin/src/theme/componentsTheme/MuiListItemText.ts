import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { commonListItemPrimaryTextStyles } from "./commonListStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiListItemText: GetMuiComponentTheme<"MuiListItemText"> = (component) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiListItemText">(component?.styleOverrides, {
        root: {
            marginTop: 0,
            marginBottom: 0,
        },
        primary: {
            ...commonListItemPrimaryTextStyles,
        },
        secondary: {
            fontSize: 13,
            lineHeight: "16px",
        },
    }),
});
