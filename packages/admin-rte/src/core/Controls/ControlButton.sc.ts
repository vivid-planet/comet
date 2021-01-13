import styled, { css } from "styled-components";

interface IRootProps {
    disabled: boolean;
    selected: boolean;
    renderAsIcon: boolean;
}

// must be a button to support "disabled" - attribute
export const Root = styled.button<IRootProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    height: 24px;
    background-color: transparent;
    border: 1px solid transparent;
    box-sizing: border-box;
    transition: background-color 200ms, border-color 200ms, color 200ms;
    font-size: 20px;
    color: ${({ theme }) => theme.rte.colors.buttonIcon};

    ${({ renderAsIcon }) =>
        renderAsIcon &&
        css`
            width: 24px;
        `};

    :hover {
        background-color: ${({ theme }) => theme.rte.colors.buttonBackgroundHover};
        border-color: ${({ theme }) => theme.rte.colors.buttonBorderHover};
    }

    ${({ disabled, selected, theme }) =>
        selected &&
        !disabled &&
        css`
            &,
            :hover {
                border-color: ${theme.rte.colors.buttonBorderHover};
                background-color: white;
            }
        `};

    ${({ disabled, theme }) =>
        disabled &&
        css`
            &,
            :hover {
                background-color: transparent;
                border-color: transparent;
                color: ${theme.rte.colors.buttonIconDisabled};
            }
        `};
`;
