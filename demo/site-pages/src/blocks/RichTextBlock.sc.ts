import styled, { css } from "styled-components";

interface WrapperProps {
    colorTheme?: "Default" | "GreyN1" | "GreyN2" | "GreyN3" | "DarkBlue";
}

export const Wrapper = styled.div<WrapperProps>`
    ${({ colorTheme }) =>
        colorTheme === "DarkBlue" &&
        css`
            color: white;
        `}

    ${({ colorTheme }) =>
        colorTheme === "GreyN3" &&
        css`
            color: white;
        `}
`;

export const UnorderedList = styled.ul`
    margin: 40px 0;
    padding-left: 30px;
`;
