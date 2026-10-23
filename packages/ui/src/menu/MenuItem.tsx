"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./MenuItem.module.css";

/** @experimental */
export type MenuItemTone = "default" | "danger";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type MenuItemOwnerState = {
    tone: MenuItemTone;
    disabled: boolean;
};

/** @experimental */
export interface MenuItemSlotProps {
    /** The element around `icon`. */
    icon?: SlotProps<ElementSlotProps<"span">, MenuItemOwnerState>;
}

/** @experimental */
export interface MenuItemProps extends Omit<BaseMenu.Item.Props, "className" | "style" | "render" | "nativeButton" | "children" | "disabled"> {
    /** The item's text, which names the action with a verb, for example "Duplicate". */
    children: ReactNode;
    /**
     * An icon before the text. It is decorative: the text names the item. Give either all items of a menu an
     * icon or none, so their texts line up.
     */
    icon?: ReactNode;
    /**
     * The item's color. Use `danger` for a destructive action, such as deleting, and put it last in the menu.
     *
     * @defaultValue `"default"`
     */
    tone?: MenuItemTone;
    /**
     * Prevents activating the item and dims it. The item stays in its place and the arrow keys still move to
     * it, so keyboard users learn that the action exists. Prefer leaving out an item that never applies.
     */
    disabled?: boolean;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the item. */
    style?: CSSProperties;
    /** Props for the inner part: `icon`. As a function, it receives the owner state: `tone` and `disabled`. */
    slotProps?: MenuItemSlotProps;
}

/**
 * An action in a `Menu`, such as "Duplicate" or "Delete". Use it only as a child of `Menu` or `MenuGroup`.
 *
 * Name the action with a verb, and keep the text short. Clicking the item, or pressing Enter or Space while it
 * is highlighted, calls `onClick` and closes the menu; set `closeOnClick={false}` to keep the menu open. For an
 * item that navigates to another page, use `MenuLinkItem`.
 *
 * The props the component doesn't handle, such as `onClick`, `closeOnClick` and `label`, the text that typing
 * matches when it differs from `children`, go to the item, which has the `menuitem` role.
 *
 * @summary An action in a menu, optionally with an icon or in the danger tone.
 * @experimental
 */
export function MenuItem({ tone = "default", icon, disabled, className, slotProps, children, ...itemProps }: MenuItemProps) {
    const ownerState: MenuItemOwnerState = { tone, disabled: Boolean(disabled) };

    return (
        <BaseMenu.Item {...itemProps} disabled={disabled} data-tone={tone} className={clsx(styles.root, className)}>
            {hasContent(icon) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({ ownProps: { className: styles.icon, "aria-hidden": true }, slotProps: slotProps?.icon, ownerState })}
                >
                    {icon}
                </SlotElement>
            )}
            {children}
        </BaseMenu.Item>
    );
}
