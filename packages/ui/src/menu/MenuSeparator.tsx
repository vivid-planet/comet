"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { clsx } from "clsx";
import type { CSSProperties } from "react";

import styles from "./MenuSeparator.module.css";

/** @experimental */
export interface MenuSeparatorProps extends Omit<BaseMenu.Separator.Props, "className" | "style" | "render" | "orientation"> {
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the separator. */
    style?: CSSProperties;
}

/**
 * A line between the items of a `Menu`, which separates groups of related items, for example the destructive
 * actions from the others. Use it only as a child of `Menu`. For a group that needs a name, use `MenuGroup`.
 *
 * Screen readers announce it as a separator. The props the component doesn't handle go to its element.
 *
 * @summary A line that separates groups of items in a menu.
 * @experimental
 */
export function MenuSeparator({ className, ...separatorProps }: MenuSeparatorProps) {
    return <BaseMenu.Separator {...separatorProps} className={clsx(styles.root, className)} />;
}
