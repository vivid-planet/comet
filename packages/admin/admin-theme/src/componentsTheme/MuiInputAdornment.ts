import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiInputAdornment: GetMuiComponentTheme<"MuiInputAdornment"> = (styleOverrides) => ({
    styleOverrides: mergeOverrideStyles(styleOverrides, {
        root: {
            height: "auto",
            alignSelf: "stretch",
            maxHeight: "none",
        },
        positionStart: {
            marginRight: 0,
        },
        positionEnd: {
            marginLeft: 0,
        },
    }),
});
