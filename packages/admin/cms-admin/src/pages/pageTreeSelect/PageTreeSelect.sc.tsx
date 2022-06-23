import { css, TableCell, TableRow, TableRowTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { styled } from "@mui/material/styles";
import * as React from "react";

// copied from ../pageTree/PageTreeRow.sc.tsx

export const PageTreeBodyRow = styled(TableRow)<OverridableComponent<TableRowTypeMap> & { component?: React.ElementType; $isHovered?: boolean }>`
    scroll-margin-top: 160px;
    scroll-snap-margin-top: 160px; // Safari
    box-sizing: border-box;

    ${({ $isHovered, theme }) =>
        $isHovered &&
        css`
            background-color: ${theme.palette.grey[50]};
        `}

    display: grid;
    align-items: center;
    grid-template-columns: 2fr 1fr 1fr;
    position: relative;
`;

export const PageTreeCell = styled(TableCell)`
    border: none;
    height: 100%;
    display: flex;

    &:last-of-type {
        justify-content: flex-end;
    }
`;
