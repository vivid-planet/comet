import {
    ListItem as MuiListItem,
    ListItemIcon as MuiListItemIcon,
    ListItemSecondaryAction as MuiListItemSecondaryAction,
    ListItemText as MuiListItemText,
} from "@material-ui/core";
import { ListItemIconProps } from "@material-ui/core/ListItemIcon";
import { ListItemSecondaryActionProps } from "@material-ui/core/ListItemSecondaryAction";
import { ListItemTextProps } from "@material-ui/core/ListItemText";
import * as React from "react";
import { css, styled } from "../styled-components";
import { IListItemProps, IMenuItemSelected, IMenuItemTextProps } from "./Item";

export const DefaultListItem = styled<IListItemProps>(({ level, menuOpen, enableMargin, hasIcon = false, ...rest }) => (
    <MuiListItem {...rest} classes={{ root: "root", selected: "selected" }} />
))<IListItemProps>`
    &.root {
        padding-top: ${({ hasIcon }) => (hasIcon ? `20px` : `10px`)};
        padding-bottom: ${({ hasIcon }) => (hasIcon ? `20px` : `10px`)};
        padding-left: 19px;

        ${({ enableMargin, theme }) =>
            enableMargin &&
            css`
                margin-bottom: ${theme.spacing.unit}px;
            `};

        &.selected,
        &.selected:focus {
            background-color: ${({ theme }) => theme.palette.primary.main};
        }

        &:hover,
        &.selected:hover {
            background-color: ${({ theme }) => theme.palette.primary.light};
        }
    }
`;

export const DefaultListItemText = styled<IMenuItemTextProps & ListItemTextProps>(({ selected, level, ...rest }) => (
    <MuiListItemText {...rest} classes={{ root: "root", primary: "primary", textDense: "textDense" }} />
))<IMenuItemTextProps>`
    &.root {
        &:first-child {
            ${({ inset }) => inset && `padding-left: 60px`};
        }

        .primary {
            font-size: 15px;
            line-height: 20px;
            color: ${({ selected, theme }) => (selected ? theme.palette.primary.contrastText : theme.palette.text.primary)};
            font-weight: ${({ selected, level }) => (selected || level === 1 ? "bold" : "normal")};
        }
    }
`;

export const DefaultListItemIcon = styled<IMenuItemSelected & ListItemIconProps>(({ selected, ...rest }) => (
    <MuiListItemIcon {...rest} classes={{ root: "root" }} />
))<IMenuItemSelected>`
    &.root {
        > svg {
            font-size: 20px;
            color: ${({ selected, theme }) => (selected ? theme.palette.primary.contrastText : theme.palette.text.primary)};
        }
    }
`;

export const TextIcon = styled.div<IMenuItemSelected>`
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 15px;
    line-height: 20px;
    width: 20px;
    text-align: center;

    ${({ selected }) =>
        selected &&
        css`
            color: white;
            font-weight: bold;
        `};
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
