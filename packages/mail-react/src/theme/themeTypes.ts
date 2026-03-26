import type { ResponsiveValue } from "./responsiveValue.js";

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

/** Base text styles using plain (non-responsive) values. */
export interface TextStyles {
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: string | number;
    fontStyle?: string;
    lineHeight?: string | number;
    letterSpacing?: string | number;
    textDecoration?: string;
    textTransform?: string;
    color?: string;
    bottomSpacing?: number;
}

/** Variant-level text styles where each value supports responsive overrides. */
export interface TextVariantStyles {
    fontFamily?: ResponsiveValue<string>;
    fontSize?: ResponsiveValue<string | number>;
    fontWeight?: ResponsiveValue<string | number>;
    fontStyle?: ResponsiveValue<string>;
    lineHeight?: ResponsiveValue<string | number>;
    letterSpacing?: ResponsiveValue<string | number>;
    textDecoration?: ResponsiveValue<string>;
    textTransform?: ResponsiveValue<string>;
    color?: ResponsiveValue<string>;
    bottomSpacing?: ResponsiveValue;
}

/**
 * Empty interface for consumer-defined text variant names.
 * Extend via module augmentation to add variant keys.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- intentional augmentation root; keyof TextVariants is `never` until extended
export interface TextVariants {}

/** Theme configuration for text styling, including base styles and optional variants. */
export interface ThemeText extends TextStyles {
    defaultVariant?: keyof TextVariants;
    variants?: { [K in keyof TextVariants]?: TextVariantStyles };
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
