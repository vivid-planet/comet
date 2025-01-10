import { BlockCategory, BlockInterface, createCompositeBlock, createCompositeBlockTextField } from "@comet/blocks-admin";
import { FormattedMessage } from "react-intl";

import { commonInputBlocks } from "./commonInputBlocks";

export const TextInputBlock: BlockInterface = createCompositeBlock(
    {
        name: "TextInput",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.textInput" defaultMessage="Text Input" />,
        blocks: {
            ...commonInputBlocks,
            placeholder: {
                block: createCompositeBlockTextField({
                    fieldProps: { fullWidth: true, label: <FormattedMessage id="blocks.textInput.placeholder" defaultMessage="Placeholder" /> },
                }),
            },
        },
    },
    (block) => {
        block.previewContent = (state) => [{ type: "text", content: state.label }];
        return block;
    },
);
