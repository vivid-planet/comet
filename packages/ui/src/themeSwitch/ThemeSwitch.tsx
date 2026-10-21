import { clsx } from "clsx";
import type { HTMLAttributes, PropsWithChildren, Ref } from "react";

import styles from "./ThemeSwitch.module.css";

/** @experimental */
export type ThemeSwitchColorScheme = "light" | "dark";

/** @experimental */
export interface ThemeSwitchProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
    /**
     * The theme inside, by the name its stylesheet gives it, such as `"dextinity"`. The application loads the
     * theme's stylesheet, as for the theme of the page.
     */
    theme: string;
    /**
     * The color scheme inside. It doesn't follow the color scheme around the theme switch: every token inside
     * gets the value of `theme` in this color scheme.
     */
    colorScheme: ThemeSwitchColorScheme;
    /** Added to the component's own class. */
    className?: string;
    /** A ref to the `<div>`. */
    ref?: Ref<HTMLDivElement>;
}

/**
 * Switches the theme for a part of a page: every design token inside it gets the value of `theme` in
 * `colorScheme`, so the components inside look as they do in that theme. Use it for a section in the other
 * color scheme, such as a dark sidebar in a light application, for the preview of a theme, or for a part of a
 * page that belongs to another brand. Theme switches can be nested.
 *
 * It paints the theme's background and sets its text color and font, because the contrast a theme guarantees
 * holds on its own background. Give it padding and a layout with `className`. Popups opened inside it, such as
 * the options of a select, follow its theme too.
 *
 * It has no state and uses no React context, so it renders on the server, also as a React Server Component.
 * The props it doesn't handle, such as `id` and `aria-*`, go to its `<div>`.
 *
 * @summary Switches the theme and color scheme for the part of a page inside it.
 * @experimental
 */
export function ThemeSwitch({ theme, colorScheme, className, ...restProps }: ThemeSwitchProps) {
    return <div {...restProps} className={clsx(styles.root, className)} data-dextinity-theme={theme} data-dextinity-color-scheme={colorScheme} />;
}
