import { CometAdminMenuItemClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, neutrals } from "../colors";
import { fontWeights } from "../getTypographyOptions";

const colors = {
    textLevel1: "#242424",
    textLevel2: "#17181A",
};

export default (): StyleRules<{}, CometAdminMenuItemClassKeys> => ({
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
            minWidth: 34,
        },

        "& [class*='MuiListItemText-inset']": {
            paddingLeft: 34,
        },

        "& [class*='MuiSvgIcon-root']": {
            fontSize: 21,
        },
    },
    level1: {
        borderBottom: `1px solid ${neutrals[50]}`,
        boxSizing: "border-box",
        color: colors.textLevel1,
        paddingTop: 16,
        paddingBottom: 16,

        "&[class*='Mui-selected']": {
            backgroundColor: neutrals[50],
            color: bluePalette.main,

            "&:after": {
                backgroundColor: bluePalette.main,
            },

            "& [class*='MuiListItemIcon-root']": {
                color: bluePalette.main,
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
        paddingTop: 10,
        paddingBottom: 10,

        "&:last-child": {
            borderBottom: `1px solid ${neutrals[50]}`,
            boxSizing: "border-box",
        },

        "&[class*='Mui-selected']": {
            backgroundColor: bluePalette.main,
            color: "#fff",

            "&:after": {
                backgroundColor: bluePalette.dark,
            },

            "&:hover": {
                backgroundColor: bluePalette.dark,
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
    hasSecondaryAction: {},
});
