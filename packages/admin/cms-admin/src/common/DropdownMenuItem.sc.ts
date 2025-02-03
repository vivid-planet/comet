import { ButtonBase, css, Paper, Popper as MuiPopper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const lightOverlayColor = "rgba(255, 255, 255, 0.2)";

export const Root = styled("div")`
    position: relative;
    border-left: thin solid ${lightOverlayColor};
    height: 100%;
`;

export const ButtonText: typeof Typography = styled(Typography)`
    && {
        color: ${({ theme }) => theme.palette.primary.contrastText};
    }
`;

export const ButtonIconWrapperWithSpacing = styled("span")`
    margin-right: 8px;
`;

export const ArrowWrapper = styled("div")`
    margin-left: 12px;
`;

interface ButtonProps {
    open: boolean;
}

/**
 * Property 'component' is missing in type '{ action?: Ref<ButtonBaseActions> | undefined; centerRipple?: boolean | undefined; children?: ReactNode; classes?: Partial<ButtonBaseClasses> | undefined; ... 10 more ...; touchRippleRef?: Ref<...> | undefined; } & ... 5 more ... & { ...; }'
 * but required in type '{ component: any; }'.ts(2769)
 */
export const Button = styled(ButtonBase)<ButtonProps>`
    display: flex;
    align-items: center;
    padding-right: ${({ theme }) => theme.spacing(4)};
    padding-left: ${({ theme }) => theme.spacing(4)};
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

export const ScrollablePaper: typeof Paper = styled(Paper)`
    max-height: 270px;
    overflow-y: auto;
`;
