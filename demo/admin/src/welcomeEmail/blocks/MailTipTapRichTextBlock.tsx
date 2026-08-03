import { createTipTapRichTextBlock } from "@comet/cms-admin";
import type { HTMLAttributes } from "react";
import { FormattedMessage } from "react-intl";

import { MailLinkBlock } from "./MailLinkBlock";

const baseBlock = createTipTapRichTextBlock({
    link: MailLinkBlock,
    supports: ["bold", "italic", "sub", "sup", "strike", "link", "non-breaking-space", "soft-hyphen"],
    defaultTextBlockStyleLabel: <FormattedMessage id="welcomeEmail.richText.blockType.copy" defaultMessage="Copy" />,
    textBlockStyles: [
        {
            name: "title",
            label: <FormattedMessage id="welcomeEmail.richText.blockType.title" defaultMessage="Title" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 32, fontWeight: 700 }} {...props} />,
        },
        {
            name: "header",
            label: <FormattedMessage id="welcomeEmail.richText.blockType.header" defaultMessage="Header" />,
            appliesTo: ["paragraph"],
            element: (props: HTMLAttributes<HTMLElement>) => <p style={{ fontSize: 22, fontWeight: 700 }} {...props} />,
        },
    ],
});

export const MailTipTapRichTextBlock = {
    ...baseBlock,
    displayName: <FormattedMessage id="welcomeEmail.tipTapRichText.displayName" defaultMessage="Rich Text (TipTap)" />,
};
