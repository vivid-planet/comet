import { createBlocksBlock } from "@comet/blocks-admin";

import { TextAreaBlock } from "./fields/TextAreaBlock";
import { TextInputBlock } from "./fields/TextInputBlock";

export const FormBuilderBlock = createBlocksBlock({
    name: "FormBuilder",
    supportedBlocks: {
        textInput: TextInputBlock,
        textArea: TextAreaBlock,
    },
});
