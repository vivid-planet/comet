import styled from "styled-components";

export const ButtonWrapper = styled.div`
    margin-right: 1px;

    && {
        min-width: 0;
    }

    :last-child {
        margin-right: 0;
    }
`;
