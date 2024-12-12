import { BlockCategory, createCompositeBlock, createCompositeBlockSelectField } from "@comet/blocks-admin";
import { StandaloneHeadingBlockData } from "@src/blocks.generated";
import { FormattedMessage } from "react-intl";

import { HeadingBlock } from "./HeadingBlock";

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
                    defaultValue: "left",
                    options: [
                        { value: "left", label: <FormattedMessage id="standaloneHeading.textAlignment.left" defaultMessage="left" /> },
                        { value: "center", label: <FormattedMessage id="standaloneHeading.textAlignment.center" defaultMessage="center" /> },
                    ],
                    fieldProps: { label: <FormattedMessage id="standaloneHeading.textAlignment" defaultMessage="Text alignment" />, fullWidth: true },
                }),
            },
        },
    },
    (block) => {
        block.category = BlockCategory.TextAndContent;
        return block;
    },
);
