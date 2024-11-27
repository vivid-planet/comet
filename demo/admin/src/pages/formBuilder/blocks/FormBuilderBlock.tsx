// TODO: Implement this block properly

import { createBlocksBlock } from "@comet/blocks-admin";

import { CheckboxInputBlock } from "./fields/CheckboxInputBlock";
import { CheckboxInputListBlock } from "./fields/CheckboxInputListBlock";
import { RadioInputListBlock } from "./fields/RadioInputListBlock";
import { TextInputBlock } from "./fields/TextInputBlock";

// TODO: Implement real blocks
const formBlocks = {
    textInput: TextInputBlock,
    checkboxInput: CheckboxInputBlock,
    radioInputList: RadioInputListBlock,
    checkboxInputList: CheckboxInputListBlock,
};

// TODO: Implement real blocks
const contentBlocks = {
    // space: SpaceBlock,
    // richtext
};

export const FormBuilderBlock = createBlocksBlock({
    name: "FormBuilder",
    supportedBlocks: { ...formBlocks, ...contentBlocks },
});
