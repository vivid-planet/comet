import { DialogClassKey } from "@material-ui/core/Dialog";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiDialogOverrides = (): StyleRules<{}, DialogClassKey> => ({
    root: {},
    scrollPaper: {},
    scrollBody: {},
    container: {},
    paper: {
        borderRadius: 4,
    },
    paperScrollPaper: {},
    paperScrollBody: {},
    paperWidthFalse: {},
    paperWidthXs: {},
    paperWidthSm: {},
    paperWidthMd: {},
    paperWidthLg: {},
    paperWidthXl: {},
    paperFullWidth: {},
    paperFullScreen: {},
});
