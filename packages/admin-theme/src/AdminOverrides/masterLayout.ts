import { CometAdminMasterLayoutClassKeys } from "@comet/admin";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMasterLayoutOverrides = (palette: Palette): StyleRules<{}, CometAdminMasterLayoutClassKeys> => ({
    root: {},
    header: {
        backgroundColor: palette.grey["A400"],
        "& [class*='MuiTypography']": {
            color: palette.grey["A100"],
        },
        "& [class*='MuiIconButton']": {
            color: palette.grey["A100"],
        },
        "& [class*='MuiPaper']": {
            "& [class*='MuiTypography']": {
                color: "inherit",
            },
            "& [class*='MuiIconButton']": {
                color: "inherit",
            },
        },
    },
    toolbar: {},
    menuButton: {
        marginRight: 10,
        "& [class*='MuiSvgIcon-root']": {
            fontSize: 20,
        },
    },
    contentWrapper: {},
});
