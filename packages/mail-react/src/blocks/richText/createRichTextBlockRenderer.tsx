import type { ComponentType, ReactNode } from "react";
import redraftImport from "redraft";

import type {
    BlockTextProps,
    CreateRichTextBlockRendererOptions,
    RichTextBlockProps,
    RichTextBlockTypeProps,
    RichTextLinkHrefResolver,
} from "./common.js";
import { builtInLinkTypes, createRichTextRenderers } from "./createRichTextRenderers.js";

// redraft is CommonJS-only: under native ESM the default import is the whole
// `module.exports` object, under bundlers it is the render function itself.
const redraft = typeof redraftImport === "function" ? redraftImport : redraftImport.default;

interface DraftBlock {
    key: string;
    text: string;
}

function isDraftBlock(block: unknown): block is DraftBlock {
    if (typeof block !== "object" || block === null || !("key" in block) || !("text" in block)) {
        return false;
    }

    const { key, text } = block;

    return typeof key === "string" && typeof text === "string";
}

function isDraftContent(draftContent: unknown): draftContent is { blocks: DraftBlock[] } {
    if (typeof draftContent !== "object" || draftContent === null || !("blocks" in draftContent)) {
        return false;
    }

    const { blocks } = draftContent;

    return Array.isArray(blocks) && blocks.every(isDraftBlock);
}

interface RenderRichTextContentOptions {
    draftContent: unknown;
    blockTypes: Record<string, RichTextBlockTypeProps>;
    linkTypes: Record<string, RichTextLinkHrefResolver>;
    blockTextComponent: ComponentType<BlockTextProps>;
}

function renderRichTextContent({ draftContent, blockTypes, linkTypes, blockTextComponent }: RenderRichTextContentOptions): ReactNode {
    if (!isDraftContent(draftContent)) {
        return null;
    }

    const blocksWithText = draftContent.blocks.filter((block) => block.text !== "");
    const lastBlockKey = blocksWithText[blocksWithText.length - 1]?.key;

    if (lastBlockKey === undefined) {
        return null;
    }

    const renderers = createRichTextRenderers({ blockTypes, linkTypes, blockTextComponent, lastBlockKey });

    return redraft({ ...draftContent, blocks: blocksWithText }, renderers);
}

/**
 * Creates a rich-text block component that renders CMS RichText block data
 * (draft-js raw content) as themed text.
 *
 * Call the factory once per configuration — at the top level of a file, not
 * inside a component — and reuse the returned component. Call it again for
 * differently-configured or differently-rendered rich-text blocks (e.g. an
 * MJML and a raw-HTML variant, or a generic and a headline-only one).
 *
 * Pass `MjmlBlockText` as `blockTextComponent` to render each draft block as
 * `MjmlText` (must be placed within an `MjmlColumn`), or `HtmlBlockText` to
 * render as `HtmlText` for raw-HTML contexts (e.g. inside `MjmlRaw`).
 *
 * ```ts
 * export const MjmlRichTextBlock = createRichTextBlockRenderer({
 *     blockTextComponent: MjmlBlockText,
 *     blockTypes: {
 *         "header-one": { variant: "heading1" },
 *         "paragraph-standard": { variant: "body" },
 *     },
 * });
 * ```
 */
export function createRichTextBlockRenderer({
    blockTextComponent,
    blockTypes = {},
    linkTypes,
}: CreateRichTextBlockRendererOptions): (props: RichTextBlockProps) => ReactNode {
    const mergedLinkTypes = { ...builtInLinkTypes, ...linkTypes };

    return function RichTextBlock({ data }: RichTextBlockProps): ReactNode {
        return renderRichTextContent({ draftContent: data.draftContent, blockTypes, linkTypes: mergedLinkTypes, blockTextComponent });
    };
}
