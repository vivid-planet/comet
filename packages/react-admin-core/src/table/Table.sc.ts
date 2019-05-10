import TableHead from "@material-ui/core/TableHead";
import TableRow, { TableRowProps } from "@material-ui/core/TableRow";
import styled from "styled-components";

export const StyledTableHead = styled(TableHead)`
    background-color: ${props => props.theme.palette.grey["100"]};
`;

interface ITableRowProps extends TableRowProps {
    hideTableHead: boolean;
}

export const StyledTableBodyRow = styled(TableRow)<ITableRowProps>`
    &:nth-child(${props => (props.hideTableHead ? "odd" : "even")}) {
        background-color: ${props => props.theme.palette.grey["50"]};
    }
`;
