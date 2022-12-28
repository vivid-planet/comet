import { styled } from "@mui/material/styles";

interface TableHoverHighlightProps {
    isHovered?: boolean;
}

export const FolderOuterHoverHighlight = styled("div", { shouldForwardProp: (prop) => prop !== "isHovered" })<TableHoverHighlightProps>`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;

    position: relative;

    outline: ${({ theme, isHovered }) => (isHovered ? `solid 1px ${theme.palette.primary.main}` : "none")};

    & .CometFolderDataGridInnerWrapper-root {
        display: ${({ isHovered }) => (isHovered ? "block" : "none")};
    }
`;

export const FolderInnerHoverHighlight = styled("div")`
    display: none;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;

    width: 100%;
    height: 100%;

    background-color: rgba(41, 182, 246, 0.1);
`;
