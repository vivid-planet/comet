import { alpha } from "@mui/material";
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
        background-color: ${({ theme, isHovered }) => (isHovered ? alpha(theme.palette.primary.main, 0.1) : "#fff")};
    }
    & .MuiDataGrid-row {
        transition: background-color 1s ease-in-out;
        &.CometDataGridRow--highlighted {
            background-color: ${({ theme }) => alpha(theme.palette.primary.dark, 0.4)};
        }
    }
    & .MuiDataGrid-row.CometDataGridRow--inboxFolder {
        background-color: ${({ isHovered }) => (isHovered ? alpha("#952F80", 0.1) : alpha("#952F80", 0.05))};
        &:hover {
            background-color: ${alpha("#952F80", 0.1)};
        }
    }
`;
