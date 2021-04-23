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
    },
    toolbar: {},
    contentWrapper: {},
    mainContent: {},
});
