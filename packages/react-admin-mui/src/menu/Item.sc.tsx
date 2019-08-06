import {
    ListItem as MuiListItem,
    ListItemIcon as MuiListItemIcon,
    ListItemSecondaryAction as MuiListItemSecondaryAction,
    ListItemText as MuiListItemText,
} from "@material-ui/core";
import { ListItemProps } from "@material-ui/core/ListItem";
import { ListItemIconProps } from "@material-ui/core/ListItemIcon";
import { ListItemSecondaryActionProps } from "@material-ui/core/ListItemSecondaryAction";
import { ListItemTextProps } from "@material-ui/core/ListItemText";
import * as React from "react";
import { css, styled } from "../styled-components";

interface IMenuItemStyleProps {
    level: number;
    hasIcon: boolean;
    menuOpen: boolean;
    enableMargin?: boolean;
}

export const ListItem = styled(({ level, menuOpen, enableMargin, hasIcon = false, ...rest }: IMenuItemStyleProps & ListItemProps) => (
    // @ts-ignore
    <MuiListItem {...rest} classes={{ root: "root", selected: "selected" }} />
))<IMenuItemStyleProps & ListItemProps>`
    &.root {
        padding-top: ${({ hasIcon }) => (hasIcon ? `20px` : `10px`)};
        padding-bottom: ${({ hasIcon }) => (hasIcon ? `20px` : `10px`)};
        padding-left: 19px;

        ${({ enableMargin, theme }) =>
            enableMargin &&
            css`
                margin-bottom: ${theme.spacing(1)}px;
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

interface IMenuItemSelected {
    selected?: boolean;
}

interface IMenuItemTextStyleProps extends IMenuItemSelected {
    level: number;
}

export const ListItemText = styled(({ selected, level, ...rest }: IMenuItemTextStyleProps & ListItemTextProps) => (
    <MuiListItemText {...rest} classes={{ root: "root", primary: "primary", dense: "dense" }} />
))<IMenuItemTextStyleProps & ListItemTextProps>`
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

export const ListItemIcon = styled(({ selected, ...rest }: IMenuItemSelected & ListItemIconProps) => (
    <MuiListItemIcon {...rest} classes={{ root: "root" }} />
))<IMenuItemSelected & ListItemIconProps>`
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

export const ListItemSecondaryAction = styled(
    ({ selected, ...rest }: IMenuItemSelected & ListItemSecondaryActionProps & { children: React.ReactNode }) => (
        <MuiListItemSecondaryAction {...rest} classes={{ root: "root" }} />
    ),
)<IMenuItemSelected & ListItemSecondaryActionProps & { children: React.ReactNode }>`
    &.root {
        > svg {
            font-size: 20px;
            color: ${({ selected, theme }) => (selected ? theme.palette.primary.contrastText : theme.palette.text.primary)};
        }
    }
`;
