import { TableRow, TableRowProps } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import * as React from "react";

interface Props extends TableRowProps {
    isDragHovered: boolean;
    isMouseHovered: boolean;
    isArchived: boolean;
    isSelected?: boolean;
    clickable?: boolean;
    disabled?: boolean;
    rowRef?: React.RefObject<HTMLTableRowElement>;
}

export const PageTreeTableRow: React.FC<Props> = ({ children, clickable, disabled, isSelected, isMouseHovered, rowRef, ...restProps }) => {
    return (
        <Root ref={rowRef} isSelected={isSelected} clickable={clickable} disabled={disabled} isMouseHovered={isMouseHovered} as="div" {...restProps}>
            {children}
            <BorderHightlights horizontal={Boolean(isSelected)} vertical={Boolean(isSelected || (isMouseHovered && clickable && !disabled))} />
        </Root>
    );
};

const Root = styled(TableRow)<Props>`
    scroll-margin-top: 160px;
    scroll-snap-margin-top: 160px; // Safari
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

    ${({ clickable }) =>
        clickable &&
        css`
            cursor: pointer;
        `};

    ${({ disabled }) =>
        disabled &&
        css`
            cursor: not-allowed;
        `};

    ${({ isArchived, isDragHovered, isMouseHovered, disabled, theme }) =>
        !disabled &&
        (isArchived || isDragHovered || isMouseHovered) &&
        css`
            background-color: ${theme.palette.grey[50]};
        `}

    ${({ isSelected, theme }) =>
        isSelected &&
        css`
            &:after {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background-color: ${theme.palette.primary.light};
                opacity: 0.1;
            }
        `};
`;

interface SideBorderHightlightsProps {
    vertical: boolean;
    horizontal: boolean;
}

const BorderHightlights = styled("div")<SideBorderHightlightsProps>`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;

    ${({ vertical, theme }) =>
        vertical &&
        css`
            border-left: 2px solid ${theme.palette.primary.main};
            border-right: 2px solid ${theme.palette.primary.main};
        `}

    ${({ horizontal, theme }) =>
        horizontal &&
        css`
            top: -1px;
            bottom: -1px;
            border-top: 2px solid ${theme.palette.primary.main};
            border-bottom: 2px solid ${theme.palette.primary.main};
        `}
`;
