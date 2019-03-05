import {
    ListItem as MuiListItem,
    ListItemIcon as MuiListItemIcon,
    ListItemSecondaryAction as MuiListItemSecondaryAction,
    ListItemText as MuiListItemText,
} from "@material-ui/core";
import { ListItemIconProps } from "@material-ui/core/ListItemIcon";
import { ListItemSecondaryActionProps } from "@material-ui/core/ListItemSecondaryAction";
import { ListItemTextProps } from "@material-ui/core/ListItemText";
import styled from "@vivid-planet/react-admin-mui/styled-components";
import * as React from "react";

interface IMenuItemStyleProps {
    level: number;
    menuOpen: boolean;
    enableMargin?: boolean;
}

export const ListItem = styled<IMenuItemStyleProps>(({ level, menuOpen, enableMargin, ...rest }) => (
    <MuiListItem {...rest} classes={{ root: "root", selected: "selected" }} />
))<IMenuItemStyleProps>`
    &.root {
        padding-bottom: 10px;
        padding-top: 10px;
        padding-left: ${({ theme, level, menuOpen }) => theme.spacing.unit * 2 * (menuOpen ? level : 1)}px;
        ${({ enableMargin, theme }) => enableMargin && `margin-bottom: ${theme.spacing.unit}px`}

        &.selected {
            background-color: ${({ theme }) => theme.palette.primary.main};
        }

        &:hover,
        &.selected:hover {
            background-color: ${({ theme }) => theme.palette.primary.light};
        }
    }
`;

interface IMenuItemSelected {
    selected?: boolean;
}

interface IMenuItemTextStyleProps extends IMenuItemSelected {
    level: number;
}

export const ListItemText = styled<IMenuItemTextStyleProps & ListItemTextProps>(({ selected, level, ...rest }) => (
    <MuiListItemText {...rest} classes={{ root: "root", primary: "primary", textDense: "textDense" }} />
))<IMenuItemTextStyleProps>`
    &.root {
        .primary {
            font-size: 15px;
            line-height: 20px;
            color: ${props => (props.selected ? props.theme.palette.primary.contrastText : props.theme.palette.text.primary)};
            font-weight: ${props => (props.selected || props.level === 1 ? "bold" : "normal")};
        }
    }
`;

export const ListItemIcon = styled<IMenuItemSelected & ListItemIconProps>(({ selected, ...rest }) => (
    <MuiListItemIcon {...rest} classes={{ root: "root" }} />
))<IMenuItemSelected>`
    &.root {
        > svg {
            font-size: 20px;
            color: ${({ selected, theme }) => (selected ? theme.palette.primary.contrastText : theme.palette.text.primary)};
        }
    }
`;

export const ListItemSecondaryAction = styled<IMenuItemSelected & ListItemSecondaryActionProps>(({ selected, ...rest }) => (
    <MuiListItemSecondaryAction {...rest} classes={{ root: "root" }} />
))<IMenuItemSelected>`
    &.root {
        > svg {
            font-size: 20px;
            color: ${({ selected, theme }) => (selected ? theme.palette.primary.contrastText : theme.palette.text.primary)};
        }
    }
`;
