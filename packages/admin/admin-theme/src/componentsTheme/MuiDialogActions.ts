import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogActions: GetMuiComponentTheme<"MuiDialogActions"> = (component, { palette }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiDialogActions">(component?.styleOverrides, {
        root: {
            borderTop: `1px solid ${palette.grey[100]}`,
            padding: 20,
            justifyContent: "space-between",

            "&>:first-of-type:last-child": {
                marginLeft: "auto",
            },
        },
    }),
});
