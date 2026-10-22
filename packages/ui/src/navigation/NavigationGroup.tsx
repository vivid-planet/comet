"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { clsx } from "clsx";
import { type ComponentPropsWithRef, type CSSProperties, type ReactNode, use, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Icon } from "../icon/Icon";
import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { NavigationContext } from "./navigationContext";
import styles from "./NavigationGroup.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type NavigationGroupOwnerState = {
    /** How deeply the group is nested: `1` directly in `Navigation`, `2` inside another group, and so on. Its items are one level deeper. */
    level: number;
};

/** @experimental */
export interface NavigationGroupSlotProps {
    /** The `<button>` element that opens and closes the group. It holds `icon`, `label` and `indicator`. */
    trigger?: SlotProps<Collapsible.Trigger.Props, NavigationGroupOwnerState>;
    /** The element around `icon`. */
    icon?: SlotProps<ElementSlotProps<"span">, NavigationGroupOwnerState>;
    /** The chevron at the end of the trigger, which turns over while the group is open. */
    indicator?: SlotProps<ElementSlotProps<"span">, NavigationGroupOwnerState>;
    /**
     * The `<ul>` element that holds `children`. It stays in the document while the group is closed, so the
     * browser's find in page finds the items and opens the group.
     */
    panel?: SlotProps<Collapsible.Panel.Props, NavigationGroupOwnerState>;
}

/** @experimental */
export interface NavigationGroupProps extends Omit<ComponentPropsWithRef<"li">, "className" | "style" | "children"> {
    /** The group's visible name on the button that opens and closes it, for example "Catalog". */
    label: ReactNode;
    /** An icon before the label, like the icons of the items next to the group. It is decorative: the label names the group. */
    icon?: ReactNode;
    /** The group's entries: `NavigationItem` elements, and `NavigationGroup` elements for a further level. */
    children?: ReactNode;
    /**
     * Whether the group is open initially. Without it, the group is closed until it contains the active item.
     * On a server-rendered page, set it on the group that contains the active item, so that the group is open
     * in the server's HTML too.
     */
    defaultOpen?: boolean;
    /**
     * Whether the group is open, to control it together with `onOpenChange`. A controlled group doesn't open by
     * itself when it contains the active item.
     */
    open?: boolean;
    /** Called when the user opens or closes the group, with the new state. */
    onOpenChange?: Collapsible.Root.Props["onOpenChange"];
    /** Added to the component's own classes on the outer `<li>` element, which holds the trigger and the panel. */
    className?: string;
    /** Inline styles for the outer `<li>` element, which holds the trigger and the panel. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `trigger` (the button), `icon`, `indicator` (the chevron) and `panel` (the
     * list of entries). As a function, it receives the owner state: `level`.
     */
    slotProps?: NavigationGroupSlotProps;
}

/**
 * A group of related pages in a `Navigation`, such as "Catalog" with "Products" and "Categories", which the
 * user opens and closes. Use it only as a child of `Navigation` or of another `NavigationGroup`, to keep a
 * long navigation short. Avoid more than one further level: deep trees are hard to scan.
 *
 * Name the group with `label` and put its `NavigationItem` elements into it; they are indented below the
 * label. The group opens by itself while it contains the active item, so the current page stays visible.
 * Clicking the group, or pressing Enter or Space while it has focus, opens or closes it; Tab skips the items
 * of a closed group.
 *
 * It renders a list item with a `<button>` that has `aria-expanded`, so screen readers announce whether the
 * group is open, and a nested list of the entries.
 *
 * The props the component doesn't handle, such as `id` and `ref`, go to the outer `<li>` element.
 *
 * @summary A group of pages in the application's navigation that opens and closes.
 * @experimental
 */
export function NavigationGroup({
    label,
    icon,
    defaultOpen = false,
    open,
    onOpenChange,
    className,
    style,
    slotProps,
    children,
    ...rootProps
}: NavigationGroupProps) {
    const { level, revealActiveItem: revealInParentGroups } = use(NavigationContext);
    const ownerState: NavigationGroupOwnerState = { level };
    const isControlled = open !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const [isTransitionSkipped, setIsTransitionSkipped] = useState(false);
    const isMountedRef = useRef(false);

    // Runs after the layout effects of the items, which reveal the active item while the group mounts. The reset
    // lets a remount, such as StrictMode's in development, skip the transition too.
    useLayoutEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const revealActiveItem = useCallback(() => {
        if (!isControlled) {
            // Opening without a transition while the page loads keeps the content below from shifting.
            setIsTransitionSkipped(!isMountedRef.current);
            setUncontrolledOpen(true);
        }
        revealInParentGroups?.();
    }, [isControlled, revealInParentGroups]);
    const contextValue = useMemo(() => ({ level: level + 1, revealActiveItem }), [level, revealActiveItem]);

    const handleOpenChange: Collapsible.Root.Props["onOpenChange"] = (nextOpen, eventDetails) => {
        onOpenChange?.(nextOpen, eventDetails);
        if (!isControlled && !eventDetails.isCanceled) {
            setIsTransitionSkipped(false);
            setUncontrolledOpen(nextOpen);
        }
    };
    const transitionStyle = isTransitionSkipped ? { transitionDuration: "0s" } : undefined;

    return (
        <Collapsible.Root
            open={isControlled ? open : uncontrolledOpen}
            onOpenChange={handleOpenChange}
            render={
                <li
                    {...rootProps}
                    data-level={level}
                    className={clsx(styles.root, className)}
                    style={{ "--_level": level, ...style } as CSSProperties}
                />
            }
        >
            <Collapsible.Trigger {...resolveSlotProps({ ownProps: { className: styles.trigger }, slotProps: slotProps?.trigger, ownerState })}>
                {hasContent(icon) && (
                    <SlotElement
                        tagName="span"
                        {...resolveSlotProps({ ownProps: { className: styles.icon, "aria-hidden": true }, slotProps: slotProps?.icon, ownerState })}
                    >
                        {icon}
                    </SlotElement>
                )}
                {label}
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({
                        ownProps: { className: styles.indicator, "aria-hidden": true, style: transitionStyle },
                        slotProps: slotProps?.indicator,
                        ownerState,
                    })}
                >
                    <Icon name="chevron-down" />
                </SlotElement>
            </Collapsible.Trigger>
            <NavigationContext value={contextValue}>
                <Collapsible.Panel
                    {...resolveSlotProps({
                        ownProps: { className: styles.panel, hiddenUntilFound: true, render: <ul />, style: transitionStyle },
                        slotProps: slotProps?.panel,
                        ownerState,
                    })}
                >
                    {children}
                </Collapsible.Panel>
            </NavigationContext>
        </Collapsible.Root>
    );
}
