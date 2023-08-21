import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { MenuItemProps, MuiListItemProps } from "./Item";

export type MenuItemClassKey = "root" | "level1" | "level2" | "level3" | "hasIcon" | "hasSecondaryText" | "hasSecondaryAction";

const colors = {
    textLevel1: "#242424",
    textLevel2: "#17181A",
};

export const styles = (theme: Theme) =>
    createStyles<MenuItemClassKey, MenuItemProps & MuiListItemProps>({
        root: {
            flexShrink: 0,
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
                minWidth: 28,
            },
            "& [class*='MuiListItemText-inset']": {
                paddingLeft: 28,
            },
            "& [class*='MuiSvgIcon-root']": {
                fontSize: 16,
            },
        },
        level1: {
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            boxSizing: "border-box",
            color: colors.textLevel1,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 16,
            paddingBottom: 16,
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.grey[50],
                color: theme.palette.primary.main,
                "&:after": {
                    backgroundColor: theme.palette.primary.main,
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
            },
            "& [class*='MuiListItemText-primary']": {
                fontWeight: theme.typography.fontWeightMedium,
                fontSize: 16,
                lineHeight: "20px",
            },
        },
        level2: {
            color: colors.textLevel2,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            "&:last-child": {
                borderBottom: ({ level, hasChildElements, isCollapsibleOpen }) =>
                    level === 2 && (!hasChildElements || !isCollapsibleOpen) ? `1px solid ${theme.palette.grey[50]}` : "initial",
                boxSizing: "border-box",
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                "&:after": {
                    backgroundColor: theme.palette.primary.dark,
                },
                "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                },
                "& [class*='MuiListItemText-primary']": {
                    fontWeight: theme.typography.fontWeightBold,
                },
            },
            "& [class*='MuiListItemText-root']": {
                margin: 0,
            },
            "& [class*='MuiListItemText-primary']": {
                fontWeight: theme.typography.fontWeightRegular,
                fontSize: 14,
                lineHeight: "20px",
            },
        },
        level3: {
            color: colors.textLevel2,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 0,
            paddingBottom: 0,
            position: "relative",
            "&:not(:last-child)": {
                "& [class*='MuiListItemText-root']": {
                    position: "relative",
                    "&:before": {
                        content: "''",
                        position: "absolute",
                        width: 1,
                        height: "100%",
                        top: 0,
                        backgroundColor: theme.palette.grey[100],
                    },
                    "&:after": {
                        content: "''",
                        position: "absolute",
                        width: 5,
                        height: 1,
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: theme.palette.grey[100],
                    },
                },
            },
            "&:last-child": {
                borderBottom: `1px solid ${theme.palette.grey[50]}`,
                boxSizing: "border-box",

                "& [class*='MuiListItemText-root']": {
                    position: "relative",
                    "&:before": {
                        content: "''",
                        position: "absolute",
                        width: 1,
                        height: "50%",
                        top: 0,
                        backgroundColor: theme.palette.grey[100],
                    },
                    "&:after": {
                        content: "''",
                        position: "absolute",
                        width: 5,
                        height: 1,
                        top: "50%",
                        transform: "translateY(-50%)",
                        backgroundColor: theme.palette.grey[100],
                    },
                },
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.primary.main,
                color: "#fff",
                "&:after": {
                    backgroundColor: theme.palette.primary.dark,
                },
                "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                },
                "& [class*='MuiListItemText-primary']": {
                    fontWeight: theme.typography.fontWeightBold,
                },
            },
            "& [class*='MuiListItemText-root']": {
                margin: 0,
            },
            "& [class*='MuiListItemText-primary']": {
                fontWeight: theme.typography.fontWeightRegular,
                fontSize: 14,
                lineHeight: "20px",
                paddingLeft: 14,
                paddingTop: 14,
                paddingBottom: 14,
            },
        },
        hasIcon: {},
        hasSecondaryText: {},
        hasSecondaryAction: {
            paddingRight: 18,
        },
    });
