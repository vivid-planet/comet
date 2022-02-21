import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiPaper = (palette: Palette): Components["MuiPaper"] => ({
    defaultProps: {
        square: true,
    },
    styleOverrides: {
        outlined: {
            borderTop: "none",
            borderRight: "none",
            borderBottom: `1px solid ${palette.divider}`,
            borderLeft: "none",
        },
    },
});
