import { clsx } from "clsx";
import type { ComponentPropsWithoutRef, Ref } from "react";

import styles from "./Typography.module.scss";

/** @experimental */
export interface TypographyProps extends ComponentPropsWithoutRef<"p"> {
    ref?: Ref<HTMLParagraphElement>;
}

/**
 * Renders a single block of text.
 *
 * @experimental
 */
export function Typography({ className, children, ref, ...restProps }: TypographyProps) {
    return (
        <p {...restProps} ref={ref} className={clsx(styles.root, className)}>
            {children}
        </p>
    );
}
