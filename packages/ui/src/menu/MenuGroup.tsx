"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./MenuGroup.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior. A group has no
 * configuration that changes its look, so the object is empty.
 *
 * @experimental
 */
export type MenuGroupOwnerState = Record<string, never>;

/** @experimental */
export interface MenuGroupSlotProps {
    /** The element that holds `label` above the items, which names the group. */
    label?: SlotProps<BaseMenu.GroupLabel.Props, MenuGroupOwnerState>;
}

/** @experimental */
export interface MenuGroupProps extends Omit<BaseMenu.Group.Props, "className" | "style" | "render" | "children"> {
    /** The group's visible name above its items, for example "Export as". It also names the group for assistive technology. */
    label: ReactNode;
    /** The group's items: `MenuItem` and `MenuLinkItem` elements. */
    children?: ReactNode;
    /** Added to the component's own classes on the outer element, which holds the label and the items. */
    className?: string;
    /** Inline styles for the outer element, which holds the label and the items. */
    style?: CSSProperties;
    /** Props for the inner part: `label`. As a function, it receives the owner state, which is empty. */
    slotProps?: MenuGroupSlotProps;
}

/**
 * A named group of items in a `Menu`, for example the formats under "Export as". Use it only as a child of
 * `Menu`, when the items need a heading to be understood. Without a name, separate groups with `MenuSeparator`.
 *
 * The label isn't an item: the arrow keys skip it. Screen readers announce it when focus enters the group.
 *
 * The props the component doesn't handle go to the outer element, which has the `group` role.
 *
 * @summary A named group of items in a menu.
 * @experimental
 */
export function MenuGroup({ label, className, slotProps, children, ...groupProps }: MenuGroupProps) {
    const ownerState: MenuGroupOwnerState = {};

    return (
        <BaseMenu.Group {...groupProps} className={clsx(styles.root, className)}>
            <BaseMenu.GroupLabel {...resolveSlotProps({ ownProps: { className: styles.label }, slotProps: slotProps?.label, ownerState })}>
                {label}
            </BaseMenu.GroupLabel>
            {children}
        </BaseMenu.Group>
    );
}
