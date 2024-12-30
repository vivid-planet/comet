import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiCardHeader: GetMuiComponentTheme<"MuiCardHeader"> = (component, { spacing, palette }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiCardHeader">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.grey["A200"],
            color: "#fff",
        },
        action: {
            lineHeight: 0,
            marginBottom: 0,
            marginTop: 0,
            alignSelf: "center",

            "& > .MuiButton-root": {
                marginTop: "-10px",
                marginBottom: "-10px",
            },
            "& > .MuiIconButton-root": {
                marginTop: "-10px",
                marginBottom: "-10px",
            },
        },
    }),
});
