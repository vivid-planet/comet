import { readClipboardText, writeClipboardText } from "@comet/admin";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import type { ContentScope } from "../../contentScope/Provider";
import { resolveScopeCopyReplacements } from "../../dependencies/scopeCopy/resolveScopeCopyReplacements";
import { useScopeCopyHandlers } from "../../dependencies/scopeCopy/useScopeCopyHandlers";
import { useBlockContext } from "../context/useBlockContext";
import type { BlockDependency, BlockInterface, BlockOutputApi, BlockState, ReplaceDependencyObject } from "../types";

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
    dependencies?: BlockDependency[];
    additionalFields?: Record<string, unknown>;
}

type TransformedClipboardContent = TransformedClipboardBlock[];

/**
 * Wrapper written to the clipboard. The source scope is needed to detect a scope-crossing paste and
 * copy referenced entities (e.g. DAM files) to the target scope.
 */
interface ClipboardEnvelope {
    scope?: ContentScope;
    blocks: TransformedClipboardContent;
}

type GetClipboardContentResponse = { canPaste: true; content: ClipboardContent } | { canPaste: false; error: ReactNode };

interface BlockClipboardApi {
    updateClipboardContent: (content: ClipboardContent) => Promise<void>;
    getClipboardContent: () => Promise<GetClipboardContentResponse>;
}

interface UseBlockClipboardOptions {
    supports: BlockInterface | BlockInterface[];
}

function useBlockClipboard({ supports }: UseBlockClipboardOptions): BlockClipboardApi {
    const context = useBlockContext();
    const handlers = useScopeCopyHandlers();

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
                dependencies: blockInterface.dependencies?.(block.state),
                additionalFields: block.additionalFields,
            };
        });

        const envelope: ClipboardEnvelope = { scope: context.pageTreeScope, blocks };
        return writeClipboardText(JSON.stringify(envelope));
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

        let envelope: ClipboardEnvelope;

        try {
            const parsed = JSON.parse(text);
            // Older clipboards stored a bare array of blocks without scope information.
            if (Array.isArray(parsed)) {
                envelope = { blocks: parsed as TransformedClipboardContent };
            } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as ClipboardEnvelope).blocks)) {
                envelope = parsed as ClipboardEnvelope;
            } else {
                throw new Error("Invalid clipboard content");
            }
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

        const transformedContent = envelope.blocks;

        for (const clipboardBlock of transformedContent) {
            if (!findBlockInterfaceForClipboardBlock(clipboardBlock)) {
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
        }

        let dependencyReplacements: ReplaceDependencyObject[] = [];

        if (envelope.scope) {
            try {
                dependencyReplacements = await resolveScopeCopyReplacements({
                    dependencies: transformedContent.flatMap((block) => block.dependencies ?? []),
                    handlers,
                    context: { client: context.apolloClient, sourceScope: envelope.scope, targetScope: context.pageTreeScope },
                });
            } catch {
                return {
                    canPaste: false,
                    error: (
                        <FormattedMessage
                            id="comet.blocks.cannotPasteBlock.messageFailedToCopyDependencies"
                            defaultMessage="Failed to copy referenced files to the current scope"
                        />
                    ),
                };
            }
        }

        const blocks: ClipboardBlock[] = [];

        for (const clipboardBlock of transformedContent) {
            // already validated above
            const blockInterface = findBlockInterfaceForClipboardBlock(clipboardBlock) as BlockInterface;

            const output =
                dependencyReplacements.length > 0
                    ? blockInterface.replaceDependenciesInOutput(clipboardBlock.output, dependencyReplacements)
                    : clipboardBlock.output;

            let state: BlockState<BlockInterface>;

            try {
                state = await blockInterface.output2State(output, context);
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

export { type ClipboardContent, useBlockClipboard };
