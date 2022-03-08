import { TableCell, TableRow, TableRowTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import * as React from "react";
import styled, { css } from "styled-components";

// copied from ../pageTree/PageTreeRow.sc.tsx

export const PageTreeBodyRow = styled(TableRow)<OverridableComponent<TableRowTypeMap> & { component?: React.ElementType; $isHovered?: boolean }>`
    scroll-margin-top: 160px;
    scroll-snap-margin-top: 160px; // Safari
    box-sizing: border-box;

    ${({ $isHovered }) =>
        $isHovered &&
        css`
            background-color: ${({ theme }) => theme.palette.grey[50]};
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
