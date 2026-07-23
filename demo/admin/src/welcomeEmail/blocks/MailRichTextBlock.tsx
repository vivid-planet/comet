import { createRichTextBlock } from "@comet/cms-admin";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { MailLinkBlock } from "./MailLinkBlock";

export const MailRichTextBlock = createRichTextBlock({
    link: MailLinkBlock,
    rte: {
        supports: ["bold", "italic", "sub", "sup", "strikethrough", "history", "link", "links-remove", "non-breaking-space", "soft-hyphen"],
        standardBlockType: "copy",
        blocktypeMap: {
            title: {
                label: <FormattedMessage id="welcomeEmail.richText.blockType.title" defaultMessage="Title" />,
                renderConfig: {
                    element: (props) => <Typography variant="h1" {...props} />,
                },
            },
            header: {
                label: <FormattedMessage id="welcomeEmail.richText.blockType.header" defaultMessage="Header" />,
                renderConfig: {
                    element: (props) => <Typography variant="h2" {...props} />,
                },
            },
            copy: { label: <FormattedMessage id="welcomeEmail.richText.blockType.copy" defaultMessage="Copy" /> },
        },
    },
});
