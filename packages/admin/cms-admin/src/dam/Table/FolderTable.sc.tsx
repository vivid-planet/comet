import { styled } from "@mui/material/styles";

import { folderTableRowHeight } from "./FolderTableRow";

export const TableWrapper = styled("div")`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 80vh;
    margin-bottom: 70px;

    & .CometAdminTableQuery-root {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
`;

interface TableHoverHighlightProps {
    $isHovered?: boolean;
}

export const TableHoverHighlight = styled("div", { shouldForwardProp: (prop) => prop !== "$isHovered" })<TableHoverHighlightProps>`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    // hover styling
    outline: ${({ theme, $isHovered }) => ($isHovered ? `solid 1px ${theme.palette.primary.main}` : "none")};
    background: ${({ $isHovered }) => ($isHovered ? "rgba(41,182,246,0.1)" : "#fff")};

    & .CometFilesTableWrapper-root {
        background: ${({ $isHovered }) => ($isHovered ? "transparent" : "#fff")};
    }
`;

export const FilesTableWrapper = styled("div")`
    min-height: ${folderTableRowHeight}px;
    flex-grow: 1;
    background-color: white;
`;
