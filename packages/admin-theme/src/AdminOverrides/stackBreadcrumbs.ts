import { CometAdminStackBreadcrumbsClassKeys } from "@comet/admin";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getStackBreadcrumbsOverrides = (palette: Palette): StyleRules<{}, CometAdminStackBreadcrumbsClassKeys> => ({
    root: {},
    ol: {},
    li: {},
    separator: {
        color: palette.grey[300],
        "& [class*='MuiSvgIcon-root']": {
            fontSize: 12,
        },
    },
    link: {
        color: palette.text.primary,
        textDecoration: "underline",
        "& [class*='MuiTypography']": {
            fontSize: 13,
            lineHeight: "14px",
        },
    },
    last: {
        color: palette.text.disabled,
        "&, &:hover": {
            textDecoration: "none",
        },
    },
});
