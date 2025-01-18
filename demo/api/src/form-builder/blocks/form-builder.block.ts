import { createBlocksBlock } from "@comet/blocks-api";

import { CheckboxListBlock } from "./checkbox-list.block";
import { RadioBlock } from "./radio.block";
import { SelectBlock } from "./select.block";
import { TextAreaBlock } from "./text-area.block";
import { TextInputBlock } from "./text-input.block";

export const FormBuilderBlock = createBlocksBlock(
    {
        supportedBlocks: {
            textInput: TextInputBlock,
            textArea: TextAreaBlock,
            select: SelectBlock,
            checkboxList: CheckboxListBlock,
            radio: RadioBlock,
        },
    },
    "FormBuilder",
);
