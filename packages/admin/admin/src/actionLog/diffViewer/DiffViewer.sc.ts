import { Box, css, type Theme } from "@mui/material";
import type { ReactDiffViewerStylesOverride } from "react-diff-viewer-continued/lib/cjs/src/styles";

import { createComponentSlot } from "../../helpers/createComponentSlot";

export type DiffViewerClassKey = "root" | "codeFoldMessageContainer";

export const Root = createComponentSlot(Box)<DiffViewerClassKey>({
    componentName: "DiffViewer",
    slotName: "root",
})(
    (props: { theme: Theme }) => css`
        div[role="banner"] {
            display: none;
        }

        table {
            tr:first-of-type {
                td {
                    padding: 0;
                }
            }

            td:nth-of-type(2) {
                border-right: 1px solid ${props.theme.palette.grey["200"]};
            }

            th:first-of-type {
                border-right: 1px solid ${props.theme.palette.grey["200"]};
            }
        }
    `,
);

export const CodeFoldMessageContainer = createComponentSlot(Box)<DiffViewerClassKey>({
    componentName: "DiffViewer",
    slotName: "codeFoldMessageContainer",
})(
    ({ theme }) => css`
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
    `,
);

export const createStyles = (theme: Theme): ReactDiffViewerStylesOverride => {
    return {
        codeFoldExpandButton: {
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "underline",
            color: theme.palette.grey["900"],
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        diffAdded: {
            "& pre": {
                backgroundColor: `${theme.palette.success.main}80`, // 50% opacity
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
                fontFamily: theme.typography.fontFamily,
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
                addedBackground: `${theme.palette.success.main}1A`, // 10% opacity
                codeFoldBackground: theme.palette.grey["50"],
                diffViewerTitleBackground: theme.palette.grey.A200,
                removedBackground: `${theme.palette.error.main}1A`, // 10% opacity
                wordAddedBackground: `${theme.palette.success.main}33`, // 20% opacity
                wordRemovedBackground: `${theme.palette.error.main}33`, // 20% opacity
            },
        },
        wordDiff: {
            fontWeight: 600,
            color: theme.palette.grey["900"],
        },
        wordRemoved: {
            textDecoration: "line-through",
        },
    };
};
