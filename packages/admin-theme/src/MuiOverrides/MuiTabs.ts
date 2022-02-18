import { TabsClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { Spacing } from "@mui/system";

export const getMuiTabsOverrides = (palette: Palette, spacing: Spacing): OverridesStyleRules<TabsClassKey> => ({
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
    vertical: {},
    flexContainer: {},
    flexContainerVertical: {},
    centered: {},
    scroller: {
        zIndex: 1,
    },
    fixed: {},
    scrollableX: {},
    scrollableY: {},
    hideScrollbar: {},
    scrollButtons: {},
    scrollButtonsHideMobile: {},
    indicator: {
        backgroundColor: palette.primary.main,
        height: 2,
    },
});
