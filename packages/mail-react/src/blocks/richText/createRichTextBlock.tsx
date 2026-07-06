import clsx from "clsx";
import type { ComponentType, ReactNode } from "react";
import redraftImport from "redraft";

import { HtmlText } from "../../components/text/HtmlText.js";
import { MjmlText } from "../../components/text/MjmlText.js";
import type {
    CreateRichTextBlockOptions,
    RichTextBlockProps,
    RichTextBlockTypeProps,
    RichTextInlineRenderer,
    RichTextLinkHrefResolver,
} from "./common.js";
import { type BlockTextProps, builtInLinkTypes, createRichTextRenderers } from "./createRichTextRenderers.js";

// redraft is CommonJS-only: under native ESM the default import is the whole
// `module.exports` object, under bundlers it is the render function itself.
const redraft = typeof redraftImport === "function" ? redraftImport : redraftImport.default;

function MjmlBlockText({ bottomSpacing, variant, className, fontWeight, children, ...styleProps }: BlockTextProps): ReactNode {
    return (
        <MjmlText
            variant={variant}
            bottomSpacing={bottomSpacing}
            className={clsx("richTextBlock__text", className)}
            // Spread conditionally: MjmlText spreads explicit props after the theme-resolved variant
            // props, so an explicit `fontWeight={undefined}` would erase the variant's value.
            {...(fontWeight !== undefined && { fontWeight: String(fontWeight) })}
            {...styleProps}
        >
            {children}
        </MjmlText>
    );
}

function HtmlBlockText({ bottomSpacing, variant, className, children, ...styleProps }: BlockTextProps): ReactNode {
    return (
        <HtmlText element="div" variant={variant} bottomSpacing={bottomSpacing} className={clsx("richTextBlock__text", className)} style={styleProps}>
            {children}
        </HtmlText>
    );
}

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
    inline: Record<string, RichTextInlineRenderer>;
    blockTextComponent: ComponentType<BlockTextProps>;
}

function renderRichTextContent({ draftContent, blockTypes, linkTypes, inline, blockTextComponent }: RenderRichTextContentOptions): ReactNode {
    if (!isDraftContent(draftContent)) {
        return null;
    }

    const blocksWithText = draftContent.blocks.filter((block) => block.text !== "");
    const lastBlockKey = blocksWithText[blocksWithText.length - 1]?.key;

    if (lastBlockKey === undefined) {
        return null;
    }

    const renderers = createRichTextRenderers({ blockTypes, linkTypes, inline, blockTextComponent, lastBlockKey });

    return redraft({ ...draftContent, blocks: blocksWithText }, renderers);
}

/**
 * Creates a pair of rich-text block components that render CMS RichText block
 * data (draft-js raw content) as themed text.
 *
 * Call the factory once per configuration — at the top level of a file, not
 * inside a component — and reuse the returned components. Call it again for
 * differently-configured rich-text blocks (e.g. a generic and a headline-only
 * one).
 *
 * `MjmlRichTextBlock` renders each draft block as `MjmlText` and must be
 * placed within an `MjmlColumn`. `HtmlRichTextBlock` renders each draft block
 * as `HtmlText` for raw-HTML contexts (e.g. inside `MjmlRaw`).
 *
 * ```ts
 * export const { MjmlRichTextBlock, HtmlRichTextBlock } = createRichTextBlock({
 *     blockTypes: {
 *         "header-one": { variant: "heading1" },
 *         "paragraph-standard": { variant: "body" },
 *     },
 * });
 * ```
 */
export function createRichTextBlock(options: CreateRichTextBlockOptions = {}): {
    // The description below is duplicated in MjmlRichTextBlock.stories.tsx because Storybook cannot read TSDoc from factory return type properties. Update both when the description changes.
    /** Renders CMS RichText block data (draft-js raw content) as one `MjmlText` per draft block. Must be placed within an `MjmlColumn`. */
    MjmlRichTextBlock: (props: RichTextBlockProps) => ReactNode;
    // The description below is duplicated in HtmlRichTextBlock.stories.tsx because Storybook cannot read TSDoc from factory return type properties. Update both when the description changes.
    /** Renders CMS RichText block data (draft-js raw content) as one `HtmlText` div per draft block, for raw-HTML contexts such as `MjmlRaw`. */
    HtmlRichTextBlock: (props: RichTextBlockProps) => ReactNode;
} {
    const blockTypes = options.blockTypes ?? {};
    const linkTypes = { ...builtInLinkTypes, ...options.linkTypes };
    const inline = options.inline ?? {};

    function MjmlRichTextBlock({ data }: RichTextBlockProps): ReactNode {
        return renderRichTextContent({ draftContent: data.draftContent, blockTypes, linkTypes, inline, blockTextComponent: MjmlBlockText });
    }

    function HtmlRichTextBlock({ data }: RichTextBlockProps): ReactNode {
        return renderRichTextContent({ draftContent: data.draftContent, blockTypes, linkTypes, inline, blockTextComponent: HtmlBlockText });
    }

    return { MjmlRichTextBlock, HtmlRichTextBlock };
}
