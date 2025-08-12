import { Box, type Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { ReactDiffViewerStylesOverride } from "react-diff-viewer-continued/lib/cjs/src/styles";

export const Root = styled(Box)`
    div[role="banner"] {
        display: none;
    }
    table {
        tr:first-of-type {
            td {
                padding: 0px;
            }
        }

        td:nth-of-type(2) {
            border-right: 1px solid ${({ theme }) => theme.palette.grey["200"]};
        }

        th:first-of-type {
            border-right: 1px solid ${({ theme }) => theme.palette.grey["200"]};
        }
    }
`;

export const createStyles = (theme: Theme): ReactDiffViewerStylesOverride => {
    return {
        codeFoldExpandButton: {
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "underline",
        },
        diffAdded: {
            "& pre": {
                backgroundColor: "#bdf1d7",
                borderRadius: "4px",
                color: "white",
                fontSize: "12px",
                lineHeight: "8px",
                minWidth: "14px",
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
            },
        },
        diffContainer: {
            "& *": {
                fontFamily: "Roboto Flex Variable,Helvetica,Arial,sans-serif",
            },
            "& td": {
                paddingBottom: "10px",
                paddingTop: "10px",
            },
            minWidth: "unset",
        },
        diffRemoved: {
            "& pre": {
                backgroundColor: "#f8b7b7",
                borderRadius: "4px",
                color: "white",
                fontSize: "12px",
                lineHeight: "8px",
                minWidth: "14px",
                paddingBottom: "3px",
                paddingTop: "3px",
                textAlign: "center",
            },
            textDecoration: "line-through",
        },
        line: {
            borderBottom: "1px solid white",
            marginTop: "10px",
            paddingBottom: "10px",
        },
        marker: {
            color: "white",
        },
        variables: {
            light: {
                addedBackground: "#e7faf1",
                addedGutterBackground: "#e7faf1",
                codeFoldBackground: theme.palette.grey["50"],
                codeFoldContentColor: "black",
                diffViewerTitleBackground: theme.palette.grey.A200,
                emptyLineBackground: "white",
                removedBackground: "#fce5e5",
                removedGutterBackground: "#fce5e5",
                wordAddedBackground: "#bdf1d7",
                wordRemovedBackground: "#f8b7b7",
            },
        },
        wordDiff: {
            fontWeight: 600,
        },
        wordRemoved: {
            textDecoration: "line-through",
        },
    };
};
