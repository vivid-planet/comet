import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

import { CallToActionListBlock } from "../../../common/blocks/CallToActionListBlock";
import { HeadingBlock } from "../../../common/blocks/HeadingBlock";
import { MediaBlock } from "../../../common/blocks/MediaBlock";
import { RichTextBlock } from "../../../common/blocks/RichTextBlock";

const overlayOptions: Array<{ value: number; label: string }> = [
    { value: 90, label: "90%" },
    { value: 80, label: "80%" },
    { value: 70, label: "70%" },
    { value: 60, label: "60%" },
    { value: 50, label: "50%" },
    { value: 40, label: "40%" },
    { value: 30, label: "30%" },
    { value: 20, label: "20%" },
    { value: 10, label: "10%" },
    { value: 0, label: "0%" },
];

export const BillboardTeaserBlock = createCompositeBlock(
    {
        name: "BillboardTeaser",
        displayName: <FormattedMessage id="billboardTeaserBlock.displayName" defaultMessage="Billboard Teaser" />,
        blocks: {
            media: {
                block: MediaBlock,
                title: <FormattedMessage id="billboardTeaserBlock.media" defaultMessage="Media" />,
                hiddenInSubroute: true,
            },
            heading: {
                block: HeadingBlock,
            },
            text: {
                block: RichTextBlock,
                title: <FormattedMessage id="billboardTeaserBlock.text" defaultMessage="Text" />,
                hiddenInSubroute: true,
            },
            overlay: {
                block: createCompositeBlockSelectField({
                    defaultValue: 50,
                    options: overlayOptions,
                    required: true,
                }),
                title: <FormattedMessage id="billboardTeaserBlock.overlay" defaultMessage="Overlay" />,
                hiddenInSubroute: true,
            },
            callToActionList: {
                block: CallToActionListBlock,
                title: <FormattedMessage id="billboardTeaserBlock.callToActionList" defaultMessage="Call To Action List" />,
            },
        },
    },
    (block) => {
        block.category = BlockCategory.Teaser;
        return block;
    },
);
