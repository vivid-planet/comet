import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { MenuCollapsibleItemProps } from "./CollapsibleItem";

export type MenuCollapsibleItemClassKey =
    | "root"
    | "childSelected"
    | "listItem"
    | "open"
    | "collapsedMenuParentTitle"
    | "itemTitle"
    | "collapsibleIcon"
    | "collapsibleIconLevelTwo"
    | "collapsibleIconLevelOne";

export const styles = (theme: Theme) =>
    createStyles<MenuCollapsibleItemClassKey, MenuCollapsibleItemProps>({
        root: {},
        childSelected: {
            color: theme.palette.primary.main,
            "& $listItem": {
                "& [class*='MuiListItemText-root']": {
                    color: theme.palette.primary.main,
                    "& [class*='MuiListItemText-primary']": {
                        fontWeight: ({ level }) => level === 2 || (level === 3 && theme.typography.fontWeightBold),
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
        collapsedMenuParentTitle: {
            backgroundColor: ({ level, isMenuOpen, isCollapsibleOpen }) =>
                level === 1 && !isMenuOpen && isCollapsibleOpen ? theme.palette.primary.main : theme.palette.grey[50],
        },
        itemTitle: {
            fontWeight: 600,
            fontSize: 12,
            padding: "20px 15px 20px 15px",
            lineHeight: "16px",
            color: theme.palette.grey[500],
        },
        collapsibleIcon: {
            fontSize: 12,
            color: theme.palette.grey[200],
        },
        collapsibleIconLevelOne: {
            color: theme.palette.common.white,
        },
        collapsibleIconLevelTwo: {
            color: theme.palette.grey[200],
        },
        listItem: {},
        open: {},
    });
