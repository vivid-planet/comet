import type { TextStyles, VariantName } from "../../theme/themeTypes.js";
import type { PropsWithData } from "../helpers/PropsWithData.js";

export interface RichTextBlockData {
    /** Draft.js raw content state (`{ blocks, entityMap }`), as produced by the CMS RichText block. */
    draftContent: unknown;
}

export type RichTextBlockProps = PropsWithData<RichTextBlockData>;

/**
 * Styling for all draft blocks of one type, applied on top of the base theme text styles.
 *
 * Style props accept plain values only. For responsive styling, use a theme
 * variant, or set a `className` and register responsive CSS via `registerStyles`.
 */
export type RichTextBlockTypeProps = Omit<TextStyles, "bottomSpacing"> & {
    /**
     * The text component's variant to apply, as defined in the theme.
     *
     * @defaultValue The theme's `text.defaultVariant`, when set
     */
    variant?: VariantName;
    className?: string;
};

/**
 * Resolves the href of one link block type from the link block's props.
 *
 * Return `undefined` to render the linked text without a link.
 */
export type RichTextLinkHrefResolver = (props: unknown) => string | undefined;

export interface CreateRichTextBlockOptions {
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
    linkTypes?: Record<string, RichTextLinkHrefResolver>;
}
