import { bluePalette, createCometTheme, fontWeights, neutrals } from "@comet/admin-theme";
import { Theme } from "@material-ui/core";
import type {} from "@material-ui/lab/themeAugmentation";

export default createCometTheme({
    typography: {
        button: {
            textTransform: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            fontWeight: "inherit",
            color: "inherit",
        },
    },
    props: {
        MuiListItem: {
            dense: true,
        },
        MuiTabs: {
            textColor: "primary",
            indicatorColor: "primary",
        },
    },
    overrides: {
        MuiSelect: {
            icon: {
                top: "calc(50% - 8px)",
            },
        },
        MuiToggleButtonGroup: {
            root: {
                backgroundColor: "#fff",
                borderRadius: 1,
            },
        },
        MuiToggleButton: {
            root: {
                borderColor: neutrals[100],
                "&$selected": {
                    backgroundColor: "transparent",
                    borderBottom: `2px solid ${bluePalette.main}`,
                    color: bluePalette.main,
                },
            },
        },
        MuiTab: {
            root: {
                fontWeight: fontWeights.fontWeightBold,
                textTransform: "uppercase",
            },
        },
    },
});

declare module "styled-components" {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface DefaultTheme extends Theme {}
}
