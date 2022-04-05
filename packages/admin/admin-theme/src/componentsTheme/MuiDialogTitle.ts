import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import { Typography } from "@mui/material/styles/createTypography";

export const getMuiDialogTitle = (palette: Palette, typography: Typography): Components["MuiDialogTitle"] => ({
    styleOverrides: {
        root: {
            backgroundColor: palette.grey["A200"],
            color: palette.grey["A100"],
            padding: 20,
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: typography.fontWeightBold,
        },
    },
});
