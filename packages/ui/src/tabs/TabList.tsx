"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { clsx } from "clsx";
import { type CSSProperties, type ReactNode, use } from "react";

import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./TabList.module.css";
import type { TabsOrientation } from "./Tabs";
import { TabsOrientationContext } from "./tabsContext";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type TabListOwnerState = {
    /** The `orientation` of the enclosing `Tabs`. */
    orientation: TabsOrientation;
};

/** @experimental */
export interface TabListSlotProps {
    /**
     * The line in the primary color that marks the selected tab: under it in a row, at its end in a column. It
     * moves to the tab the user selects.
     */
    indicator?: SlotProps<BaseTabs.Indicator.Props, TabListOwnerState>;
}

/** @experimental */
export interface TabListProps extends Omit<BaseTabs.List.Props, "className" | "style" | "render" | "children" | "aria-label"> {
    /**
     * The tab list's accessible name, which screen readers announce when focus moves into the tabs, for example
     * "Product". Give every tab list of a page its own name. Screen readers add "tab list" themselves, so don't
     * repeat it in the name. When a visible heading names the tabs, also pass its id in `aria-labelledby`,
     * which takes precedence.
     */
    label: string;
    /** The tabs, as `Tab` elements. */
    children?: ReactNode;
    /** Added to the component's own classes on the element with the `tablist` role. */
    className?: string;
    /** Inline styles for the element with the `tablist` role. */
    style?: CSSProperties;
    /** Props for the inner part: `indicator`. As a function, it receives the owner state: `orientation`. */
    slotProps?: TabListSlotProps;
}

/**
 * The tabs of `Tabs`, on a line that separates them from the panels. Use it once, as the first child of
 * `Tabs`, and put the `Tab` elements into it.
 *
 * Name the list with `label`, so screen reader users know what the tabs are about and can tell the list apart
 * from other tab lists on the page. Tabs that don't fit in a row scroll sideways instead of wrapping: keep
 * their number small, so all of them are visible on most screens.
 *
 * On a server-rendered page, the indicator appears once the tabs are in the browser. To show it from the
 * start, set `slotProps={{ indicator: { renderBeforeHydration: true } }}`. This renders an inline script,
 * which a strict Content Security Policy blocks unless it gets a nonce, for example from Base UI's
 * `CSPProvider`.
 *
 * The props the component doesn't handle, such as `activateOnFocus` and `aria-labelledby`, go to the element
 * with the `tablist` role.
 *
 * @summary The row or column of tabs in `Tabs`, with the line that marks the selected tab.
 * @experimental
 */
export function TabList({ label, className, style, slotProps, children, ...listProps }: TabListProps) {
    const ownerState: TabListOwnerState = { orientation: use(TabsOrientationContext) };

    return (
        <BaseTabs.List {...listProps} aria-label={label} className={clsx(styles.root, className)} style={style}>
            {children}
            <BaseTabs.Indicator {...resolveSlotProps({ ownProps: { className: styles.indicator }, slotProps: slotProps?.indicator, ownerState })} />
        </BaseTabs.List>
    );
}
