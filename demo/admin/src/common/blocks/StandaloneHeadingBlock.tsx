import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/cms-admin";
import { type StandaloneHeadingBlockData } from "@src/blocks.generated";
import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import { FormattedMessage } from "react-intl";

export const StandaloneHeadingBlock = createCompositeBlock(
    {
        name: "StandaloneHeading",
        displayName: <FormattedMessage id="standaloneHeading.displayName" defaultMessage="Heading" />,
        blocks: {
            heading: {
                block: HeadingBlock,
            },
            textAlignment: {
                block: createCompositeBlockSelectField<StandaloneHeadingBlockData["textAlignment"]>({
                    label: <FormattedMessage id="standaloneHeading.textAlignment" defaultMessage="Text alignment" />,
                    defaultValue: "left",
                    options: [
                        { value: "left", label: <FormattedMessage id="standaloneHeading.textAlignment.left" defaultMessage="left" /> },
                        { value: "center", label: <FormattedMessage id="standaloneHeading.textAlignment.center" defaultMessage="center" /> },
                    ],
                }),
            },
        },
    },
    (block) => {
        block.category = BlockCategory.TextAndContent;
        return block;
    },
);
