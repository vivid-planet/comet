import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from "@mui/material";
import { ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

import { MenuLevel } from "./CollapsibleItem";
import { MenuContext } from "./Context";

export type MenuItemClassKey = "root" | "level1" | "level2" | "hasIcon" | "hasSecondaryText" | "hasSecondaryAction";

type OwnerState = Pick<MenuItemProps, "level" | "icon" | "secondary" | "secondaryAction">;

const colors = {
    textLevel1: "#242424",
    textLevel2: "#17181A",
};

const Root = styled(ListItemButton, {
    name: "CometAdminMenuItem",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [
            styles.root,
            ownerState.level === 1 && styles.level1,
            ownerState.level === 2 && styles.level2,
            ownerState.icon && styles.hasIcon,
            ownerState.secondaryAction && styles.hasSecondaryAction,
            ownerState.secondary && styles.hasSecondaryText,
        ];
    },
})<{ ownerState: OwnerState }>(
    ({ theme, ownerState }) => css`
        flex-shrink: 0;
        flex-grow: 0;

        &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 2px;
        }

        .MuiListItemIcon-root {
            color: ${colors.textLevel1};
            min-width: 28px;
        }

        .MuiListItemText-inset {
            padding-left: 28px;
        }

        .MuiSvgIcon-root {
            font-size: 16px;
        }

        ${ownerState.level === 1 &&
        css`
            border-bottom: 1px solid ${theme.palette.grey[50]};
            box-sizing: border-box;
            color: ${colors.textLevel1};
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 16px;
            padding-bottom: 16px;

            &.Mui-selected {
                background-color: ${theme.palette.grey[50]};
                color: ${theme.palette.primary.main};

                &:after {
                    background-color: ${theme.palette.primary.main};
                }
                .MuiListItemIcon-root {
                    color: ${theme.palette.primary.main};
                }
            }

            .MuiListItemText-primary {
                font-weight: ${theme.typography.fontWeightMedium};
                font-size: 16px;
                line-height: 20px;
            }
        `}

        ${ownerState.level === 2 &&
        css`
            color: ${colors.textLevel2};
            padding-left: 20px;
            padding-right: 20px;
            padding-top: 10px;
            padding-bottom: 10px;

            &:last-child {
                border-bottom: 1px solid ${theme.palette.grey[50]};
                box-sizing: border-box;
            }

            &.Mui-selected {
                background-color: ${theme.palette.primary.main};
                color: #fff;

                &:after {
                    background-color: ${theme.palette.primary.dark};
                }
                &:hover {
                    background-color: ${theme.palette.primary.dark};
                }
                & .MuiListItemText-primary {
                    font-weight: ${theme.typography.fontWeightBold};
                }
            }

            .MuiListItemText-root {
                margin: 0;
            }

            .MuiListItemText-primary {
                font-weight: ${theme.typography.fontWeightRegular};
                font-size: 14px;
                line-height: 20px;
            }
        `};

        ${ownerState.secondaryAction &&
        css`
            padding-right: 18px;
        `}
    `,
);

export interface MenuItemProps extends ThemedComponentBaseProps<{ root: typeof ListItemButton }>, MenuLevel, ListItemButtonProps {
    primary: React.ReactNode;
    secondary?: React.ReactNode;
    icon?: React.ReactElement;
    secondaryAction?: React.ReactNode;
}

export function MenuItem(inProps: MenuItemProps) {
    const {
        primary,
        secondary,
        icon,
        level = 1,
        secondaryAction,
        slotProps,
        ...otherProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminMenuItem",
    });

    const ownerState: OwnerState = {
        level,
        icon,
        secondaryAction,
        secondary,
    };

    const hasIcon = !!icon;

    const context = React.useContext(MenuContext);
    if (!context) throw new Error("Could not find context for menu");
    if (level > 2) throw new Error("Maximum nesting level of 2 exceeded.");

    return (
        <Root {...slotProps?.root} ownerState={ownerState} {...otherProps}>
            {hasIcon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={primary} secondary={secondary} inset={!icon} />
            {!!secondaryAction && secondaryAction}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminMenuItem: MenuItemClassKey;
    }

    interface Components {
        CometAdminMenuItem?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminMenuItem"];
        };
    }
}
