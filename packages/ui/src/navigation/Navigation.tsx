"use client";

import { clsx } from "clsx";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";

import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Navigation.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior. The navigation has no
 * such configuration, so it is empty: `slotProps` functions receive it to work like in the other components.
 *
 * @experimental
 */
export type NavigationOwnerState = Record<string, never>;

/** @experimental */
export interface NavigationSlotProps {
    /** The `<ul>` element that holds `children`. */
    list?: SlotProps<ElementSlotProps<"ul">, NavigationOwnerState>;
}

/** @experimental */
export interface NavigationProps extends Omit<ComponentPropsWithRef<"nav">, "className" | "style" | "children" | "aria-label"> {
    /**
     * The navigation's accessible name, which screen readers announce with the navigation landmark, for
     * example "Main". Give every navigation of a page its own name. Screen readers add "navigation"
     * themselves, so don't repeat it in the name.
     */
    label: string;
    /** The entries from top to bottom: `NavigationItem` elements, and `NavigationGroup` elements for groups of pages. */
    children?: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the `<nav>` element. */
    style?: CSSProperties;
    /** Props for the inner part: `list`, the `<ul>` element. As a function, it receives the owner state, which is empty. */
    slotProps?: NavigationSlotProps;
}

/**
 * The main navigation of an application: a vertical list of links to its pages, for a sidebar next to the
 * page content. Use one per application, on every page.
 *
 * Put a `NavigationItem` into it for each page, and gather related pages in a `NavigationGroup`, which the
 * user opens and closes. Mark the item of the current page with `active`. Name the pages in a word or two,
 * and order them by importance, most used first.
 *
 * The navigation fills the width of its container and grows with its entries. The application lays out the
 * sidebar: it decides the width, makes it scroll when the entries don't fit, and hides it behind a button on
 * small screens.
 *
 * It renders a `<nav>` landmark named by `label`, so screen reader users can jump to it, with a list of the
 * entries, so they hear how many there are. Tab moves through the links and the groups in order.
 *
 * The props the component doesn't handle, such as `id` and `aria-*`, go to the `<nav>` element.
 *
 * @summary The application's main navigation: a vertical list of links, optionally in groups.
 * @experimental
 */
export function Navigation({ label, className, slotProps, children, ...navProps }: NavigationProps) {
    const ownerState: NavigationOwnerState = {};

    return (
        <nav {...navProps} aria-label={label} className={clsx(styles.root, className)}>
            <SlotElement tagName="ul" {...resolveSlotProps({ ownProps: { className: styles.list }, slotProps: slotProps?.list, ownerState })}>
                {children}
            </SlotElement>
        </nav>
    );
}
