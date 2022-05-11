import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogActions: GetMuiComponentTheme<"MuiDialogActions"> = (styleOverrides, { palette }) => ({
    styleOverrides: mergeOverrideStyles<"MuiDialogActions">(styleOverrides, {
        root: {
            borderTop: `1px solid ${palette.grey[100]}`,
            padding: 20,
            justifyContent: "space-between",

            "&>:first-child:last-child": {
                marginLeft: "auto",
            },
        },
    }),
});
