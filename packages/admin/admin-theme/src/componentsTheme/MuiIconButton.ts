import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiIconButton = (palette: Palette): Components["MuiIconButton"] => ({
    styleOverrides: {
        root: {
            color: palette.grey[900],
        },
    },
});
