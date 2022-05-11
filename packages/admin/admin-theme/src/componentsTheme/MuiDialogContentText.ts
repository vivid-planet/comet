import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiDialogContentText: GetMuiComponentTheme<"MuiDialogContentText"> = (styleOverrides, { palette }) => ({
    styleOverrides: mergeOverrideStyles<"MuiDialogContentText">(styleOverrides, {
        root: {
            color: palette.text.primary,
            marginBottom: 20,
        },
    }),
});
