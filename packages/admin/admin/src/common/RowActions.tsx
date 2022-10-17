import { MoreVertical } from "@comet/admin-icons";
import {
    IconButton,
    IconButtonProps,
    ListItemIcon,
    ListItemIconProps,
    ListItemText,
    ListItemTextProps,
    Menu,
    MenuItem,
    MenuItemProps,
    MenuProps,
    Tooltip,
    TooltipProps,
} from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

export interface RowActionsIconItemComponentsProps {
    tooltip?: Omit<TooltipProps, "children">;
}

export interface RowActionsIconItemProps extends Omit<IconButtonProps, "children"> {
    icon: React.ReactNode;
    tooltip?: string;
    componentsProps?: RowActionsIconItemComponentsProps;
}

export interface RowActionsMenuItemComponentsProps {
    listItemIcon?: Omit<ListItemIconProps, "children">;
    listItemText?: Omit<ListItemTextProps, "primary">;
}

export interface RowActionsMenuItemProps extends Omit<MenuItemProps, "children" | "onClick"> {
    icon?: React.ReactNode;
    text: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLElement>, closeMenu: () => void) => void;
    preventCloseOnClick?: boolean;
    componentsProps?: RowActionsMenuItemComponentsProps;
}

export interface RowActionsComponentsProps {
    menu?: Omit<MenuProps, "open" | "onClick">;
    menuIconButton?: Omit<IconButtonProps, "ref" | "onClick">;
}

export type RowActionsIconItem = RowActionsIconItemProps | React.ReactNode;
export type RowActionsMenuItem = RowActionsMenuItemProps | React.ReactNode | ((closeMenu: () => void) => RowActionsMenuItemProps | React.ReactNode);

export interface RowActionsProps {
    iconActions?: RowActionsIconItem[];
    menuActions?: RowActionsMenuItem[];
    moreMenuIcon?: React.ReactNode;
    componentsProps?: RowActionsComponentsProps;
}

const iconActionIsPropsObject = (action: RowActionsIconItem): action is RowActionsIconItemProps => {
    return Boolean(action && typeof action !== "string" && typeof action !== "number" && typeof action !== "boolean" && "icon" in action);
};

const menuActionIsPropsObject = (action: RowActionsMenuItemProps | React.ReactNode): action is RowActionsMenuItemProps => {
    return Boolean(action && typeof action !== "string" && typeof action !== "number" && typeof action !== "boolean" && "text" in action);
};

const RowActions = ({
    iconActions,
    menuActions,
    moreMenuIcon = <MoreVertical />,
    componentsProps = {},
    classes,
}: RowActionsProps & WithStyles<typeof styles>): React.ReactElement => {
    const { menu: menuProps, menuIconButton: menuIconButtonProps } = componentsProps;
    const [showMenu, setShowMenu] = React.useState<boolean>(false);
    const menuButtonRef = React.useRef<HTMLButtonElement>(null);

    return (
        <div className={classes.root}>
            {iconActions && (
                <>
                    {iconActions.map((action, index) => {
                        if (iconActionIsPropsObject(action)) {
                            const { icon, tooltip, componentsProps = {}, ...restIconButtonProps } = action;
                            const { tooltip: tooltipProps } = componentsProps;

                            if (tooltip) {
                                return (
                                    <Tooltip key={index} title={tooltip} {...tooltipProps}>
                                        <IconButton {...restIconButtonProps}>{icon}</IconButton>
                                    </Tooltip>
                                );
                            }

                            return (
                                <IconButton key={index} {...restIconButtonProps}>
                                    {icon}
                                </IconButton>
                            );
                        }

                        return action;
                    })}
                </>
            )}
            {menuActions && (
                <>
                    <IconButton {...menuIconButtonProps} ref={menuButtonRef} onClick={() => setShowMenu(true)}>
                        {moreMenuIcon}
                    </IconButton>
                    <Menu anchorEl={menuButtonRef.current} open={showMenu} onClose={() => setShowMenu(false)} {...menuProps}>
                        {menuActions.map((action, index) => {
                            const executedAction = typeof action === "function" ? action(() => setShowMenu(false)) : action;

                            if (menuActionIsPropsObject(executedAction)) {
                                const { text, icon, onClick, preventCloseOnClick, componentsProps = {}, ...restMenuItemProps } = executedAction;
                                const { listItemIcon: listItemIconProps, listItemText: listItemTextProps } = componentsProps;

                                return (
                                    <MenuItem
                                        key={index}
                                        {...restMenuItemProps}
                                        onClick={(e) => {
                                            onClick?.(e, () => setShowMenu(false));
                                            if (!preventCloseOnClick) {
                                                setShowMenu(false);
                                            }
                                        }}
                                    >
                                        {icon && <ListItemIcon {...listItemIconProps}>{icon}</ListItemIcon>}
                                        <ListItemText primary={text} {...listItemTextProps} />
                                    </MenuItem>
                                );
                            }

                            return executedAction;
                        })}
                    </Menu>
                </>
            )}
        </div>
    );
};

export type RowActionsClassKey = "root";

const styles = () =>
    createStyles<RowActionsClassKey, RowActionsProps>({
        root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
        },
    });

const RowActionsWithStyles = withStyles(styles, { name: "CometAdminRowActions" })(RowActions);

export { RowActionsWithStyles as RowActions };

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminRowActions: RowActionsProps;
    }

    interface ComponentNameToClassKey {
        CometAdminRowActions: RowActionsClassKey;
    }

    interface Components {
        CometAdminRowActions?: {
            defaultProps?: ComponentsPropsList["CometAdminRowActions"];
            styleOverrides?: ComponentNameToClassKey["CometAdminRowActions"];
        };
    }
}
