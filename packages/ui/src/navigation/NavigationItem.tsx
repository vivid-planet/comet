"use client";

import { clsx } from "clsx";
import { type ComponentPropsWithRef, type CSSProperties, type ReactNode, use, useLayoutEffect } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { NavigationContext } from "./navigationContext";
import styles from "./NavigationItem.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type NavigationItemOwnerState = {
    /** Whether the item leads to the current page, from `active`. */
    active: boolean;
    /** How deeply the item is nested: `1` directly in `Navigation`, `2` in a `NavigationGroup`, `3` in a group inside a group, and so on. */
    level: number;
};

/** @experimental */
export interface NavigationItemSlotProps {
    /** The `<a>` element, which holds `icon` and `children` and receives the props the component doesn't handle. */
    link?: SlotProps<ElementSlotProps<"a">, NavigationItemOwnerState>;
    /** The element around `icon`. */
    icon?: SlotProps<ElementSlotProps<"span">, NavigationItemOwnerState>;
}

/** @experimental */
export interface NavigationItemProps extends Omit<ComponentPropsWithRef<"a">, "className" | "style" | "children" | "aria-current"> {
    /** The item's text, which names the page it leads to, for example "Products". */
    children: ReactNode;
    /**
     * The URL of the page. Pass it, or a router's link component as `render`: without either, the item is no
     * link that the user could follow or focus. With `render`, the router's link component takes the URL
     * instead, for example as `to`.
     */
    href?: string;
    /**
     * Replaces the `<a>` element, for a router's link component that changes the page without reloading it,
     * for example `render={<Link to="/products" />}`. It must render an `<a>` element. A function receives
     * the props to spread.
     */
    render?: ElementSlotProps<"a">["render"];
    /**
     * An icon before the text. It is decorative: the text names the page. Give either all items on the first
     * level an icon or none, so their texts line up. Nested items are indented by an icon's width, so they
     * line up with the label of a group that has an icon, and usually have none.
     */
    icon?: ReactNode;
    /**
     * Marks the item that leads to the current page: it is highlighted and announced as the current page.
     * Set it on one item at a time, from the router's current location. The groups around an active item open
     * by themselves, unless their `open` prop controls them.
     */
    active?: boolean;
    /** Added to the component's own classes on the outer `<li>` element, which holds the link. */
    className?: string;
    /** Inline styles for the outer `<li>` element, which holds the link. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `link` (the `<a>` element) and `icon`. As a function, it receives the owner
     * state: `active` and `level`.
     */
    slotProps?: NavigationItemSlotProps;
}

/**
 * A link to a page of the application in a `Navigation`, such as "Dashboard" or "Products". Use it only as a
 * child of `Navigation` or `NavigationGroup`.
 *
 * Name the page in a word or two as `children`, and mark the item of the current page with `active`. Pass
 * `href` for a plain link; for a router's link, pass its link component as `render`, for example
 * `render={<Link to="/products" />}`, so the router changes the page without reloading it. Inside a
 * `NavigationGroup`, the item is indented below the group's text.
 *
 * It renders an `<a>` element in a list item, so the browser's link features work: opening the page in a new
 * tab, copying the address. The active item has `aria-current="page"`, so screen readers announce it as the
 * current page.
 *
 * The props the component doesn't handle, such as `target`, `onClick` and `ref`, go to the `<a>` element.
 *
 * @summary A link to a page in the application's navigation, optionally with an icon.
 * @experimental
 */
export function NavigationItem({ icon, active, render, className, style, slotProps, children, ...linkProps }: NavigationItemProps) {
    const { level, revealActiveItem } = use(NavigationContext);
    const ownerState: NavigationItemOwnerState = { active: Boolean(active), level };

    useLayoutEffect(() => {
        if (active) {
            revealActiveItem?.();
        }
    }, [active, revealActiveItem]);

    return (
        <li
            className={clsx(styles.root, className)}
            style={{ "--_level": level, ...style } as CSSProperties}
            data-active={ownerState.active ? "" : undefined}
            data-level={level}
        >
            <SlotElement
                tagName="a"
                {...resolveSlotProps({
                    ownProps: { ...linkProps, render, "aria-current": ownerState.active ? "page" : undefined, className: styles.link },
                    slotProps: slotProps?.link,
                    ownerState,
                })}
            >
                {hasContent(icon) && (
                    <SlotElement
                        tagName="span"
                        {...resolveSlotProps({ ownProps: { className: styles.icon, "aria-hidden": true }, slotProps: slotProps?.icon, ownerState })}
                    >
                        {icon}
                    </SlotElement>
                )}
                {children}
            </SlotElement>
        </li>
    );
}
