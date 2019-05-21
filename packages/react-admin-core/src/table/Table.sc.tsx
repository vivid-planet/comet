import TableHead from "@material-ui/core/TableHead";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import * as React from "react";
import styled from "styled-components";

export const StyledTableHead = styled(TableHead)`
    background-color: ${props => props.theme.palette.grey["100"]};
`;

interface ITableRowProps extends TableRowProps {
    hideTableHead: boolean;
}

export const StyledTableBodyRow = styled<ITableRowProps>(({ hideTableHead, ...rest }) => <TableRow {...rest} />)`
    &:nth-child(${props => (props.hideTableHead ? "odd" : "even")}) {
        background-color: ${props => props.theme.palette.grey["50"]};
    }
`;
