import { CometAdminMenuItemClassKeys } from "@comet/admin";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

import { fontWeights } from "../typographyOptions";

const colors = {
    textLevel1: "#242424",
    textLevel2: "#17181A",
};

export const getMenuItemOverrides = (palette: Palette): StyleRules<{}, CometAdminMenuItemClassKeys> => ({
    root: {
        "&:after": {
            content: "''",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 2,
        },

        "& [class*='MuiListItemIcon-root']": {
            color: colors.textLevel1,
            minWidth: 28,
        },

        "& [class*='MuiListItemText-inset']": {
            paddingLeft: 28,
        },

        "& [class*='MuiSvgIcon-root']": {
            fontSize: 16,
        },
    },
    level1: {
        borderBottom: `1px solid ${palette.grey[50]}`,
        boxSizing: "border-box",
        color: colors.textLevel1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 16,
        paddingBottom: 16,

        "&[class*='Mui-selected']": {
            backgroundColor: palette.grey[50],
            color: palette.primary.main,

            "&:after": {
                backgroundColor: palette.primary.main,
            },

            "& [class*='MuiListItemIcon-root']": {
                color: palette.primary.main,
            },
        },

        "& [class*='MuiListItemText-primary']": {
            fontWeight: fontWeights.fontWeightMedium,
            fontSize: 16,
            lineHeight: "20px",
        },
    },
    level2: {
        color: colors.textLevel2,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,

        "&:last-child": {
            borderBottom: `1px solid ${palette.grey[50]}`,
            boxSizing: "border-box",
        },

        "&[class*='Mui-selected']": {
            backgroundColor: palette.primary.main,
            color: "#fff",

            "&:after": {
                backgroundColor: palette.primary.dark,
            },

            "&:hover": {
                backgroundColor: palette.primary.dark,
            },

            "& [class*='MuiListItemText-primary']": {
                fontWeight: fontWeights.fontWeightBold,
            },
        },

        "& [class*='MuiListItemText-root']": {
            margin: 0,
        },

        "& [class*='MuiListItemText-primary']": {
            fontWeight: fontWeights.fontWeightRegular,
            fontSize: 14,
            lineHeight: "20px",
        },
    },
    hasIcon: {},
    hasSecondaryText: {},
    hasSecondaryAction: {
        paddingRight: 18,
    },
});
