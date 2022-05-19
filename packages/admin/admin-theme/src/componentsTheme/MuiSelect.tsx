import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiSelect: GetMuiComponentTheme<"MuiSelect"> = (component, { palette }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiSelect">(component?.styleOverrides, {
        select: {
            paddingRight: 32,

            "&:focus": {
                backgroundColor: "transparent",
            },

            "&:after": {
                // Expand the clickable area to allow opening by clicking an input adornment, e.g., the arrow-down icon.
                content: '""',
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                left: 0,
            },
        },
        icon: {
            position: "relative",
            right: 0,
            order: 1,
            color: palette.grey[900],
        },
    }),
});
