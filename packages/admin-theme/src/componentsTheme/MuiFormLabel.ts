import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import { Typography } from "@mui/material/styles/createTypography";
import { Spacing } from "@mui/system";

export const getMuiFormLabel = (palette: Palette, typography: Typography, spacing: Spacing): Components["MuiFormLabel"] => ({
    styleOverrides: {
        root: {
            display: "block",
            color: palette.grey[900],
            fontSize: 16,
            lineHeight: "20px",
            fontWeight: typography.fontWeightBold,
            marginBottom: spacing(2),
        },
    },
});
