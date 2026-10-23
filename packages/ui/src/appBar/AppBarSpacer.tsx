import { clsx } from "clsx";
import type { ComponentPropsWithRef, CSSProperties } from "react";

import styles from "./AppBarSpacer.module.css";

/** @experimental */
export interface AppBarSpacerProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the spacer, for example a minimum width that keeps the content at the start and the end apart. */
    style?: CSSProperties;
}

/**
 * Fills the free space in an `AppBar`, so the children after it sit at the bar's end, for example the
 * notifications and the user menu. Use it only as a child of `AppBar`, at most once.
 *
 * It is an empty element, which assistive technology ignores. The props the component doesn't handle go to
 * its `<div>`.
 *
 * @summary Fills the free space in an app bar, pushing what follows to the end.
 * @experimental
 */
export function AppBarSpacer({ className, ...divProps }: AppBarSpacerProps) {
    return <div {...divProps} className={clsx(styles.root, className)} />;
}
