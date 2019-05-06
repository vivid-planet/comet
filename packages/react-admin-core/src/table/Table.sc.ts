import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import styled from "styled-components";

export const StyledTableHead = styled(TableHead)`
    background-color: ${props => props.theme.palette.grey["100"]};
`;

export const StyledTableRow = styled(TableRow)`
    &:nth-child(even) {
        background-color: ${props => props.theme.palette.grey["50"]};
    }
`;
