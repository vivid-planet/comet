import { CometAdminStackBreadcrumbsClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { neutrals } from "../colors";
import { paletteOptions } from "../paletteOptions";

export const getStackBreadcrumbsOverrides = (): StyleRules<{}, CometAdminStackBreadcrumbsClassKeys> => ({
    root: {},
    ol: {},
    li: {},
    separator: {
        color: neutrals[300],
        "& [class*='MuiSvgIcon-root']": {
            fontSize: 12,
        },
    },
    link: {
        color: paletteOptions.text?.primary,
        textDecoration: "underline",
        "& [class*='MuiTypography']": {
            fontSize: 13,
            lineHeight: "14px",
        },
    },
    last: {
        color: paletteOptions.text?.disabled,
        "&, &:hover": {
            textDecoration: "none",
        },
    },
});
