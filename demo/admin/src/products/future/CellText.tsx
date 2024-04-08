// TODO: Move into `@comet/admin` and make themable, add slots, etc.
import { css, styled, Typography } from "@mui/material";
import React from "react";

type CellTextProps = {
    primary: React.ReactNode;
    secondary?: React.ReactNode;
};

type OwnerState = {
    hasSecondaryValue: boolean;
};

export const CellText = ({ primary, secondary }: CellTextProps) => {
    const ownerState: OwnerState = {
        hasSecondaryValue: Boolean(secondary),
    };

    return (
        <Root>
            <Primary ownerState={ownerState}>{primary}</Primary>
            {ownerState.hasSecondaryValue && <Secondary>{secondary}</Secondary>}
        </Root>
    );
};

const Root = styled("div")`
    overflow: hidden;
`;

const ellipsisStyles = css`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const Primary = styled(Typography)<{ ownerState: OwnerState }>`
    color: ${({ theme }) => theme.palette.grey[800]};
    font-size: 12px;
    font-weight: ${({ ownerState }) => (ownerState.hasSecondaryValue ? 400 : 300)};
    line-height: 16px;
    ${ellipsisStyles}

    ${({ theme }) => theme.breakpoints.up("md")} {
        font-size: 14px;
        line-height: 20px;
    }
`;

const Secondary = styled(Typography)`
    color: ${({ theme }) => theme.palette.grey[300]};
    font-size: 10px;
    font-weight: 400;
    line-height: 16px;
    ${ellipsisStyles}

    ${({ theme }) => theme.breakpoints.up("md")} {
        font-size: 12px;
    }
`;
