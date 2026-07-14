import type { BlockTextStyleProps } from "../helpers/blockText.js";
import type { LinkHrefResolver } from "../helpers/linkTypes.js";
import type { BlockTextMarkRenderer } from "../helpers/markRenderers.js";
import type { PropsWithData } from "../helpers/PropsWithData.js";

export interface RichTextBlockData {
    /** Draft.js raw content state (`{ blocks, entityMap }`), as produced by the CMS RichText block. */
    draftContent: unknown;
}

export type RichTextBlockProps = PropsWithData<RichTextBlockData>;

/** Styling for all draft blocks of one type — see `BlockTextStyleProps`. */
export type RichTextBlockTypeProps = BlockTextStyleProps;

/** Resolves the href of one link block type from the link block's props — see `LinkHrefResolver`. */
export type RichTextLinkHrefResolver<TProps = unknown> = LinkHrefResolver<TProps>;

/** Renders the text spanned by one draft-js inline style (e.g. `BOLD`) — see `BlockTextMarkRenderer`. */
export type RichTextInlineRenderer = BlockTextMarkRenderer;

export interface CreateRichTextBlockOptions<TLinkTypes extends Record<string, unknown> = Record<string, unknown>> {
    /**
     * Maps draft block types (e.g. `"header-one"`, `"paragraph-standard"`) to the
     * styling of the text component that renders them.
     *
     * Unmapped block types render with the base theme text styles.
     */
    blockTypes?: Record<string, RichTextBlockTypeProps>;
    /**
     * Maps the application's link block types within `LINK` entities to a
     * resolver returning the link's href.
     *
     * Merged on top of the built-in `external` link type. Link types without
     * a resolver render their text without a link.
     */
    linkTypes?: { [TLinkType in keyof TLinkTypes]: RichTextLinkHrefResolver<TLinkTypes[TLinkType]> };
    /**
     * Maps draft-js inline style names to renderers, keyed by the style name as
     * it appears in the content's `inlineStyleRanges`.
     *
     * Merged on top of the built-in styles (`BOLD`, `ITALIC`, `SUB`, `SUP`,
     * `STRIKETHROUGH`): use it to override a built-in style, or to render a
     * custom inline style the application defines in its RTE (e.g. `HIGHLIGHT`),
     * which has no built-in renderer.
     */
    inline?: Record<string, RichTextInlineRenderer>;
}
