import { css, styled } from "@vivid-planet/react-admin-mui";
import { IColors } from "../Rte";

interface IRootProps {
    disabled: boolean;
    selected: boolean;
    renderAsIcon: boolean;
    colors: IColors;
}

export const Root = styled.div<IRootProps>`
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
    color: ${({ colors }) => colors.buttonIcon};

    ${({ renderAsIcon }) =>
        renderAsIcon &&
        css`
            width: 24px;
        `};

    :hover {
        background-color: ${({ colors }) => colors.buttonBackgroundHover};
        border-color: ${({ colors }) => colors.buttonBorderHover};
    }

    ${({ disabled, selected, colors }) =>
        selected &&
        !disabled &&
        css`
            &,
            :hover {
                border-color: ${colors.buttonBorderHover};
                background-color: white;
            }
        `};

    ${({ disabled, colors }) =>
        disabled &&
        css`
            &,
            :hover {
                background-color: transparent;
                border-color: transparent;
                color: ${colors.buttonIconDisabled};
            }
        `};
`;
