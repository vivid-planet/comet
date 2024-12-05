import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiCardHeader: GetMuiComponentTheme<"MuiCardHeader"> = (component, { spacing, palette }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiCardHeader">(component?.styleOverrides, {
        root: {
            backgroundColor: palette.grey["A200"],
            color: "#fff",

            "& .MuiButtonBase-root": {
                paddingTop: 0,
                paddingBottom: 0,
            },
        },
        action: {
            alignSelf: "center",
        },
    }),
});
