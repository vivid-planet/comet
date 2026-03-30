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
}
