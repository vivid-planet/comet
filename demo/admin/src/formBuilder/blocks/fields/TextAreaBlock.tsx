import { BlockCategory, BlockInterface, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { commonInputBlocks } from "./commonInputBlocks";

export const TextAreaBlock: BlockInterface = createCompositeBlock(
    {
        name: "TextArea",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.textArea" defaultMessage="Text Area" />,
        blocks: {
            ...commonInputBlocks,
            placeholder: {
                block: createCompositeBlockTextField({
                    fieldProps: { fullWidth: true, label: <FormattedMessage id="blocks.textArea.placeholder" defaultMessage="Placeholder" /> },
                }),
            },
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label }];
        return block;
    },
);
