import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiChip: GetMuiComponentTheme<"MuiChip"> = (component, { palette, spacing }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiChip">(component?.styleOverrides, {
        root: {
            borderRadius: 4,
        },
        sizeSmall: {
            height: "auto",
            paddingTop: 4,
            paddingBottom: 4,
        },
        labelSmall: {
            fontSize: 12,
            lineHeight: 1,
            paddingLeft: spacing(1),
            paddingRight: spacing(1),
        },
        deleteIconSmall: {
            marginLeft: 0,
            marginRight: spacing(1),
        },
        filled: {
            color: palette.text.primary,
        },
    }),
});
