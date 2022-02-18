import { DialogTitleClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Typography } from "@mui/material/styles/createTypography";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiDialogTitleOverrides = (palette: Palette, typography: Typography): OverridesStyleRules<DialogTitleClassKey> => ({
    root: {
        backgroundColor: palette.grey["A200"],
        color: palette.grey["A100"],
        padding: 20,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: typography.fontWeightBold,
    },
});
