import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

const PageTreeCell = styled(TableCell)`
    border: none;
    height: 100%;
    display: flex;
    align-items: center;

    > * {
        position: relative;
        z-index: 11;
    }
`;

export const SelectPageCell = styled(PageTreeCell)`
    padding-left: 11px;
    padding-right: 0;
`;

export const PageInfoCell = styled(PageTreeCell)`
    flex-basis: 100%;
    text-align: left;
    padding-left: 0;
    padding-right: 0;
    overflow: hidden;
    pointer-events: none;
`;

export const PageVisibilityCell = styled(PageTreeCell)`
    width: 180px;
`;

export const PageActionsCell = styled(PageTreeCell)`
    justify-content: flex-end;
    width: 160px;
`;

export const RowClickContainer = styled("div")`
    position: absolute;
    z-index: 10;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
`;

export const AddContainer = styled("div")`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
`;
