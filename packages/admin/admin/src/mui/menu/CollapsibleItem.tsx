import { ChevronDown, ChevronUp } from "@comet/admin-icons";
import { Collapse, List } from "@mui/material";
import { ComponentsOverrides, css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { matchPath, useLocation } from "react-router";

import { createSlot } from "../../helpers/createSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { MenuItem, MenuItemProps } from "./Item";
import { MenuItemRouterLinkProps } from "./ItemRouterLink";

export type MenuCollapsibleItemClassKey = "root" | "childSelected" | "listItem" | "menuItem" | "open";

type OwnerState = { hasSelectedChild: boolean; open: boolean };

const Root = createSlot("div")<MenuCollapsibleItemClassKey, OwnerState>({
    componentName: "MenuCollapsibleItem",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.hasSelectedChild && "childSelected", ownerState.open && "open"];
    },
})(
    ({ theme, ownerState }) => css`
        ${ownerState.hasSelectedChild &&
        css`
            color: ${theme.palette.primary.main};
        `}
    `,
);

const ListItem = createSlot("div")<MenuCollapsibleItemClassKey, OwnerState>({
    componentName: "MenuCollapsibleItem",
    slotName: "listItem",
})(
    ({ theme, ownerState }) => css`
        ${ownerState.hasSelectedChild &&
        css`
            [class*="MuiListItemText-root"] {
                color: ${theme.palette.primary.main};
            }
            && [class*="MuiListItemIcon-root"] {
                color: ${theme.palette.primary.main};
            }
        `}
    `,
);

const Item = createSlot(MenuItem)<MenuCollapsibleItemClassKey>({
    componentName: "MenuCollapsibleItem",
    slotName: "menuItem",
})();

export interface MenuLevel {
    level?: 1 | 2;
}

type MenuChild = React.ReactElement<MenuItemRouterLinkProps>;

export interface MenuCollapsibleItemProps
    extends Omit<MenuItemProps, "slotProps">,
        ThemedComponentBaseProps<{
            root: "div";
            listItem: "div";
            menuItem: typeof MenuItem;
        }> {
    children: MenuChild | MenuChild[];
    openByDefault?: boolean;
    openedIcon?: React.ReactNode;
    closedIcon?: React.ReactNode;
}

export function MenuCollapsibleItem(inProps: MenuCollapsibleItemProps) {
    const {
        level,
        primary,
        secondary,
        icon,
        openByDefault = false,
        openedIcon = <ChevronUp />,
        closedIcon = <ChevronDown />,
        children,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminMenuCollapsibleItem" });

    const itemLevel: 1 | 2 = level ? level : 1;
    let hasSelectedChild = false;
    const location = useLocation();

    const childElements = React.Children.map(children, (child: MenuChild) => {
        if (matchPath(location.pathname, { path: child.props.to, strict: true })) {
            hasSelectedChild = true;
        }

        const newItemLevel = itemLevel + 1;

        return React.cloneElement<MenuLevel>(child, {
            level: newItemLevel === 1 || newItemLevel === 2 ? newItemLevel : undefined,
        });
    });

    const [open, setOpen] = React.useState<boolean>(openByDefault || hasSelectedChild);

    const ownerState: OwnerState = {
        hasSelectedChild,
        open,
    };

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <ListItem ownerState={ownerState} {...slotProps?.listItem}>
                <Item
                    primary={primary}
                    secondary={secondary}
                    icon={icon}
                    level={level}
                    onClick={() => setOpen(!open)}
                    secondaryAction={open ? openedIcon : closedIcon}
                    {...slotProps?.menuItem}
                />
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding>{childElements}</List>
            </Collapse>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemClassKey;
    }

    interface ComponentsPropsList {
        CometAdminMenuCollapsibleItem: MenuCollapsibleItemProps;
    }

    interface Components {
        CometAdminMenuCollapsibleItem?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminMenuCollapsibleItem"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuCollapsibleItem"];
        };
    }
}
