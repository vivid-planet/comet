import type { CSSProperties } from "react";

import type { DividerVariantName } from "../../theme/themeTypes.js";

export interface DividerProps {
    /**
     * The component's variant to apply, as defined in the theme.
     *
     * Custom variants should be defined in the theme through module augmentation:
     *
     * ```ts
     * declare module "@comet/mail-react" {
     *     interface DividerVariants { thin: true; thick: true }
     * }
     * ```
     *
     * ```ts
     * const theme = createTheme({
     *     divider: {
     *         variants: {
     *             thin: { height: 1 },
     *             thick: { height: 8 },
     *         },
     *     },
     * });
     * ```
     */
    variant?: DividerVariantName;
    /** Height of the divider in pixels. */
    height?: number;
    /** Background color of the divider (e.g. `"#FF0000"`). */
    backgroundColor?: string;
    /**
     * Background image for the divider — typically a gradient. Clients that
     * don't render `background-image` fall back to the solid `backgroundColor`.
     */
    backgroundImage?: string;
    className?: string;
    style?: CSSProperties;
}
