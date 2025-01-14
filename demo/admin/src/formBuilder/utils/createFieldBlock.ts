import { BlockCategory, BlockInterface, createBlockSkeleton } from "@comet/blocks-admin";
import { FieldInfoTextBlock } from "@src/formBuilder/blocks/common/FieldInfoTextBlock";

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
                infoText: input.infoText ? FieldInfoTextBlock.input2State(input.infoText) : FieldInfoTextBlock.defaultValues(),
            };
            return settings.input2State ? settings.input2State(newState) : newState;
        },
        state2Output: (state) => {
            const newState = {
                ...state,
                infoText: FieldInfoTextBlock.state2Output(state.infoText),
            };
            return settings.state2Output ? settings.state2Output(newState) : newState;
        },
        output2State: async (output, context) => {
            const newState = {
                ...output,
                infoText: await FieldInfoTextBlock.output2State(output.infoText, context),
            };
            return settings.output2State ? settings.output2State(newState, context) : newState;
        },
        createPreviewState: (state, previewCtx) => {
            const newState = {
                ...state,
                infoText: FieldInfoTextBlock.createPreviewState(state.infoText, previewCtx),
            };
            return settings.createPreviewState ? settings.createPreviewState(newState, previewCtx) : newState;
        },
    };
};
