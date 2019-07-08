import TableHead from "@material-ui/core/TableHead";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import * as React from "react";
import styled, { css } from "styled-components";

export const StyledTableHead = styled(TableHead)`
    background-color: ${props => props.theme.palette.grey["100"]};
`;

export interface ITableBodyRowProps extends TableRowProps {
    index: number;
    hideTableHead?: boolean;
}

export const TableBodyRow = styled(({ index, hideTableHead, ...rest }: ITableBodyRowProps) => <TableRow {...rest} />)<ITableBodyRowProps>`
    ${({ index, hideTableHead }) =>
        (index + (hideTableHead ? 1 : 0)) % 2 === 1 &&
        css`
            background-color: ${props => props.theme.palette.grey["50"]};
        `}
`;
