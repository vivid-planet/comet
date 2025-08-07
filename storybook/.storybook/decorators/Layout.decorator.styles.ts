import { css, type Theme } from "@mui/material";

export const previewGlobalStyles = (theme: Theme) =>
    css(`
    body {
        margin: 0;
        background-color: ${theme.palette.background.default};

        &.sb-show-main.sb-main-padded {
            padding: 0;
        }
    }

    .sbdocs {
        &.sbdocs-preview {
            background-color: ${theme.palette.background.default};
        }

        &.sbdocs-h2 {
            margin-top: 25px;
        }

        &.sbdocs-h3 {
            margin-top: 25px;
        }

        &.isEmbeddedInDocs {
            // The side padding is used to prevent cutting of the shadow of the individual stories
            padding: 0 5px;
        }
    }
`);
