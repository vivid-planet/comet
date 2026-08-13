import { createRichTextBlock, ExternalLinkBlock } from "@comet/cms-admin";

export const MailRichTextBlock = createRichTextBlock({
    link: ExternalLinkBlock,
    rte: {
        supports: ["bold", "italic", "header-one", "header-two", "header-three", "header-four", "header-five", "header-six", "link", "links-remove"],
    },
});
