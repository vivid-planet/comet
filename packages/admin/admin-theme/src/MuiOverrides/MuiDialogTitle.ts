import { DialogTitleClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { Typography } from "@material-ui/core/styles/createTypography";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiDialogTitleOverrides = (palette: Palette, typography: Typography): StyleRules<Record<string, unknown>, DialogTitleClassKey> => ({
    root: {
        backgroundColor: palette.grey["A200"],
        color: palette.grey["A100"],
        padding: 20,
        "& [class*='MuiTypography-root']": {
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: typography.fontWeightBold,
        },
    },
});
