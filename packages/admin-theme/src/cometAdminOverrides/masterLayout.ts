import { CometAdminMasterLayoutClassKeys } from "@comet/admin";
import { StyleRules } from "@material-ui/styles/withStyles";

import { darkPalette } from "../colors";

export default (): StyleRules<{}, CometAdminMasterLayoutClassKeys> => ({
    root: {},
    header: {
        backgroundColor: darkPalette.main,
        "& [class*='MuiTypography']": {
            color: darkPalette.contrastText,
        },
        "& [class*='MuiIconButton']": {
            color: darkPalette.contrastText,
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
