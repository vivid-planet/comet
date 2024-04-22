import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { MenuItemProps, MuiListItemProps } from "./Item";

export type MenuItemClassKey = "root" | "level1" | "level2" | "level3" | "hasIcon" | "hasSecondaryText" | "hasSecondaryAction" | "level3MenuOpen";

export const styles = (theme: Theme) => {
    return createStyles<MenuItemClassKey, MenuItemProps & MuiListItemProps>({
        root: {
            flexShrink: 0,
            "&:after": {
                content: "''",
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: 2,
                display: ({ isMenuOpen }) => (!isMenuOpen ? "none" : "initial"),
            },
            "& [class*='MuiListItemIcon-root']": {
                color: theme.palette.grey[900],
                minWidth: ({ isMenuOpen }) => (isMenuOpen ? 28 : 22),
                margin: theme.spacing(0, "auto"),
            },
            "& [class*='MuiListItemText-inset']": {
                paddingLeft: ({ icon, level }) => (!!icon && level === 1 ? 30 : 0),
            },
            "& [class*='Mui-selected']": {
                "& [class*='MuiListItemText-secondary']": {
                    color: "inherit",
                },
            },
            "& [class*='MuiListItemText-primary']": {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
        },
        level1: {
            borderBottom: `1px solid ${theme.palette.grey[50]}`,
            boxSizing: "border-box",
            color: theme.palette.grey[900],
            height: 60,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: ({ isCollapsibleOpen, isMenuOpen }) =>
                !isMenuOpen && isCollapsibleOpen ? `${theme.palette.primary.main} !important` : `white !important`,
            "& [class*='MuiListItemIcon-root']": {
                color: ({ isMenuOpen, isCollapsibleOpen }) => (!isMenuOpen && isCollapsibleOpen ? `${theme.palette.common.white} !important` : ""),
            },
            "&:hover": {
                backgroundColor: ({ isMenuOpen }) => (!isMenuOpen ? `${theme.palette.primary.main} !important` : ""),
                color: ({ isMenuOpen }) => (!isMenuOpen ? `${theme.palette.common.white} !important` : ""),
                "& [class*='MuiListItemIcon-root']": {
                    color: ({ isMenuOpen }) => (!isMenuOpen ? `${theme.palette.common.white} !important` : ""),
                },
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.grey[50],
                color: theme.palette.primary.main,
                "&:after": {
                    backgroundColor: theme.palette.primary.main,
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
                "&:hover": {
                    color: ({ isMenuOpen }) => (!isMenuOpen ? theme.palette.common.white : theme.palette.primary.main),
                    "& [class*='MuiListItemIcon-root']": {
                        color: ({ isMenuOpen }) => (!isMenuOpen ? theme.palette.common.white : theme.palette.primary.main),
                    },
                },
            },
            "& [class*='MuiListItemText-primary']": {
                fontSize: 16,
                lineHeight: "20px",
            },
        },
        level2: {
            color: theme.palette.grey[900],
            paddingLeft: ({ isMenuOpen }) => (isMenuOpen ? 48 : 30),
            paddingRight: 15,
            paddingTop: 8,
            paddingBottom: 8,
            width: ({ isMenuOpen }) => (isMenuOpen ? "initial" : 240),
            "& [class*='MuiListItemText-primary']": {
                fontSize: 14,
                lineHeight: "20px",
            },
            "&:last-child": {
                borderBottom: ({ level, hasSubitems, isMenuOpen, isCollapsibleOpen }) =>
                    level === 2 && isMenuOpen && (!hasSubitems || !isCollapsibleOpen)
                        ? `1px solid ${theme.palette.grey[50]}`
                        : `1px solid ${theme.palette.common.white}`,
                boxSizing: "border-box",
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightMedium,
                "&:after": {
                    backgroundColor: ({ isMenuOpen }) => (isMenuOpen ? theme.palette.primary.main : undefined),
                },
                "&:hover": {
                    backgroundColor: theme.palette.grey[50],
                },
                "& [class*='MuiListItemText-primary']": {
                    fontWeight: theme.typography.fontWeightMedium,
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
            },
            "& [class*='MuiListItemText-root']": {
                margin: 0,
            },
        },
        level3: {
            color: theme.palette.grey[900],
            paddingLeft: ({ isMenuOpen }) => (isMenuOpen ? 50 : 30),
            paddingRight: 15,
            paddingTop: 0,
            paddingBottom: 0,
            position: "relative",
            width: ({ isMenuOpen }) => (isMenuOpen ? "initial" : 240),
            "&:last-child": {
                borderBottom: ({ isMenuOpen, level }) => (isMenuOpen && level !== 3 ? `1px solid ${theme.palette.grey[50]}` : "initial"),
                boxSizing: "border-box",
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightMedium,
                "&:hover": {
                    backgroundColor: theme.palette.grey[50],
                },
                "& [class*='MuiListItemText-primary']": {
                    fontWeight: theme.typography.fontWeightMedium,
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
            },
            "& [class*='MuiListItemText-root']": {
                margin: 0,
            },
            "& [class*='MuiListItemText-primary']": {
                fontSize: 14,
                lineHeight: "20px",
                paddingLeft: ({ isMenuOpen }) => (isMenuOpen ? 15 : 0),
                paddingTop: 8,
                paddingBottom: 8,
            },
        },
        level3MenuOpen: {
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
                "&[class*='Mui-selected']": {
                    backgroundColor: theme.palette.common.white,
                    "&:hover": {
                        backgroundColor: theme.palette.grey[50],
                    },
                    "& [class*='MuiListItemText-root']": {
                        "&:before": {
                            backgroundColor: theme.palette.primary.main,
                        },
                        "&:after": {
                            backgroundColor: theme.palette.primary.main,
                        },
                    },
                },
            },
            "&:last-child": {
                "& [class*='MuiListItemText-root']": {
                    position: "relative",
                    paddingRight: 10,
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
                "&[class*='Mui-selected']": {
                    backgroundColor: theme.palette.common.white,
                    "&:hover": {
                        backgroundColor: theme.palette.grey[50],
                    },
                    "& [class*='MuiListItemText-root']": {
                        "&:before": {
                            backgroundColor: theme.palette.primary.main,
                        },
                        "&:after": {
                            backgroundColor: theme.palette.primary.main,
                        },
                    },
                },
            },
        },
        hasIcon: {},
        hasSecondaryText: {},
        hasSecondaryAction: {
            paddingRight: 18,
        },
    });
};
