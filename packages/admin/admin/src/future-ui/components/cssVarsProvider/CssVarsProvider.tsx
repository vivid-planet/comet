import { clsx } from "clsx";
import type { ComponentPropsWithoutRef } from "react";

import type { ThemeBrand, ThemeColorScheme } from "../../theme/types";
import styles from "./CssVarsProvider.module.scss";

/** @experimental */
export interface CssVarsProviderProps extends ComponentPropsWithoutRef<"div"> {
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
export function CssVarsProvider({ brand = "default", colorScheme = "light", className, children, ...restProps }: CssVarsProviderProps) {
    return (
        <div {...restProps} data-comet-brand={brand} data-comet-color-scheme={colorScheme} className={clsx(styles.root, className)}>
            {children}
        </div>
    );
}
