"use client";

import { clsx } from "clsx";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";

import { Icon } from "../icon/Icon";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./BreadcrumbItem.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type BreadcrumbItemOwnerState = {
    /** Whether the item is the current page, from `current`. */
    current: boolean;
};

/** @experimental */
export interface BreadcrumbItemSlotProps {
    /** The chevron before the item, which separates it from the item before. It is hidden on the first item. */
    separator?: SlotProps<ElementSlotProps<"span">, BreadcrumbItemOwnerState>;
    /**
     * The `<a>` element, which holds `children` and receives the props the component doesn't handle. For the
     * current page, it has no `href`, which makes it plain text.
     */
    link?: SlotProps<ElementSlotProps<"a">, BreadcrumbItemOwnerState>;
}

/** @experimental */
export interface BreadcrumbItemProps extends Omit<ComponentPropsWithRef<"a">, "className" | "style" | "children" | "aria-current"> {
    /** The page's name, for example "Products". Use the page's own title, shortened where it is long. */
    children: ReactNode;
    /**
     * The URL of the page. Pass it, or a router's link component as `render`, on every item but the `current`
     * one; leave out both only for a level that has no page of its own, which is then plain text. With
     * `render`, the router's link component takes the URL instead, for example as `to`. Ignored for the
     * `current` page.
     */
    href?: string;
    /**
     * Replaces the `<a>` element, for a router's link component that changes the page without reloading it,
     * for example `render={<Link to="/products" />}`. It must render an `<a>` element. Ignored for the
     * `current` page. A function receives the props to spread.
     */
    render?: ElementSlotProps<"a">["render"];
    /**
     * Marks the item as the current page, the last one in the breadcrumbs. It is plain text instead of a link,
     * and screen readers announce it as the current page.
     */
    current?: boolean;
    /** Added to the component's own classes on the outer `<li>` element, which holds the separator and the link. */
    className?: string;
    /** Inline styles for the outer `<li>` element, which holds the separator and the link. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `separator` (the chevron before the item) and `link` (the `<a>` element). As a
     * function, it receives the owner state: `current`.
     */
    slotProps?: BreadcrumbItemSlotProps;
}

/**
 * One level of the hierarchy in `Breadcrumbs`: a link to a page above the current one, or the current page
 * itself. Use it only as a child of `Breadcrumbs`.
 *
 * Pass the page's name as `children`. Pass `href` for a plain link; for a router's link, pass its link
 * component as `render`, for example `render={<Link to="/products" />}`, so the router changes the page
 * without reloading it. Mark the last item, the current page, with `current`: it is plain text, because a
 * link to the page the user is on leads nowhere.
 *
 * The props the component doesn't handle, such as `target`, `onClick` and `ref`, go to the `<a>` element.
 *
 * @summary A link to a page above the current one, or the current page, in breadcrumbs.
 * @experimental
 */
export function BreadcrumbItem({ href, render, current, className, style, slotProps, children, ...linkProps }: BreadcrumbItemProps) {
    const ownerState: BreadcrumbItemOwnerState = { current: Boolean(current) };

    return (
        <li className={clsx(styles.root, className)} style={style} data-current={ownerState.current ? "" : undefined}>
            <SlotElement
                tagName="span"
                {...resolveSlotProps({ ownProps: { className: styles.separator, "aria-hidden": true }, slotProps: slotProps?.separator, ownerState })}
            >
                <Icon name="chevron-right" />
            </SlotElement>
            <SlotElement
                tagName="a"
                {...resolveSlotProps({
                    ownProps: ownerState.current
                        ? { ...linkProps, "aria-current": "page", className: styles.link }
                        : { ...linkProps, href, render, className: styles.link },
                    slotProps: slotProps?.link,
                    ownerState,
                })}
            >
                {children}
            </SlotElement>
        </li>
    );
}
