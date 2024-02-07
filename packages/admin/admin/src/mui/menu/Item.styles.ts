import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { MenuItemProps, MuiListItemProps } from "./Item";

export type MenuItemClassKey = "root" | "level1" | "level2" | "level3" | "hasIcon" | "hasSecondaryText" | "hasSecondaryAction" | "level3Enumeration";

export const styles = (theme: Theme) => {
    const colors = {
        textLevel1: theme.palette.grey[800],
        textLevel2: theme.palette.grey[900],
    };

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
            },
            "& [class*='MuiListItemIcon-root']": {
                color: colors.textLevel1,
                minWidth: ({ isMenuOpen }) => (isMenuOpen ? 28 : 22),
            },
            "& [class*='MuiListItemText-inset']": {
                paddingLeft: ({ icon, level }) => (!!icon && level === 1 ? 28 : 0),
            },
            "&[class*='Mui-selected']": {
                "& [class*='MuiListItemText-secondary']": {
                    color: "inherit",
                },
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
                fontWeight: theme.typography.fontWeightMedium,
                fontSize: 16,
                lineHeight: "20px",
            },
        },
        level2: {
            color: colors.textLevel2,
            paddingLeft: ({ isMenuOpen }) => (isMenuOpen ? 48 : 20),
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            "& [class*='MuiListItemText-primary']": {
                fontWeight: theme.typography.fontWeightRegular,
                fontSize: 14,
                lineHeight: "20px",
            },
            "&:last-child": {
                borderBottom: ({ level, hasSubitems, isMenuOpen, isCollapsibleOpen }) =>
                    level === 2 && isMenuOpen && (!hasSubitems || !isCollapsibleOpen) ? `1px solid ${theme.palette.grey[50]}` : "initial",
                boxSizing: "border-box",
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightBold,
                "&:after": {
                    backgroundColor: ({ isMenuOpen }) => (isMenuOpen ? theme.palette.primary.main : undefined),
                },
                "&:hover": {
                    backgroundColor: theme.palette.grey[50],
                },
                "& [class*='MuiListItemText-primary']": {
                    fontWeight: theme.typography.fontWeightBold,
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
            color: colors.textLevel2,
            paddingLeft: ({ isMenuOpen }) => (isMenuOpen ? 50 : 20),
            paddingRight: 20,
            paddingTop: 0,
            paddingBottom: 0,
            position: "relative",
            "& [class*='MuiListItemText-inset']": {
                paddingLeft: 0,
            },
            "&:last-child": {
                borderBottom: ({ isMenuOpen, level }) => (isMenuOpen && level !== 3 ? `1px solid ${theme.palette.grey[50]}` : "initial"),
                boxSizing: "border-box",
            },
            "&[class*='Mui-selected']": {
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main,
                fontWeight: theme.typography.fontWeightBold,
                "&:hover": {
                    backgroundColor: theme.palette.grey[50],
                },
                "& [class*='MuiListItemText-primary']": {
                    fontWeight: theme.typography.fontWeightBold,
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
            },
            "& [class*='MuiListItemText-root']": {
                margin: 0,
            },
            "& [class*='MuiListItemText-primary']": {
                fontWeight: theme.typography.fontWeightRegular,
                fontSize: 14,
                lineHeight: "20px",
                paddingLeft: ({ isMenuOpen }) => (isMenuOpen ? 14 : 0),
                paddingTop: 14,
                paddingBottom: 14,
            },
        },
        level3Enumeration: {
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
