import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiDialogContentText = (palette: Palette): Components["MuiDialogContentText"] => ({
    styleOverrides: {
        root: {
            color: palette.text.primary,
            marginBottom: 20,
        },
    },
});
