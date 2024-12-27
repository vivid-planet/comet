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
            alignSelf: "center",
            "& > .MuiButton-root": {
                marginTop: "-12px",
                marginBottom: "-12px",
            },
            "& > .MuiIconButton-root": {
                marginTop: "-12px",
                marginBottom: "-12px",
            },
        },
    }),
});
