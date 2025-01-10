import { createBlocksBlock } from "@comet/blocks-api";

import { SelectBlock } from "./select.block";
import { TextAreaBlock } from "./text-area.block";
import { TextInputBlock } from "./text-input.block";

export const FormBuilderBlock = createBlocksBlock(
    {
        supportedBlocks: {
            textInput: TextInputBlock,
            textArea: TextAreaBlock,
            select: SelectBlock,
        },
    },
    "FormBuilder",
);
