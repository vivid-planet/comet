import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageTreeCell = styled(TableCell)`
    border: none;
    height: 100%;
    display: flex;
    align-items: center;

    > * {
        position: relative;
        z-index: 11;
    }
`;

export const PageInfoCell = styled(PageTreeCell)`
    flex-grow: 1;
    text-align: left;
    padding-left: 0;
`;

export const PageVisibilityCell = styled(PageTreeCell)`
    width: 180px;
`;

export const RowClickContainer = styled("div")`
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
`;
