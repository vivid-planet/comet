import { createTipTapRichTextBlock } from "@comet/cms-api";

import { MailLinkBlock } from "./mail-link.block";

export const MailTipTapRichTextBlock = createTipTapRichTextBlock(
    {
        link: MailLinkBlock,
        supports: ["bold", "italic", "sub", "sup", "strike", "link", "non-breaking-space", "soft-hyphen"],
        textBlockStyles: [
            { name: "title", appliesTo: ["paragraph"] },
            { name: "header", appliesTo: ["paragraph"] },
        ],
    },
    "MailTipTapRichText",
);
