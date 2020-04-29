import { css, styled } from "@vivid-planet/react-admin-mui";

interface IRootProps {
    disabled: boolean;
    selected: boolean;
}

export const Root = styled.div<IRootProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
    width: 24px;
    height: 24px;
    background-color: transparent;
    border: 1px solid transparent;
    box-sizing: border-box;
    transition: background-color 200ms, border-color 200ms, color 200ms;
    font-size: 20px;
    color: ${({ theme }) => theme.palette.grey[500]};

    :hover {
        background-color: ${({ theme }) => theme.palette.grey[100]};
        border-color: ${({ theme }) => theme.palette.grey[200]};
    }

    ${({ disabled, selected, theme }) =>
        selected &&
        !disabled &&
        css`
            &,
            :hover {
                border-color: ${theme.palette.grey[100]};
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
                color: ${theme.palette.grey[200]};
            }
        `};
`;
