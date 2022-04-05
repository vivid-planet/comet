import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiDrawer = (palette: Palette): Components["MuiDrawer"] => ({
    styleOverrides: {
        paper: {
            backgroundColor: palette.grey[50],
        },
    },
});
