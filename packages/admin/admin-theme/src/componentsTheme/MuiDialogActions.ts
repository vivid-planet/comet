import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogActions: GetMuiComponentTheme<"MuiDialogActions"> = (component, { palette, breakpoints }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDialogActions">(component?.styleOverrides, {
        root: {
            borderTop: `1px solid ${palette.grey[100]}`,
            padding: 10,
            justifyContent: "space-between",

            [breakpoints.up("sm")]: {
                padding: 20,
            },

            "&>:first-of-type:last-child": {
                marginLeft: "auto",
            },
        },
    }),
});
