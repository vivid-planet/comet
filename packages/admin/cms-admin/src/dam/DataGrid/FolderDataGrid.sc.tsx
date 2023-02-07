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

    & .MuiDataGrid-root {
        background-color: ${({ isHovered }) => (isHovered ? "rgba(41, 182, 246, 0.1)" : "#fff")};
    }
`;
