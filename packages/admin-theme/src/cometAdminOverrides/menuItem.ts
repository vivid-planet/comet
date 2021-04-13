import { CometAdminMenuItemClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { cometBlue } from "../colors";

const colors = {
    lightGrey: "#F2F2F2",
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
        borderBottom: `1px solid ${colors.lightGrey}`,
        boxSizing: "border-box",
        color: colors.textLevel1,
        paddingTop: 16,
        paddingBottom: 16,

        "&[class*='Mui-selected']": {
            backgroundColor: colors.lightGrey,
            color: cometBlue.main,

            "&:after": {
                backgroundColor: cometBlue.main,
            },

            "& [class*='MuiListItemIcon-root']": {
                color: cometBlue.main,
            },
        },

        "& [class*='MuiListItemText-primary']": {
            fontWeight: 500,
            fontSize: 16,
            lineHeight: "20px",
        },
    },
    level2: {
        color: colors.textLevel2,
        paddingTop: 10,
        paddingBottom: 10,

        "&:last-child": {
            borderBottom: `1px solid ${colors.lightGrey}`,
            boxSizing: "border-box",
        },

        "&[class*='Mui-selected']": {
            backgroundColor: cometBlue.main,
            color: "#fff",

            "&:after": {
                backgroundColor: cometBlue.mainDim,
            },

            "&:hover": {
                backgroundColor: cometBlue.mainDim,
            },

            "& [class*='MuiListItemText-primary']": {
                fontWeight: 500,
            },
        },

        "& [class*='MuiListItemText-root']": {
            margin: 0,
        },

        "& [class*='MuiListItemText-primary']": {
            fontWeight: 300,
            fontSize: 14,
            lineHeight: "20px",
        },
    },
    hasIcon: {},
    hasSecondaryText: {},
    hasSecondaryAction: {},
});
