import { Box, Button, Popover } from "@material-ui/core";
import styled from "styled-components";

export const ButtonsContainer = styled(Box)`
    border-top: 1px solid #cecfcf;
    padding: 20px;
`;

export const StyledPopover = styled(Popover)`
    && .paper {
        overflow-x: visible;
        overflow-y: visible;
    }
`;

export const PopoverContentContainer = styled.div`
    border: 1px solid #cecfcf;

    &:before {
        border-left: 1px solid #cecfcf;
        border-top: 1px solid #cecfcf;
        transform: rotateZ(45deg);
        background-color: #ffffff;
        position: absolute;
        display: block;
        height: 10px;
        content: "";
        width: 10px;
        left: 50%;
        top: -5px;
    }
`;

export const FilterContainer = styled.div``;

export const ResetCloseContainer = styled(Box)`
    justify-content: space-between;
    display: flex;
`;

export const StyledBox = styled.div`
    position: relative;

    &:after {
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        border-top: 4px solid #cecfcf;
        position: absolute;
        display: block;
        content: "";
        height: 0;
        width: 0;
        right: 0;
        top: 50%;
    }
`;

export const SubmitButton = styled(Button)`
    && {
        padding: 10px 19px;
        border-radius: 0;
        width: 100%;
    }
`;

export const SubmitContainer = styled(Box)`
    && {
        margin-bottom: 20px;
    }
`;

export const ResetButton = styled(Button)`
    && {
        padding: 0 8px;
    }
`;

export const CancelButton = styled(Button)`
    && {
        padding: 0 8px;
    }
`;
