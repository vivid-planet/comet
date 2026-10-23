"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import styles from "./Tabs.module.css";
import { TabsOrientationContext } from "./tabsContext";

/** @experimental */
export type TabsOrientation = "horizontal" | "vertical";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type TabsOwnerState = {
    orientation: TabsOrientation;
};

/** @experimental */
export interface TabsProps extends Omit<
    BaseTabs.Root.Props,
    "className" | "style" | "render" | "children" | "orientation" | "value" | "defaultValue" | "onValueChange"
> {
    /**
     * The value of the tab that is selected at first, while `value` doesn't control the selection. Set it, or
     * `value`, to a tab's value: without either, the first enabled tab is only selected once the tabs are in the
     * browser, so a server-rendered page shows no panel at first, and `onValueChange` reports that selection.
     */
    defaultValue?: BaseTabs.Root.Props["defaultValue"];
    /**
     * The value of the selected tab, when the application controls the selection, for example from the URL.
     * Update it in `onValueChange`.
     */
    value?: BaseTabs.Root.Props["value"];
    /**
     * Called with a tab's value when the user selects it. It is also called when the selected tab becomes
     * disabled or is removed and another one is selected instead: `eventDetails.reason` is `"none"` for the
     * user's choice, and `"disabled"`, `"missing"` or `"initial"` for a selection the tabs made themselves.
     */
    onValueChange?: BaseTabs.Root.Props["onValueChange"];
    /**
     * How the tabs are laid out: `horizontal` puts the tabs in a row above the panels, `vertical` in a column
     * beside them. Use `vertical` for many tabs or long labels, such as the sections of a settings page. Where
     * the column leaves too little room for the panel, as on a phone, the panel moves below the column. The
     * arrow keys follow the orientation: left and right in a row, up and down in a column.
     *
     * @defaultValue `"horizontal"`
     */
    orientation?: TabsOrientation;
    /** One `TabList` with the tabs, and a `TabPanel` for each tab. */
    children?: ReactNode;
    /** Added to the component's own classes on the outer element, which holds the tab list and the panels. */
    className?: string;
    /** Inline styles for the outer element, which holds the tab list and the panels. */
    style?: CSSProperties;
}

/**
 * Switches between related views of the same subject on one page, such as the details, prices and stock of a
 * product, showing one panel at a time.
 *
 * Put a `TabList` with one `Tab` per view first, then a `TabPanel` for each tab with the same `value`. Label
 * the tabs with one or two words, and keep their order fixed. Use tabs only for content the user doesn't need
 * to compare side by side, and not for steps that follow each other: use a sequence of pages for those.
 *
 * Tab moves focus to the selected tab and from there into its panel; the arrow keys move focus between the
 * tabs, and Enter or Space selects the focused one. Set `defaultValue` or `value`, so the right panel shows
 * from the start, also on a server-rendered page.
 *
 * The props the component doesn't handle go to the outer element.
 *
 * @summary Tabs that switch between panels, in a row or in a column.
 * @experimental
 */
export function Tabs({ orientation = "horizontal", className, style, children, ...rootProps }: TabsProps) {
    const ownerState: TabsOwnerState = { orientation };

    return (
        <TabsOrientationContext value={ownerState.orientation}>
            <BaseTabs.Root {...rootProps} orientation={orientation} className={clsx(styles.root, className)} style={style}>
                {children}
            </BaseTabs.Root>
        </TabsOrientationContext>
    );
}
