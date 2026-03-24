import { createRichTextBlock } from "@comet/cms-admin";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { LinkBlock } from "./LinkBlock";
import { PlaceholderBlock } from "./PlaceholderBlock";
import { PlaceholderDecorator } from "./rte/PlaceholderDecorator";
import { PlaceholderToolbarButton } from "./rte/PlaceholderToolbarButton";

export const RichTextBlock = createRichTextBlock({
    link: LinkBlock,
    entities: {
        PLACEHOLDER: {
            block: PlaceholderBlock,
            decorator: PlaceholderDecorator,
            toolbarButton: PlaceholderToolbarButton,
        },
    },
    rte: {
        standardBlockType: "paragraph-standard",
        blocktypeMap: {
            "paragraph-standard": {
                label: <FormattedMessage id="richTextBlock.paragraphStandard" defaultMessage="Paragraph Standard" />,
            },
            "paragraph-small": {
                label: <FormattedMessage id="richTextBlock.paragraphSmall" defaultMessage="Paragraph Small" />,
                renderConfig: {
                    element: (props) => <Typography paragraph variant="body2" {...props} />,
                },
            },
        },
    },
});
