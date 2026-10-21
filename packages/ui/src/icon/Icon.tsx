import "./icons.css";

import { clsx } from "clsx";
import type { CSSProperties, HTMLAttributes, Ref } from "react";

import styles from "./Icon.module.css";
import type { IconName } from "./iconNames";

/** @experimental */
export interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    /** The icon to show. "Foundations/Icons" shows every icon of the icon set. */
    name: IconName;
    /**
     * What the icon means, for an icon that is the only thing telling it, such as a warning sign next to a
     * value. Without a label, the icon is decorative and hidden from assistive technology, which is right when
     * text next to it says the same, as in a button.
     */
    label?: string;
    /** Added to the component's own class. */
    className?: string;
    /** Inline styles for the icon. */
    style?: CSSProperties;
    /** A ref to the `<span>`. */
    ref?: Ref<HTMLSpanElement>;
}

/**
 * Shows an icon of the icon set, 1em large and in the current text color, so it follows the text around it. Set
 * its size with `font-size` and its color with `color`.
 *
 * Each icon is a design token, `--dextinity-icon-<name>`, so a theme can replace an icon with its own, and the
 * icon follows the theme of the page or of a `ThemeSwitch` around it. Pass an icon to the components that take
 * one, such as `Button`'s `startIcon`: `<Button startIcon={<Icon name="plus" />}>Add product</Button>`.
 *
 * It uses no hooks, so it renders on the server, also as a React Server Component. The props it doesn't
 * handle, such as `id` and `aria-*`, go to its `<span>`.
 *
 * @summary An icon of the icon set, which a theme can replace.
 * @experimental
 */
export function Icon({ name, label, className, style, ...restProps }: IconProps) {
    const accessibility = label === undefined ? { "aria-hidden": true } : { role: "img", "aria-label": label };

    return (
        <span
            {...restProps}
            {...accessibility}
            className={clsx(styles.root, className)}
            data-icon={name}
            style={{ "--_icon": `var(--dextinity-icon-${name})`, ...style } as CSSProperties}
        />
    );
}
