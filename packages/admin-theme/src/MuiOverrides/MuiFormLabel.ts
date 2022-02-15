import { FormLabelClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Typography } from "@mui/material/styles/createTypography";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { Spacing } from "@mui/system";

export const getMuiFormLabelOverrides = (palette: Palette, typography: Typography, spacing: Spacing): OverridesStyleRules<FormLabelClassKey> => ({
    root: {
        display: "block",
        color: palette.grey[900],
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: typography.fontWeightBold,
        marginBottom: spacing(2),
    },
    colorSecondary: {},
    focused: {},
    disabled: {},
    error: {},
    filled: {},
    required: {},
    asterisk: {},
});
