import { toggleButtonClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiToggleButton: GetMuiComponentTheme<"MuiToggleButton"> = (styleOverrides, { palette }) => ({
    styleOverrides: mergeOverrideStyles<"MuiToggleButton">(styleOverrides, {
        root: {
            borderColor: palette.grey[100],

            [`&.${toggleButtonClasses.selected}`]: {
                backgroundColor: "transparent",
                borderBottom: `2px solid ${palette.primary.main}`,
                color: palette.primary.main,
            },
        },
    }),
});
