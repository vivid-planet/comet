import { ButtonBase, Paper, Popper as MuiPopper, Typography } from "@material-ui/core";
import styled, { css } from "styled-components";

const lightOverlayColor = "rgba(255, 255, 255, 0.2)";

export const Root = styled.div`
    position: relative;
    border-left: thin solid ${lightOverlayColor};
    height: 100%;
`;

export const ButtonText = styled(Typography)`
    && {
        color: ${({ theme }) => theme.palette.primary.contrastText};
    }
`;

export const ButtonIconWrapperWithSpacing = styled.span`
    margin-right: 8px;
`;

export const ArrowWrapper = styled.div`
    margin-left: 12px;
`;

interface ButtonProps {
    open: boolean;
}

export const Button = styled(ButtonBase)<ButtonProps>`
    display: flex;
    align-items: center;
    padding-right: ${({ theme }) => theme.spacing(4)}px;
    padding-left: ${({ theme }) => theme.spacing(4)}px;
    height: 100%;
    min-width: 64px;

    ${({ open }) =>
        open &&
        css`
            background-color: ${lightOverlayColor};
        `}

    &:disabled {
        ${ButtonText}, ${ButtonIconWrapperWithSpacing}, ${ArrowWrapper} {
            opacity: 0.5;
        }
    }
`;

export const Popper = styled(MuiPopper)`
    min-width: 100%;
`;

export const ScrollablePaper = styled(Paper)`
    max-height: 270px;
    overflow-y: auto;
`;
