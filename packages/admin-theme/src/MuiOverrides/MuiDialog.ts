import { DialogClassKey } from "@material-ui/core/Dialog";
import { Spacing } from "@material-ui/core/styles/createSpacing";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiDialogOverrides = (spacing: Spacing): StyleRules<{}, DialogClassKey> => ({
    root: {},
    scrollPaper: {},
    scrollBody: {},
    container: {},
    paper: {
        borderRadius: 4,
        width: "100%",
        margin: spacing(8),
    },
    paperScrollPaper: {
        maxHeight: `calc(100% - ${spacing(16)}px)`,
    },
    paperScrollBody: {},
    paperWidthFalse: {},
    paperWidthXs: {
        maxWidth: 350,
    },
    paperWidthSm: {
        maxWidth: 600,
    },
    paperWidthMd: {
        maxWidth: 1024,
    },
    paperWidthLg: {
        maxWidth: 1280,
    },
    paperWidthXl: {
        maxWidth: 1920,
    },
    paperFullWidth: {
        width: `calc(100% - ${spacing(16)}px)`,
    },
    paperFullScreen: {},
});
