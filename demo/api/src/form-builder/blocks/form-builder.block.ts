// TODO: Implement this block properly

import { createBlocksBlock } from "@comet/blocks-api";
import { SpaceBlock } from "@src/common/blocks/space.block";

import { CheckboxInputBlock } from "./checkbox-input.block";
import { CheckboxInputListBlock } from "./checkbox-input-list.block";
import { RadioInputListBlock } from "./radio-input-list.block";
import { TextInputBlock } from "./text-input.block";

export type FormInputFields = keyof typeof formBlocks;

// TODO: Implement real blocks
const formBlocks = {
    textInput: TextInputBlock,
    checkboxInput: CheckboxInputBlock,
    radioInputList: RadioInputListBlock,
    checkboxInputList: CheckboxInputListBlock,
    // TODO: radioList
    // TODO: select
    // TODO: checkboxList
    // TODO: checkbox (with RTE as label to allow "Datenschutz" link??)
};

// TODO: Implement real blocks
const contentBlocks = {
    space: SpaceBlock,
    // richtext
};

export const FormBuilderBlock = createBlocksBlock(
    {
        supportedBlocks: {
            ...formBlocks,
            ...contentBlocks,
        },
    },
    "FormBuilder",
);
