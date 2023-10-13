import { readClipboardText, writeClipboardText } from "@comet/admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { BlockInterface, BlockOutputApi, BlockState } from "../blocks/types";
import { useBlockContext } from "../context/useBlockContext";

interface ClipboardBlock {
    name: string;
    visible: boolean;
    state: BlockState<BlockInterface>;
    additionalFields?: Record<string, unknown>;
}

type ClipboardContent = ClipboardBlock[];

interface TransformedClipboardBlock {
    name: string;
    visible: boolean;
    output: BlockOutputApi<BlockInterface>;
    additionalFields?: Record<string, unknown>;
}

type TransformedClipboardContent = TransformedClipboardBlock[];

type GetClipboardContentResponse = { canPaste: true; content: ClipboardContent } | { canPaste: false; error: React.ReactNode };

interface BlockClipboardApi {
    updateClipboardContent: (content: ClipboardContent) => Promise<void>;
    getClipboardContent: () => Promise<GetClipboardContentResponse>;
}

interface UseBlockClipboardOptions {
    supports: BlockInterface | BlockInterface[];
}

function useBlockClipboard({ supports }: UseBlockClipboardOptions): BlockClipboardApi {
    const context = useBlockContext();

    const findBlockInterfaceForClipboardBlock = (content: ClipboardBlock | TransformedClipboardBlock) => {
        if (Array.isArray(supports)) {
            return supports.find((block) => block.name === content.name);
        }

        if (supports.name !== content.name) {
            return undefined;
        }

        return supports;
    };

    const updateClipboardContent = async (content: ClipboardContent) => {
        const blocks = content.map<TransformedClipboardBlock>((block) => {
            const blockInterface = findBlockInterfaceForClipboardBlock(block);

            if (!blockInterface) {
                throw new Error(`Block clipboard doesn't support block "${block.name}"`);
            }

            return {
                name: block.name,
                visible: block.visible,
                output: blockInterface.state2Output(block.state),
                additionalFields: block.additionalFields,
            };
        });

        return writeClipboardText(JSON.stringify(blocks));
    };

    const getClipboardContent = async (): Promise<GetClipboardContentResponse> => {
        const text = await readClipboardText();

        if (text === undefined) {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.blocks.cannotPasteBlock.messageFailedToReadClipboard"
                        defaultMessage="Can't read clipboard content. Please make sure that clipboard access is given"
                    />
                ),
            };
        }

        if (text.trim() === "") {
            return {
                canPaste: false,
                error: <FormattedMessage id="comet.blocks.cannotPasteBlock.messageEmptyClipboard" defaultMessage="Clipboard is empty" />,
            };
        }

        let transformedContent: TransformedClipboardContent;

        try {
            transformedContent = JSON.parse(text) as TransformedClipboardContent;
        } catch {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.blocks.cannotPasteBlock.messageFailedToParseClipboard"
                        defaultMessage="Content from clipboard aren't valid blocks"
                    />
                ),
            };
        }

        const blocks: ClipboardBlock[] = [];

        for (const clipboardBlock of transformedContent) {
            const blockInterface = findBlockInterfaceForClipboardBlock(clipboardBlock);

            if (!blockInterface) {
                return {
                    canPaste: false,
                    error: (
                        <FormattedMessage
                            id="comet.blocks.cannotPasteBlock.messageUnsupportedBlock"
                            defaultMessage="Blocks from clipboard aren't allowed here"
                        />
                    ),
                };
            }

            let state: BlockState<BlockInterface>;

            try {
                state = await blockInterface.output2State(clipboardBlock.output, context);
            } catch {
                return {
                    canPaste: false,
                    error: (
                        <FormattedMessage
                            id="comet.blocks.cannotPasteBlock.messageFailedToCreateBlock"
                            defaultMessage="Failed to create a copy of the blocks from clipboard"
                        />
                    ),
                };
            }

            blocks.push({ name: clipboardBlock.name, visible: clipboardBlock.visible, state, additionalFields: clipboardBlock.additionalFields });
        }

        return { canPaste: true, content: blocks };
    };

    return { updateClipboardContent, getClipboardContent };
}

export { ClipboardContent, useBlockClipboard };
