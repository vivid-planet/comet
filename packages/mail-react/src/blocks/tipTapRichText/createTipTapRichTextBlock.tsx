import type { ReactNode } from "react";

import { createBlockTextComponents } from "../helpers/blockText.js";
import { mergeLinkTypes } from "../helpers/linkTypes.js";
import type { CreateTipTapRichTextBlockOptions, TipTapRichTextBlockProps } from "./common.js";
import { renderTipTapRichTextContent } from "./renderTipTapRichTextContent.js";

const { MjmlBlockText: MjmlTipTapBlockText, HtmlBlockText: HtmlTipTapBlockText } = createBlockTextComponents("tipTapRichTextBlock__text");

/**
 * Creates a pair of rich-text block components that render CMS TipTapRichText block
 * data (Tip-Tap/ProseMirror JSON) as themed text.
 *
 * Call the factory once per configuration — at the top level of a file, not
 * inside a component — and reuse the returned components. Call it again for
 * differently-configured rich-text blocks (e.g. a generic and a headline-only
 * one).
 *
 * `MjmlTipTapRichTextBlock` renders each top-level Tip-Tap node as `MjmlText`
 * and must be placed within an `MjmlColumn`. `HtmlTipTapRichTextBlock` renders
 * each top-level node as `HtmlText` for raw-HTML contexts (e.g. inside `MjmlRaw`).
 *
 * ```ts
 * export const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock({
 *     blockTypes: {
 *         "heading-1": { variant: "heading1" },
 *         paragraph: { variant: "body" },
 *     },
 * });
 * ```
 *
 * @experimental
 */
export function createTipTapRichTextBlock<TLinkTypes extends Record<string, unknown> = Record<string, unknown>>(
    options: CreateTipTapRichTextBlockOptions<TLinkTypes> = {},
): {
    // The description below is duplicated in MjmlTipTapRichTextBlock.stories.tsx because Storybook cannot read TSDoc from factory return type properties. Update both when the description changes.
    /** Renders CMS TipTapRichText block data (Tip-Tap/ProseMirror JSON) as one `MjmlText` per top-level node. Must be placed within an `MjmlColumn`. */
    MjmlTipTapRichTextBlock: (props: TipTapRichTextBlockProps) => ReactNode;
    // The description below is duplicated in HtmlTipTapRichTextBlock.stories.tsx because Storybook cannot read TSDoc from factory return type properties. Update both when the description changes.
    /** Renders CMS TipTapRichText block data (Tip-Tap/ProseMirror JSON) as one `HtmlText` div per top-level node, for raw-HTML contexts such as `MjmlRaw`. */
    HtmlTipTapRichTextBlock: (props: TipTapRichTextBlockProps) => ReactNode;
} {
    const blockTypes = options.blockTypes ?? {};
    const textBlockStyles = options.textBlockStyles ?? {};
    const linkTypes = mergeLinkTypes<TLinkTypes>(options.linkTypes);
    const marks = options.marks ?? {};
    const inlineStyles = options.inlineStyles ?? {};

    function MjmlTipTapRichTextBlock({ data }: TipTapRichTextBlockProps): ReactNode {
        return renderTipTapRichTextContent({
            tipTapContent: data.tipTapContent,
            blockTypes,
            textBlockStyles,
            linkTypes,
            marks,
            inlineStyles,
            blockTextComponent: MjmlTipTapBlockText,
        });
    }

    function HtmlTipTapRichTextBlock({ data }: TipTapRichTextBlockProps): ReactNode {
        return renderTipTapRichTextContent({
            tipTapContent: data.tipTapContent,
            blockTypes,
            textBlockStyles,
            linkTypes,
            marks,
            inlineStyles,
            blockTextComponent: HtmlTipTapBlockText,
        });
    }

    return { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock };
}
