import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiDrawer = (palette: Palette): Components["MuiDrawer"] => ({
    styleOverrides: {
        root: {
            zIndex: 1250, // Between AppBar (1200) and Modal (1300)
        },
        paper: {
            backgroundColor: palette.grey[50],
        },
    },
});
