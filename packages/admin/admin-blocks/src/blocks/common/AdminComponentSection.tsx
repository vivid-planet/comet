import { css, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { HiddenInSubroute } from "./HiddenInSubroute";

interface Props {
    children: React.ReactNode;
    title?: React.ReactNode;
    variant?: "normal" | "dense";
    disableBottomMargin?: boolean;
}

export function AdminComponentSection({ children, title, disableBottomMargin }: Props): React.ReactElement {
    if (title) {
        return (
            <Root disableBottomMargin={disableBottomMargin}>
                <HiddenInSubroute>
                    <Title variant="h6">{title}</Title>
                </HiddenInSubroute>
                {children}
            </Root>
        );
    }

    return <Root disableBottomMargin={disableBottomMargin}>{children}</Root>;
}

const Root = styled("div")<Pick<Props, "variant" | "disableBottomMargin">>`
    ${({ disableBottomMargin, variant, theme }) =>
        !disableBottomMargin &&
        css`
            &:not(:last-child) {
                margin-bottom: ${theme.spacing(variant === "dense" ? 3 : 4)};
            }
        `}
`;

const Title = styled(Typography)`
    margin-bottom: ${({ theme }) => theme.spacing(2)};
`;
