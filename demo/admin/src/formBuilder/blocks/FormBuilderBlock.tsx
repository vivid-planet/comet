import { createBlocksBlock } from "@comet/blocks-admin";

import { CheckboxListBlock } from "./fields/CheckboxListBlock";
import { SelectBlock } from "./fields/SelectBlock";
import { TextAreaBlock } from "./fields/TextAreaBlock";
import { TextInputBlock } from "./fields/TextInputBlock";

export const FormBuilderBlock = createBlocksBlock({
    name: "FormBuilder",
    supportedBlocks: {
        textInput: TextInputBlock,
        textArea: TextAreaBlock,
        select: SelectBlock,
        checkboxList: CheckboxListBlock,
    },
});
