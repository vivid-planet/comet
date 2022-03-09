import { TabsClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { Spacing } from "@material-ui/core/styles/createSpacing";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiTabsOverrides = (palette: Palette, spacing: Spacing): StyleRules<Record<string, unknown>, TabsClassKey> => ({
    root: {
        position: "relative",
        marginBottom: spacing(4),
        "&:after": {
            content: '""',
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
            height: 1,
            backgroundColor: palette.grey[100],
        },
    },
    flexContainer: {},
    scroller: {
        zIndex: 1,
    },
    fixed: {},
    scrollable: {},
    centered: {},
    scrollButtons: {},
    scrollButtonsDesktop: {},
    indicator: {
        backgroundColor: palette.primary.main,
        height: 2,
    },
});
