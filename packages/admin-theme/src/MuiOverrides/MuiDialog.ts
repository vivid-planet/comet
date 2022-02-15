import { DialogClassKey } from "@mui/material/Dialog";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { Spacing } from "@mui/system";

export const getMuiDialogOverrides = (spacing: Spacing): OverridesStyleRules<DialogClassKey> => ({
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
        maxHeight: `calc(100% - ${spacing(16)})`,
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
        width: `calc(100% - ${spacing(16)})`,
    },
    paperFullScreen: {},
});
