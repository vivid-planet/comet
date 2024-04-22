import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { MenuCollapsibleItemProps } from "./CollapsibleItem";

export type MenuCollapsibleItemClassKey =
    | "root"
    | "childSelected"
    | "listItem"
    | "open"
    | "itemTitle"
    | "collapsibleIcon"
    | "collapsibleIconColorGrey"
    | "collapsibleIconColorWhite";

export const styles = (theme: Theme) =>
    createStyles<MenuCollapsibleItemClassKey, MenuCollapsibleItemProps>({
        root: {},
        childSelected: {
            color: theme.palette.primary.main,
            fontWeight: theme.typography.fontWeightMedium,
            "& $listItem": {
                "& [class*='MuiListItemText-root']": {
                    color: theme.palette.primary.main,
                    "& [class*='MuiListItemText-primary']": {
                        fontWeight: ({ level }) => (level === 2 || level === 3) && 600,
                    },
                },
                "& [class*='MuiListItemIcon-root']": {
                    color: theme.palette.primary.main,
                },
            },
            "& [class*='MuiListItemIcon-root']": {
                color: theme.palette.primary.main,
            },
        },
        itemTitle: {
            fontWeight: 600,
            fontSize: 12,
            padding: "20px 15px 20px 15px",
            lineHeight: "16px",
            color: theme.palette.grey[500],
        },
        collapsibleIcon: {
            fontSize: ({ isMenuOpen, level }) => (isMenuOpen || level === 2 || level === 3 ? 16 : 12),
        },
        collapsibleIconColorWhite: {
            color: theme.palette.common.white,
        },
        collapsibleIconColorGrey: {
            color: ({ isMenuOpen, level }) => (isMenuOpen || level === 2 || level === 3 ? theme.palette.grey[900] : theme.palette.grey[200]),
        },
        listItem: {},
        open: {},
    });
