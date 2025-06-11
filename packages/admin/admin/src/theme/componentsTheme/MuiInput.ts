import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { type GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiInput: GetMuiComponentTheme<"MuiInput"> = (component) => ({
    ...component,
    defaultProps: {
        disableUnderline: true,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiInput">(component?.styleOverrides, {
        root: {
            ["&::before"]: {
                borderBottom: "unset",
            },
        },
    }),
});
