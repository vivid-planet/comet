import type { ComponentType, ReactNode } from "react";
import type { Renderers, TextBlockRenderFn } from "redraft";

import { HtmlInlineLink } from "../../components/inlineLink/HtmlInlineLink.js";
import type { BlockTextProps } from "../helpers/blockText.js";
import { getLinkBlock } from "../helpers/linkTypes.js";
import { builtInBlockTextMarkRenderers } from "../helpers/markRenderers.js";
import type { RichTextBlockTypeProps, RichTextInlineRenderer, RichTextLinkHrefResolver } from "./common.js";

const inlineStyleRenderers: Renderers["inline"] = {
    BOLD: builtInBlockTextMarkRenderers.bold,
    ITALIC: builtInBlockTextMarkRenderers.italic,
    SUB: builtInBlockTextMarkRenderers.subscript,
    SUP: builtInBlockTextMarkRenderers.superscript,
    STRIKETHROUGH: builtInBlockTextMarkRenderers.strike,
};

function renderWithLineBreaks(node: ReactNode): ReactNode {
    if (typeof node === "string" && node.includes("\n")) {
        const lines = node.split("\n");

        return lines.flatMap((line, index) => (index === 0 ? [line] : [<br key={index} />, line]));
    }

    if (Array.isArray(node)) {
        return node.map((child) => renderWithLineBreaks(child));
    }

    return node;
}

interface CreateBlockRenderFnOptions {
    blockTextComponent: ComponentType<BlockTextProps>;
    blockTypeProps: RichTextBlockTypeProps;
    lastBlockKey: string;
}

function createTextBlockRenderFn({ blockTextComponent: BlockText, blockTypeProps, lastBlockKey }: CreateBlockRenderFnOptions): TextBlockRenderFn {
    return (children, { keys }) =>
        children.map((child, index) => (
            <BlockText key={keys[index]} bottomSpacing={keys[index] !== lastBlockKey} {...blockTypeProps}>
                {renderWithLineBreaks(child)}
            </BlockText>
        ));
}

function createListBlockRenderFn({
    listElement: ListElement,
    blockTextComponent: BlockText,
    blockTypeProps,
    lastBlockKey,
}: CreateBlockRenderFnOptions & { listElement: "ul" | "ol" }): TextBlockRenderFn {
    return (children, { keys }) => (
        <BlockText key={keys.join("-")} bottomSpacing={!keys.includes(lastBlockKey)} {...blockTypeProps}>
            {/* Vertical margins are removed so the spacing between blocks comes from the theme's bottomSpacing alone. */}
            <ListElement className="richTextBlock__list" style={{ marginTop: 0, marginBottom: 0 }}>
                {children.map((child, index) => (
                    <li key={keys[index]} className="richTextBlock__listItem">
                        {renderWithLineBreaks(child)}
                    </li>
                ))}
            </ListElement>
        </BlockText>
    );
}

const listBlockTypes = ["unordered-list-item", "ordered-list-item"];

interface CreateRichTextRenderersOptions {
    blockTypes: Record<string, RichTextBlockTypeProps>;
    linkTypes: Record<string, RichTextLinkHrefResolver>;
    inline: Record<string, RichTextInlineRenderer>;
    blockTextComponent: ComponentType<BlockTextProps>;
    lastBlockKey: string;
}

export function createRichTextRenderers({
    blockTypes,
    linkTypes,
    inline,
    blockTextComponent,
    lastBlockKey,
}: CreateRichTextRenderersOptions): Renderers {
    const blocks: Renderers["blocks"] = {};

    // "unstyled" is redraft's blockFallback: registering it makes every block type the caller did not configure render with base theme styles.
    for (const blockType of new Set(["unstyled", ...Object.keys(blockTypes)])) {
        if (listBlockTypes.includes(blockType)) {
            continue;
        }

        blocks[blockType] = createTextBlockRenderFn({ blockTextComponent, blockTypeProps: blockTypes[blockType] ?? {}, lastBlockKey });
    }

    for (const listBlockType of listBlockTypes) {
        blocks[listBlockType] = createListBlockRenderFn({
            listElement: listBlockType === "unordered-list-item" ? "ul" : "ol",
            blockTextComponent,
            blockTypeProps: blockTypes[listBlockType] ?? {},
            lastBlockKey,
        });
    }

    return {
        inline: { ...inlineStyleRenderers, ...inline },
        blocks,
        entities: {
            LINK: (children, data, { key }) => {
                const linkBlock = getLinkBlock(data);

                if (linkBlock === undefined) {
                    return children;
                }

                const href = linkTypes[linkBlock.type]?.(linkBlock.props);

                if (href === undefined) {
                    return children;
                }

                return (
                    <HtmlInlineLink key={key} className="richTextBlock__link" href={href}>
                        {children}
                    </HtmlInlineLink>
                );
            },
        },
    };
}
