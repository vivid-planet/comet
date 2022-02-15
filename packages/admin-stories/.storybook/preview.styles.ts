import { css } from "@mui/material";

export const previewGlobalStyles = css(`
    body {
        margin: 0;
        background-color: ${({ theme }) => theme.palette.background.default};

        &.sb-show-main.sb-main-padded {
            padding: 0;
        }
    }

    .sbdocs {
        &.sbdocs-preview {
            background-color: ${({ theme }) => theme.palette.background.default};
        }

        &.sbdocs-h2 {
            margin-top: 25px;
        }

        &.sbdocs-h3 {
            margin-top: 25px;
        }
    }
`);
