import styled from "styled-components";

export const Wrapper = styled.div`
    padding: 0 20px;
    width: 100%;
`;

export const InputsWrapper = styled.div`
    justify-content: space-between;
    align-items: center;
    display: flex;
`;

export const InputFieldContainer = styled.div`
    text-align: center;
    line-height: 90px;

    input {
        text-align: center;
        min-width: 50px;
    }
`;

export const InputFieldsSeperatorContainer = styled(InputFieldContainer)``;

export const SliderWrapper = styled.div`
    padding-bottom: 20px;
`;
