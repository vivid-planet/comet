import type { ResponsiveValue } from "./responsiveValue.js";

/**
 * Single source of truth for text style property names and their value types.
 * Both `TextStyles` and `TextVariantStyles` are derived from this interface.
 */
interface TextStyleMap {
    fontFamily: string;
    fontSize: string;
    fontWeight: string | number;
    fontStyle: string;
    lineHeight: string | number;
    letterSpacing: string;
    textDecoration: string;
    textTransform: string;
    color: string;
    bottomSpacing: string;
}

/** Base text styles where each property holds a plain value. */
export type TextStyles = { [K in keyof TextStyleMap]?: TextStyleMap[K] };

/** Variant text styles where each property supports responsive values. */
export type TextVariantStyles = { [K in keyof TextStyleMap]?: ResponsiveValue<TextStyleMap[K]> };

/**
 * Defines the variants available on the `MjmlText` component.
 *
 * ```ts
 * declare module "@comet/mail-react" {
 *     interface TextVariants {
 *         heading: true;
 *         body: true;
 *     }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TextVariants {}

type VariantsRecord = keyof TextVariants extends never ? Record<string, TextVariantStyles> : { [K in keyof TextVariants]?: TextVariantStyles };

export type VariantName = keyof TextVariants extends never ? string : keyof TextVariants;

/** Theme configuration for text styles, variants, and default variant. */
export interface ThemeText extends TextStyles {
    defaultVariant?: VariantName;
    variants?: VariantsRecord;
}

/**
 * A resolved breakpoint with its numeric value and a ready-to-use media query
 * string that targets viewports narrower than this breakpoint.
 */
export interface ThemeBreakpoint {
    /** The breakpoint width in pixels. */
    value: number;
    /** A CSS media query matching viewports below this breakpoint, e.g. `"@media (max-width: 599px)"`. */
    belowMediaQuery: string;
}

/**
 * Responsive breakpoints used by the email layout.
 *
 * The `default` breakpoint typically matches the body width, while `mobile`
 * defines the narrow viewport threshold.
 */
export interface ThemeBreakpoints {
    /** The default breakpoint, usually equal to `sizes.bodyWidth`. */
    default: ThemeBreakpoint;
    /**
     * The mobile breakpoint — the viewport width below which the layout is
     * considered "mobile".
     *
     * When used with `MjmlMailRoot`, this value also controls the MJML
     * responsive breakpoint (`<mj-breakpoint>`), which determines the viewport
     * width at which columns stack vertically.
     */
    mobile: ThemeBreakpoint;
}

/** Numeric size tokens for the email layout. */
export interface ThemeSizes {
    /** The width of the email body in pixels. */
    bodyWidth: number;
    /** Content indentation (left/right padding) in pixels, supporting per-breakpoint values. */
    contentIndentation: ResponsiveValue;
}

/**
 * The root theme object that holds all design tokens for `@comet/mail-react`.
 *
 * Every sub-interface is declared as an `interface` so consumers can
 * extend the theme at any level via TypeScript module augmentation.
 */
export interface Theme {
    sizes: ThemeSizes;
    breakpoints: ThemeBreakpoints;
    text: ThemeText;
}
