import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiToggleButtonGroup = (palette: Palette): Components["MuiToggleButtonGroup"] => ({
    styleOverrides: {
        root: {
            backgroundColor: palette.common.white,
            borderRadius: 1,
        },
    },
});
