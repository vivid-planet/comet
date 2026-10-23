"use client";

import { clsx } from "clsx";
import type { ComponentPropsWithRef, CSSProperties, ReactNode } from "react";

import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Breadcrumbs.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior. The breadcrumbs have no
 * such configuration, so it is empty: `slotProps` functions receive it to work like in the other components.
 *
 * @experimental
 */
export type BreadcrumbsOwnerState = Record<string, never>;

/** @experimental */
export interface BreadcrumbsSlotProps {
    /** The `<ol>` element that holds `children`. */
    list?: SlotProps<ElementSlotProps<"ol">, BreadcrumbsOwnerState>;
}

/** @experimental */
export interface BreadcrumbsProps extends Omit<ComponentPropsWithRef<"nav">, "className" | "style" | "children" | "aria-label"> {
    /**
     * The breadcrumbs' accessible name, which screen readers announce with the navigation landmark, for example
     * "Breadcrumb". Screen readers add "navigation" themselves, so don't repeat it in the name.
     */
    label: string;
    /**
     * The pages from the top of the hierarchy down to the current page, as `BreadcrumbItem` elements. Mark the
     * last one, the current page, with `current`.
     */
    children?: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the `<nav>` element. */
    style?: CSSProperties;
    /** Props for the inner part: `list`, the `<ol>` element. As a function, it receives the owner state, which is empty. */
    slotProps?: BreadcrumbsSlotProps;
}

/**
 * Shows where the current page sits in the application's hierarchy, as a trail of links from the top level
 * down to the current page, for example "Products › Shoes › Running shoe". Users follow a link to go up
 * several levels at once.
 *
 * Put it above the page's title, with a `BreadcrumbItem` for each level: links for the pages above, and the
 * current page last, marked with `current`. Name each page the way its own title or the navigation names it.
 * Leave the breadcrumbs out on the top level, where they would only show the current page.
 *
 * A chevron separates the items. They wrap onto further lines when space runs out.
 *
 * It renders a `<nav>` landmark named by `label`, with an ordered list of the items, so screen readers
 * announce how many levels there are. The current page has `aria-current="page"`.
 *
 * The props the component doesn't handle, such as `id` and `aria-*`, go to the `<nav>` element.
 *
 * @summary A trail of links from the top of the hierarchy down to the current page.
 * @experimental
 */
export function Breadcrumbs({ label, className, slotProps, children, ...navProps }: BreadcrumbsProps) {
    const ownerState: BreadcrumbsOwnerState = {};

    return (
        <nav {...navProps} aria-label={label} className={clsx(styles.root, className)}>
            <SlotElement tagName="ol" {...resolveSlotProps({ ownProps: { className: styles.list }, slotProps: slotProps?.list, ownerState })}>
                {children}
            </SlotElement>
        </nav>
    );
}
