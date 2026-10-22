"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, use } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Tab.module.css";
import type { TabsOrientation } from "./Tabs";
import { TabsOrientationContext } from "./tabsContext";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type TabOwnerState = {
    /** The `orientation` of the enclosing `Tabs`. */
    orientation: TabsOrientation;
    disabled: boolean;
};

/** @experimental */
export interface TabSlotProps {
    /** The element around `icon`. */
    icon?: SlotProps<ElementSlotProps<"span">, TabOwnerState>;
}

/** @experimental */
export interface TabProps extends Omit<BaseTabs.Tab.Props, "className" | "style" | "render" | "nativeButton" | "children" | "disabled" | "value"> {
    /**
     * Identifies the tab: the `TabPanel` with the same value shows while the tab is selected, and `Tabs`
     * reports it in `onValueChange`. Unique within the tabs.
     */
    value: BaseTabs.Tab.Value;
    /** The visible label, which names the tab. Keep it to one or two words, for example "Pricing". */
    children: ReactNode;
    /** An icon before the label. It is decorative: the label names the tab. */
    icon?: ReactNode;
    /**
     * Prevents selecting the tab and dims it. The arrow keys still reach it, so screen reader users learn that
     * it exists. Prefer leaving out a tab that never applies, and say why one is disabled, for example in the
     * selected panel.
     */
    disabled?: boolean;
    /**
     * Replaces the `<button>`, for example with a link for tabs that each have their own URL:
     * `render={<a href="/products/42/pricing" />}`, together with `nativeButton={false}`. Then select the tab
     * of the current URL with `value` on `Tabs`. A function receives the props to spread and Base UI's state.
     */
    render?: BaseTabs.Tab.Props["render"];
    /**
     * Whether `render` renders a `<button>`. Set it to `false` when `render` renders another element, such as a
     * link, so the tab still works with the keyboard.
     *
     * @defaultValue `true`
     */
    nativeButton?: boolean;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the tab. */
    style?: CSSProperties;
    /** Props for the inner part: `icon`. As a function, it receives the owner state: `orientation` and `disabled`. */
    slotProps?: TabSlotProps;
}

/**
 * One tab of a `TabList`, which selects the `TabPanel` with the same `value`. Use it only inside a `TabList`.
 *
 * Pass the label as `children`, in one or two words, and keep the labels parallel, for example "Overview",
 * "Pricing" and "Inventory". An `icon` supports the label; it doesn't replace it. For tabs that navigate to
 * their own URL, render a link with `render` and `nativeButton={false}`.
 *
 * The props the component doesn't handle, such as `onClick` and `aria-*`, go to the element with the `tab`
 * role, a `<button>` unless `render` replaces it.
 *
 * @summary One tab of a `TabList`, with a label and an optional icon.
 * @experimental
 */
export function Tab({ icon, disabled, className, style, slotProps, children, ...tabProps }: TabProps) {
    const ownerState: TabOwnerState = { orientation: use(TabsOrientationContext), disabled: Boolean(disabled) };

    return (
        <BaseTabs.Tab {...tabProps} disabled={disabled} className={clsx(styles.root, className)} style={style}>
            {hasContent(icon) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({ ownProps: { className: styles.icon, "aria-hidden": true }, slotProps: slotProps?.icon, ownerState })}
                >
                    {icon}
                </SlotElement>
            )}
            {children}
        </BaseTabs.Tab>
    );
}
