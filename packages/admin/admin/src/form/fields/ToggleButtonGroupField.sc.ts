import { ButtonBase } from "@mui/material";
import { css, styled } from "@mui/material/styles";

export const Root = styled("div", { shouldForwardProp: (prop) => prop !== "$optionsPerRow" })<{ $optionsPerRow?: number }>`
    display: inline-flex;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    background-color: ${({ theme }) => theme.palette.divider};
    border-radius: 2px;
    overflow: hidden;
    gap: 1px;

    ${({ $optionsPerRow }) =>
        $optionsPerRow &&
        css`
            display: inline-grid;
            grid-template-columns: repeat(${$optionsPerRow}, 1fr);
        `}
`;

export const Button = styled(ButtonBase, { shouldForwardProp: (prop) => prop !== "$selected" })<{ $selected?: boolean }>`
    padding: ${({ theme }) => theme.spacing(3)};
    background-color: ${({ theme }) => theme.palette.background.paper};

    :hover {
        background-color: ${({ theme }) => theme.palette.grey[50]};
    }

    ${({ $selected, theme }) =>
        $selected &&
        css`
            color: ${theme.palette.primary.main};

            :before {
                content: "";
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                height: 2px;
                background-color: ${theme.palette.primary.main};
            }
        `}
`;
