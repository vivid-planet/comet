import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

import type { ThemeBrand, ThemeColorScheme } from "../../theme/types";
import styles from "./Theme.module.scss";

/** @experimental */
export interface ThemeProps extends ComponentPropsWithoutRef<"div"> {
    /**
     * The active brand.
     *
     * @defaultValue "default"
     */
    brand?: ThemeBrand | (string & {});
    /**
     * The active color scheme.
     *
     * @defaultValue "light"
     */
    colorScheme?: ThemeColorScheme | (string & {});
    /** Added alongside the component's own classes. */
    className?: string;
}

/**
 * Scopes the active brand and color scheme to its subtree. Wrap an application, or a section of one.
 *
 * @experimental
 */
export function Theme({ brand = "default", colorScheme = "light", className, children, ...restProps }: ThemeProps) {
    return (
        <div {...restProps} data-comet-brand={brand} data-comet-color-scheme={colorScheme} className={clsx(styles.root, className)}>
            {children}
        </div>
    );
}
