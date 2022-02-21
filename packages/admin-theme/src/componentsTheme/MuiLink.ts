import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiLink = (palette: Palette): Components["MuiLink"] => ({
    defaultProps: {
        underline: "always",
    },
    styleOverrides: {
        root: {
            color: palette.grey[600],
        },
    },
});
