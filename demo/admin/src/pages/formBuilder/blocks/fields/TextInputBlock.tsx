// TODO: Implement this block properly

import {
    BlockCategory,
    BlockInterface,
    createCompositeBlock,
    createCompositeBlockSelectField,
    createCompositeBlockTextField,
} from "@comet/blocks-admin";
import { TextInputBlockData } from "@src/blocks.generated";
import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { commonInputBlocks } from "./commonInputBlocks";

const typeOptions: Record<TextInputBlockData["type"], ReactNode> = {
    text: <FormattedMessage id="blocks.textInput.type.text" defaultMessage="Text" />,
    multilineText: <FormattedMessage id="blocks.textInput.type.multilineText" defaultMessage="Multiline Text" />,
    email: <FormattedMessage id="blocks.textInput.type.email" defaultMessage="Email" />,
    url: <FormattedMessage id="blocks.textInput.type.url" defaultMessage="URL" />,
};

export const TextInputBlock: BlockInterface = createCompositeBlock(
    {
        name: "TextInput",
        category: BlockCategory.Form,
        displayName: <FormattedMessage id="blocks.textInput" defaultMessage="Text Input" />,
        blocks: {
            ...commonInputBlocks,
            type: {
                block: createCompositeBlockSelectField<TextInputBlockData["type"]>({
                    fieldProps: { fullWidth: true, required: true, label: <FormattedMessage id="blocks.textInput.type" defaultMessage="Type" /> },
                    options: Object.entries(typeOptions).map(([value, label]: [TextInputBlockData["type"], ReactNode]) => ({ value, label })),
                    defaultValue: "text",
                }),
            },
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
