import { BlockCategory, BlockInterface, createBlockSkeleton } from "@comet/blocks-admin";

import { RichTextBlock } from "../blocks/common/RichTextBlock";

type RequiredSettings = "name" | "displayName" | "defaultValues" | "AdminComponent";

type Settings = Pick<BlockInterface, RequiredSettings> & Partial<Omit<BlockInterface, RequiredSettings>>;

export const createFieldBlock = (settings: Settings): BlockInterface => {
    return {
        ...createBlockSkeleton(),
        category: BlockCategory.Form,
        previewContent: (state) => [{ type: "text", content: `${state.label}${state.fieldName ? ` (${state.fieldName})` : ""}` }],
        ...settings,
        isValid: (state) => {
            const passedInIsValid = settings.isValid ? settings.isValid(state) : true;
            const fieldNameIsValid = Boolean(state.fieldName);
            return passedInIsValid && fieldNameIsValid;
        },
        input2State: (input) => {
            const newState = {
                ...input,
                helperText: input.helperText ? RichTextBlock.input2State(input.helperText) : RichTextBlock.defaultValues(),
            };
            return settings.input2State ? settings.input2State(newState) : newState;
        },
        state2Output: (state) => {
            const newState = {
                ...state,
                helperText: RichTextBlock.state2Output(state.helperText),
            };
            return settings.state2Output ? settings.state2Output(newState) : newState;
        },
        output2State: async (output, context) => {
            const newState = {
                ...output,
                helperText: await RichTextBlock.output2State(output.helperText, context),
            };
            return settings.output2State ? settings.output2State(newState, context) : newState;
        },
        createPreviewState: (state, previewCtx) => {
            const newState = {
                ...state,
                helperText: RichTextBlock.createPreviewState(state.helperText, previewCtx),
            };
            return settings.createPreviewState ? settings.createPreviewState(newState, previewCtx) : newState;
        },
    };
};
