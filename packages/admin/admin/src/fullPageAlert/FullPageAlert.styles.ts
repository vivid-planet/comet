import { Card, Icon, Typography } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";

import { InlineAlert } from "../inlineAlert/InlineAlert";
import { FullPageAlertBackground } from "./FullPageAlertBackground";

export const Root = styled("div")(css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
`);

export const BackgroundStyled = styled(FullPageAlertBackground)(css`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
`);

export const ContentContainer = styled(Card)(
    ({ theme }) => css`
        max-width: 550px;
        padding: ${theme.spacing(10)};

        & > .dextinityCard__body {
            display: flex;
            align-items: center;
            gap: ${theme.spacing(2)};
            flex-direction: column;
        }
    `,
);

export const LargeIcon = styled(Icon)(css`
    font-size: 48px;
`);

export const DetailDescription = styled(Typography)(css`
    text-align: center;
`);

export const DividerStyled = styled("hr")(
    ({ theme }) => css`
        width: 100%;
        margin: ${theme.spacing(6)} 0;
        border: none;
        border-top: 1px solid ${theme.palette.divider};
    `,
);

export const LogoContainer = styled("div")(
    ({ theme }) => css`
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: ${theme.spacing(6)};
        font-size: 30px;
    `,
);

export const ActionContainer = styled("div")(css`
    width: 100%;
    display: flex;
`);

export const InlineAlertStyled = InlineAlert;
