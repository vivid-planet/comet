"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import styles from "./TabPanel.module.css";
import type { TabsOrientation } from "./Tabs";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type TabPanelOwnerState = {
    /**
     * The `orientation` of the enclosing `Tabs`: beside a column of tabs, the panel takes the remaining width,
     * and it moves below the column where too little width remains.
     */
    orientation: TabsOrientation;
};

/** @experimental */
export interface TabPanelProps extends Omit<BaseTabs.Panel.Props, "className" | "style" | "render" | "children" | "value"> {
    /** The `value` of the `Tab` that shows this panel. */
    value: BaseTabs.Tab.Value;
    /** The panel's content. */
    children?: ReactNode;
    /** Added to the component's own classes. */
    className?: string;
    /** Inline styles for the panel. */
    style?: CSSProperties;
}

/**
 * The content of one tab of `Tabs`, shown while the `Tab` with the same `value` is selected. Put one panel per
 * tab into `Tabs`, after the `TabList`.
 *
 * The tab names the panel for assistive technology. A hidden panel isn't rendered, so its content doesn't load
 * until its tab is selected; set `keepMounted` to keep it, for example to keep a form's entries while the user
 * looks at another tab. The panel doesn't add space around its content: lay the content out yourself.
 *
 * The props the component doesn't handle go to the element with the `tabpanel` role.
 *
 * @summary The content of one tab, shown while the tab is selected.
 * @experimental
 */
export function TabPanel({ className, style, children, ...panelProps }: TabPanelProps) {
    return (
        <BaseTabs.Panel {...panelProps} className={clsx(styles.root, className)} style={style}>
            {children}
        </BaseTabs.Panel>
    );
}
