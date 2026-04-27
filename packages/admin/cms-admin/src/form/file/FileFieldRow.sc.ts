import { styled } from "@mui/material/styles";

interface RootStyleProps {
    isMouseHover: boolean;
}

export const Root = styled("div", { shouldForwardProp: (prop) => prop !== "isMouseHover" })<RootStyleProps>`
    position: relative;
    display: flex;
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
    will-change: transform;

    &:last-of-type {
        border-bottom: none;
    }

    ${({ theme, isMouseHover }) => isMouseHover && `background-color: ${theme.palette.grey[50]};`}
`;

export const Grabber = styled("div")`
    position: relative;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    flex-shrink: 0;
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
    cursor: move;
    color: ${({ theme }) => theme.palette.grey[600]};

    &:hover {
        background-color: ${({ theme }) => theme.palette.primary.light};
        color: white;
    }
`;

export const InnerRow = styled("div")`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding: 12px 16px;
    gap: 16px;
    min-width: 0;
`;

export const PreviewSlot = styled("div")`
    flex-shrink: 0;
`;

export const TextSlot = styled("div")`
    flex-grow: 1;
    min-width: 0;
`;

export const ActionsSlot = styled("div")`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-shrink: 0;
`;
