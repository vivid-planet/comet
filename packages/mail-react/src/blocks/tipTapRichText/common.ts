import type { BlockTextStyleProps } from "../helpers/blockText.js";
import type { LinkHrefResolver } from "../helpers/linkTypes.js";
import type { BlockTextMarkRenderer } from "../helpers/markRenderers.js";
import type { PropsWithData } from "../helpers/PropsWithData.js";
import { hasProperty } from "../helpers/typeGuards.js";

export interface TipTapRichTextBlockData {
    /** Tip-Tap/ProseMirror JSON (`{ type: "doc", content: [...] }`) as produced by the CMS TipTapRichTextBlock. */
    tipTapContent: unknown;
}

export type TipTapRichTextBlockProps = PropsWithData<TipTapRichTextBlockData>;

export type TipTapTextBlockType =
    | "paragraph"
    | "heading-1"
    | "heading-2"
    | "heading-3"
    | "heading-4"
    | "heading-5"
    | "heading-6"
    | "unordered-list"
    | "ordered-list";

/** Styling for all Tip-Tap text blocks of one type — see `BlockTextStyleProps`. */
export type TipTapRichTextBlockTypeProps = BlockTextStyleProps;

/** Resolves the href of one link block type from the link mark's data — see `LinkHrefResolver`. */
export type TipTapRichTextLinkHrefResolver<TProps = unknown> = LinkHrefResolver<TProps>;

/** Renders the text wrapped by one Tip-Tap mark or inline style — see `BlockTextMarkRenderer`. */
export type TipTapRichTextMarkRenderer = BlockTextMarkRenderer;

export interface CreateTipTapRichTextBlockOptions<TLinkTypes extends Record<string, unknown> = Record<string, unknown>> {
    /**
     * Maps Tip-Tap text block types (`"paragraph"`, `"heading-1"`…`"heading-6"`, `"unordered-list"`,
     * `"ordered-list"`) to the styling of the text component that renders them.
     *
     * Unmapped block types render with the base theme text styles.
     */
    blockTypes?: Partial<Record<TipTapTextBlockType, TipTapRichTextBlockTypeProps>>;
    /**
     * Maps the application's `textBlockStyle` attribute values — set on paragraph and heading nodes
     * by the CMS TipTapRichTextBlock's `textBlockStyles` option — to the styling of the text
     * component. Wins over the structural `blockTypes` entry for the same node when set.
     *
     * Ignored for paragraphs nested inside list items.
     */
    textBlockStyles?: Record<string, TipTapRichTextBlockTypeProps>;
    /**
     * Maps the application's link block types within `link` marks to a resolver returning the
     * link's href.
     *
     * Merged on top of the built-in `external` link type. Link types without a resolver render
     * their text without a link.
     */
    linkTypes?: { [TLinkType in keyof TLinkTypes]: TipTapRichTextLinkHrefResolver<TLinkTypes[TLinkType]> };
    /**
     * Maps Tip-Tap mark types to renderers, keyed by the mark's `type`.
     *
     * Merged on top of the built-in marks (`bold`, `italic`, `strike`, `superscript`, `subscript`):
     * use it to override a built-in mark, or to render a custom mark.
     */
    marks?: Record<string, TipTapRichTextMarkRenderer>;
    /**
     * Maps the `inlineStyle` mark's `attrs.type` values — application-defined inline styles set via
     * the CMS TipTapRichTextBlock's `inlineStyles` option — to renderers.
     *
     * Has no built-ins: unconfigured inline styles render their children unchanged.
     */
    inlineStyles?: Record<string, TipTapRichTextMarkRenderer>;
}

export interface TipTapMark {
    type: string;
    attrs?: Record<string, unknown>;
}

export interface TipTapNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: TipTapNode[];
    marks?: TipTapMark[];
    text?: string;
}

export interface TipTapDoc {
    type: "doc";
    content: TipTapNode[];
}

function isTipTapNode(node: unknown): node is TipTapNode {
    if (!hasProperty(node, "type")) {
        return false;
    }

    const { type } = node;

    return typeof type === "string";
}

export function isTipTapDoc(content: unknown): content is TipTapDoc {
    if (!hasProperty(content, "type") || !hasProperty(content, "content")) {
        return false;
    }

    const { type, content: docContent } = content;

    if (type !== "doc" || !Array.isArray(docContent)) {
        return false;
    }

    return docContent.every(isTipTapNode);
}
