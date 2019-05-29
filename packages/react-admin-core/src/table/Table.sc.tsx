import TableHead from "@material-ui/core/TableHead";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import * as React from "react";
import styled, { css } from "styled-components";

export const StyledTableHead = styled(TableHead)`
    background-color: ${props => props.theme.palette.grey["100"]};
`;

export interface ITableBodyRowProps extends TableRowProps {
    index: number;
}

export const TableBodyRow = styled<ITableBodyRowProps>(({ index, ...rest }) => <TableRow {...rest} />)`
    ${({ index }) =>
        index % 2 === 1 &&
        css`
            background-color: ${props => props.theme.palette.grey["50"]};
        `}
`;
