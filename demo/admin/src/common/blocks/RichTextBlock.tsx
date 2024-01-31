import { createRichTextBlock } from "@comet/cms-admin";
import { Highlight } from "@mui/icons-material";

import { LinkBlock } from "./LinkBlock";

export const RichTextBlock = createRichTextBlock({
    link: LinkBlock,
    rte: {
        customInlineStyles: {
            HIGHLIGHT: {
                label: "Highlight!",
                icon: Highlight,
                style: {
                    backgroundColor: "yellow",
                },
            },
        },
    },
});
