import { FormLabelClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { Spacing } from "@material-ui/core/styles/createSpacing";
import { Typography } from "@material-ui/core/styles/createTypography";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiFormLabelOverrides = (palette: Palette, typography: Typography, spacing: Spacing): StyleRules<{}, FormLabelClassKey> => ({
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
