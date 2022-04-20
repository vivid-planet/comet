import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { HiddenInSubroute } from "./HiddenInSubroute";

interface Props {
    children: React.ReactNode;
    title?: React.ReactNode;
}

export function AdminComponentSectionGroup({ children, title }: Props): React.ReactElement {
    return (
        <Root>
            {title && (
                <HiddenInSubroute>
                    <Typography variant="h4" gutterBottom>
                        {title}
                    </Typography>
                </HiddenInSubroute>
            )}
            {children}
        </Root>
    );
}

const Root = styled("div")`
    &:not(:last-child) {
        margin-bottom: ${({ theme }) => theme.spacing(4)};
    }
`;
