import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiFormControlLabel: GetMuiComponentTheme<"MuiFormControlLabel"> = (component) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiFormControlLabel">(component?.styleOverrides, {
        root: {
            marginLeft: -9,
            marginTop: -7,
            marginBottom: -7,

            ".CometAdminFormFieldContainer-horizontal &": {
                marginTop: 0,
                marginBottom: 0,
                minHeight: 40,
            },
        },
    }),
});
