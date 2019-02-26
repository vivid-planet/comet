import { ListItem as MuiListItem } from "@material-ui/core";
import styled from "@vivid-planet/react-admin-mui/styled-components";
import * as React from "react";

interface IMenuItemStyleProps {
    level: number;
    menuOpen: boolean;
}

export const ListItem = styled(MuiListItem)<IMenuItemStyleProps>`
    padding-left: ${({ theme, level, menuOpen }) => theme.spacing.unit * 2 * (menuOpen ? level : 1)};
`;
