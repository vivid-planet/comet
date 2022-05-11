import { tabClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiTab: GetMuiComponentTheme<"MuiTab"> = (styleOverrides, { palette, typography }) => ({
    styleOverrides: mergeOverrideStyles<"MuiTab">(styleOverrides, {
        root: {
            fontSize: 16,
            lineHeight: 1,
            fontWeight: typography.fontWeightBold,
            paddingTop: 17,
            paddingRight: 10,
            paddingBottom: 18,
            paddingLeft: 10,
            color: palette.grey[400],

            "@media (min-width: 600px)": {
                minWidth: 0,
            },

            [`&.${tabClasses.selected}`]: {
                color: palette.primary.main,
            },
        },
        textColorInherit: {
            opacity: 1,
        },
    }),
});
