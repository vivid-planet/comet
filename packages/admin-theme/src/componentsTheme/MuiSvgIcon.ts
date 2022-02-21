import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiSvgIcon = (palette: Palette): Components["MuiSvgIcon"] => ({
    styleOverrides: {
        root: {
            fontSize: 16,
        },
        colorDisabled: {
            color: palette.grey[200],
        },
        fontSizeSmall: {
            fontSize: 10,
        },
        fontSizeLarge: {
            fontSize: 20,
        },
    },
});
