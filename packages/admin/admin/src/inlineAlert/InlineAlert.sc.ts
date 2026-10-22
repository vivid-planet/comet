import { Typography } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";

import type { InlineAlertSeverity } from "./InlineAlert";

export const Root = styled("div")(css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0;
`);

export const IconContainer = styled("div")<{ ownerState: { severity: InlineAlertSeverity } }>(({ theme, ownerState }) => {
    const colors: Record<InlineAlertSeverity, string> = {
        error: theme.palette.error.main,
        warning: theme.palette.warning.main,
        info: theme.palette.info.main,
    };

    return css`
        display: flex;
        margin-bottom: ${theme.spacing(2)};
        color: ${colors[ownerState.severity]};
        font-size: 32px;
    `;
});

export const Title = styled(Typography)(
    ({ theme }) => css`
        text-align: center;
        margin-bottom: ${theme.spacing(1)};
    `,
);

export const Description = styled(Typography)(css`
    text-align: center;
`);

export const ActionsContainer = styled("div")(
    ({ theme }) => css`
        margin-top: ${theme.spacing(4)};
    `,
);
