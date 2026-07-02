import type { ComponentType, PropsWithChildren, ReactNode } from "react";
import type { Renderers, TextBlockRenderFn } from "redraft";

import { HtmlInlineLink } from "../../components/inlineLink/HtmlInlineLink.js";
import type { RichTextBlockTypeProps, RichTextLinkHrefResolver } from "./common.js";

export type BlockTextProps = PropsWithChildren<
    RichTextBlockTypeProps & {
        /** Whether the theme's spacing below the text applies — set for every draft block except the last. */
        bottomSpacing: boolean;
    }
>;

const inlineStyleRenderers: Renderers["inline"] = {
    // The explicit styles back up the semantic tags in rendering engines that don't apply their default styling.
    BOLD: (children, { key }) => (
        <strong key={key} style={{ fontWeight: "bold" }}>
            {children}
        </strong>
    ),
    ITALIC: (children, { key }) => (
        <em key={key} style={{ fontStyle: "italic" }}>
            {children}
        </em>
    ),
    SUB: (children, { key }) => <sub key={key}>{children}</sub>,
    SUP: (children, { key }) => <sup key={key}>{children}</sup>,
    STRIKETHROUGH: (children, { key }) => <s key={key}>{children}</s>,
};

function resolveExternalLinkHref(props: unknown): string | undefined {
    if (typeof props !== "object" || props === null || !("targetUrl" in props)) {
        return undefined;
    }

    const { targetUrl } = props;

    return typeof targetUrl === "string" ? targetUrl : undefined;
}

export const builtInLinkTypes: Record<string, RichTextLinkHrefResolver> = {
    external: resolveExternalLinkHref,
};

function getLinkBlock(entityData: unknown): { type: string; props: unknown } | undefined {
    if (typeof entityData !== "object" || entityData === null || !("block" in entityData)) {
        return undefined;
    }

    const { block } = entityData;

    if (typeof block !== "object" || block === null || !("type" in block) || !("props" in block)) {
        return undefined;
    }

    const { type, props } = block;

    return typeof type === "string" ? { type, props } : undefined;
}

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

const standardTextBlockTypes = ["unstyled", "header-one", "header-two", "header-three", "header-four", "header-five", "header-six"];
const listBlockTypes = ["unordered-list-item", "ordered-list-item"];

interface CreateRichTextRenderersOptions {
    blockTypes: Record<string, RichTextBlockTypeProps>;
    linkTypes: Record<string, RichTextLinkHrefResolver>;
    blockTextComponent: ComponentType<BlockTextProps>;
    lastBlockKey: string;
}

export function createRichTextRenderers({ blockTypes, linkTypes, blockTextComponent, lastBlockKey }: CreateRichTextRenderersOptions): Renderers {
    const blocks: Renderers["blocks"] = {};

    for (const blockType of new Set([...standardTextBlockTypes, ...Object.keys(blockTypes)])) {
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
        inline: inlineStyleRenderers,
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
