import { Box, Button } from "@material-ui/core";
import styled from "styled-components";

interface IFieldSidebarWrapper {
    fieldSidebarHeight: number;
}

export const CancelButton = styled(Button)`
    && {
        border-bottom: 1px solid #cecfcf;
        justify-content: start;
        border-radius: 0;
        padding: 20px;
    }
`;

export const FilterContainer = styled.div``;

export const ResetButton = styled(Button)`
    && {
        margin-top: 20px;
        padding: 0 8px;
    }
`;

export const StyledFieldHeaderBox = styled(Box)`
    padding: 20px 20px 0 20px;
`;

export const StyledFieldBox = styled(Box)`
    min-width: 300px;
    padding: 20px;
`;

export const SubmitButton = styled(Button)`
    && {
        padding: 10px 19px;
        border-radius: 0;
        width: 100%;
    }
`;

export const SubmitContainer = styled(Box)`
    border-top: 1px solid #cecfcf;
    padding: 20px;
`;

export const FieldSidebarWrapper = styled.div<IFieldSidebarWrapper>`
    max-height: ${({ fieldSidebarHeight }) => fieldSidebarHeight}px;
`;
