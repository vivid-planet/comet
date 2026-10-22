"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import type { MenuItemTone } from "./MenuItem";
import styles from "./MenuLinkItem.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type MenuLinkItemOwnerState = {
    tone: MenuItemTone;
};

/** @experimental */
export interface MenuLinkItemSlotProps {
    /** The element around `icon`. */
    icon?: SlotProps<ElementSlotProps<"span">, MenuLinkItemOwnerState>;
}

/** @experimental */
export interface MenuLinkItemProps extends Omit<BaseMenu.LinkItem.Props, "className" | "style" | "children" | "closeOnClick"> {
    /** The item's text, which names the destination, for example "Profile". */
    children: ReactNode;
    /** The URL the item leads to. With `render`, the router's link component takes it instead, for example as `to`. */
    href?: string;
    /**
     * An icon before the text. It is decorative: the text names the item. Give either all items of a menu an
     * icon or none, so their texts line up.
     */
    icon?: ReactNode;
    /**
     * The item's color. Use `danger` for a link that leads to a destructive action, such as deleting the
     * account, and put it last in the menu.
     *
     * @defaultValue `"default"`
     */
    tone?: MenuItemTone;
    /**
     * Closes the menu when the item is clicked. Keep it on for links that change the page without reloading
     * it, such as a router's links, so the menu doesn't stay open over the new page.
     *
     * @defaultValue `true`
     */
    closeOnClick?: boolean;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the item. */
    style?: CSSProperties;
    /** Props for the inner part: `icon`. As a function, it receives the owner state: `tone`. */
    slotProps?: MenuLinkItemSlotProps;
}

/**
 * A link in a `Menu`, which navigates to another page, such as "Profile" in a user menu. Use it only as a child
 * of `Menu` or `MenuGroup`, and use `MenuItem` for actions that don't navigate.
 *
 * It renders an `<a>` element, so the browser's link features work: opening the page in a new tab, copying the
 * address. Pass `href` for a plain link. For a router's link, pass its link component as `render`, for example
 * `render={<Link to="/profile" />}`, so the router changes the page without reloading it.
 *
 * Clicking the item, or pressing Enter while it is highlighted, follows the link and closes the menu.
 *
 * The props the component doesn't handle, such as `target`, `rel` and `label`, the text that typing matches
 * when it differs from `children`, go to the `<a>` element, which has the `menuitem` role.
 *
 * @summary A link in a menu, which navigates to another page.
 * @experimental
 */
export function MenuLinkItem({ tone = "default", icon, closeOnClick = true, className, slotProps, children, ...linkItemProps }: MenuLinkItemProps) {
    const ownerState: MenuLinkItemOwnerState = { tone };

    return (
        <BaseMenu.LinkItem {...linkItemProps} closeOnClick={closeOnClick} data-tone={tone} className={clsx(styles.root, className)}>
            {hasContent(icon) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({ ownProps: { className: styles.icon, "aria-hidden": true }, slotProps: slotProps?.icon, ownerState })}
                >
                    {icon}
                </SlotElement>
            )}
            {children}
        </BaseMenu.LinkItem>
    );
}
