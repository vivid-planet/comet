import "@comet/admin/lib/themeAugmentation";

import { MuiThemeProvider as ThemeProvider } from "@comet/admin/lib/mui/ThemeProvider";
import { createMuiTheme } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import StoryRouter from "storybook-react-router";

import { Story as MenuStory } from "./Menu";

const colors = {
    cometMain: "#29B6F6",
    cometMainDim: "#0086C3",
    lightGrey: "#F2F2F2",
    textLevel1: "#242424",
    textLevel2: "#17181A",
};

const cometCmsTheme = createMuiTheme({
    overrides: {
        CometAdminMenuItem: {
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
                    color: colors.cometMain,

                    "&:after": {
                        backgroundColor: colors.cometMain,
                    },

                    "& [class*='MuiListItemIcon-root']": {
                        color: colors.cometMain,
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
                    backgroundColor: colors.cometMain,
                    color: "#fff",

                    "&:after": {
                        backgroundColor: colors.cometMainDim,
                    },

                    "&:hover": {
                        backgroundColor: colors.cometMainDim,
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
        },
        CometAdminMenuCollapsibleItem: {
            root: {
                "& [class*='MuiList-padding']": {
                    paddingTop: 0,
                    paddingBottom: 0,
                },
            },
            childSelected: {
                color: colors.cometMain,

                "& $listItem": {
                    "& [class*='MuiListItemText-root']": {
                        color: colors.cometMain,
                    },
                    "& [class*='MuiListItemIcon-root']": {
                        color: colors.cometMain,
                    },
                },
            },
        },
    },
});

storiesOf("comet-admin-mui", module)
    .addDecorator(StoryRouter())
    .add("Menu (Comet Theme)", () => (
        <ThemeProvider theme={cometCmsTheme}>
            <MenuStory />
        </ThemeProvider>
    ));
