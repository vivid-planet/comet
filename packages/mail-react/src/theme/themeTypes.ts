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
 * Single source of truth for divider style property names and their value types.
 * Both `DividerStyles` and `DividerVariantStyles` are derived from this interface.
 */
interface DividerStyleMap {
    height: number;
    backgroundColor: string;
    backgroundImage: string;
}

/** Base divider styles where each property holds a plain value. */
export type DividerStyles = { [K in keyof DividerStyleMap]?: DividerStyleMap[K] };

/** Variant divider styles where each property supports responsive values. */
export type DividerVariantStyles = { [K in keyof DividerStyleMap]?: ResponsiveValue<DividerStyleMap[K]> };

/**
 * Defines the variants available on the `MjmlDivider` and `HtmlDivider` components.
 *
 * ```ts
 * declare module "@comet/mail-react" {
 *     interface DividerVariants {
 *         thin: true;
 *         thick: true;
 *     }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DividerVariants {}

type DividerVariantsRecord = keyof DividerVariants extends never
    ? Record<string, DividerVariantStyles>
    : { [K in keyof DividerVariants]?: DividerVariantStyles };

export type DividerVariantName = keyof DividerVariants extends never ? string : keyof DividerVariants;

/** Theme configuration for divider styles, variants, and default variant. */
export interface ThemeDivider extends DividerStyles {
    defaultVariant?: DividerVariantName;
    variants?: DividerVariantsRecord;
}

/**
 * Single source of truth for button style property names and their value types.
 * Both `ButtonStyles` and `ButtonVariantStyles` are derived from this interface.
 *
 * `padding` is the button's inner padding (the space around the label). It is
 * deliberately distinct from `MjmlButton`'s `padding` prop, which is the outer
 * spacing around the button.
 */
interface ButtonStyleMap {
    color: string;
    backgroundColor: string;
    /**
     * A background image — typically a gradient. Rendered as progressive
     * enhancement on top of `backgroundColor`; clients that don't render it
     * (notably Outlook) fall back to the solid color.
     */
    backgroundImage: string;
    border: string;
    borderRadius: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string | number;
    lineHeight: string | number;
    padding: string;
}

/** Base button styles where each property holds a plain value. */
export type ButtonStyles = { [K in keyof ButtonStyleMap]?: ButtonStyleMap[K] };

/** Variant button styles where each property supports responsive values. */
export type ButtonVariantStyles = { [K in keyof ButtonStyleMap]?: ResponsiveValue<ButtonStyleMap[K]> };

/**
 * Defines the variants available on the `MjmlButton` and `HtmlButton` components.
 *
 * ```ts
 * declare module "@comet/mail-react" {
 *     interface ButtonVariants {
 *         primary: true;
 *         secondary: true;
 *     }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ButtonVariants {}

type ButtonVariantsRecord = keyof ButtonVariants extends never
    ? Record<string, ButtonVariantStyles>
    : { [K in keyof ButtonVariants]?: ButtonVariantStyles };

export type ButtonVariantName = keyof ButtonVariants extends never ? string : keyof ButtonVariants;

/** Theme configuration for button styles, variants, and default variant. */
export interface ThemeButton extends ButtonStyles {
    defaultVariant?: ButtonVariantName;
    variants?: ButtonVariantsRecord;
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

/** Background color tokens for usage through the email layout. */
export interface ThemeBackgroundColors {
    body: string;
    content: string;
}

/** Color tokens for usage through the email layout. */
export interface ThemeColors {
    background: ThemeBackgroundColors;
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
    divider: ThemeDivider;
    button: ThemeButton;
    colors: ThemeColors;
}
