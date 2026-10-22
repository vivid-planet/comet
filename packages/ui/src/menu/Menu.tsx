"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { clsx } from "clsx";
import { type CSSProperties, type ReactElement, type ReactNode, useRef, useState } from "react";

import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { usePopupTheme } from "../themeSwitch/usePopupTheme";
import styles from "./Menu.module.css";

/** @experimental */
export type MenuSide = "bottom" | "top" | "inline-start" | "inline-end";

/** @experimental */
export type MenuAlign = "start" | "center" | "end";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type MenuOwnerState = {
    side: MenuSide;
    align: MenuAlign;
};

/** @experimental */
export interface MenuSlotProps {
    /**
     * The element that positions the menu against the trigger. Its props, such as `sideOffset` and
     * `collisionPadding`, change where the menu opens. It carries the theme of a `ThemeSwitch` around the
     * trigger.
     */
    positioner?: SlotProps<BaseMenu.Positioner.Props, MenuOwnerState>;
}

type MenuRootProps = BaseMenu.Root.Props;

/** @experimental */
export interface MenuProps extends Omit<BaseMenu.Popup.Props, "className" | "style" | "render" | "children"> {
    /**
     * The button that opens the menu, such as a `Button`, an `IconButton` or an `AppBarButton`. Clicking it,
     * or pressing Enter, Space or the arrow down key while it has focus, opens the menu. The menu adds its
     * event handlers and ARIA attributes to it, so it must be a component that passes its props and `ref` on
     * to a `<button>`, as the package's buttons do.
     */
    trigger: ReactElement;
    /** The menu's content: `MenuItem`, `MenuLinkItem`, `MenuGroup` and `MenuSeparator` elements. */
    children?: ReactNode;
    /**
     * The side of the trigger the menu opens on. It opens on the other side when there's no room.
     * `inline-start` and `inline-end` follow the writing direction: left and right in a left-to-right page.
     *
     * @defaultValue `"bottom"`
     */
    side?: MenuSide;
    /**
     * How the menu lines up with the trigger along `side`: with its start edge, its center or its end edge.
     * Use `end` for a trigger at the end of a bar, such as a user menu, so the menu opens towards the page.
     *
     * @defaultValue `"start"`
     */
    align?: MenuAlign;
    /** Prevents opening the menu and dims the trigger. */
    disabled?: boolean;
    /**
     * Whether the menu is open, to control it together with `onOpenChange`, for example to load the items when
     * it opens. Leave it out to let the menu open and close by itself.
     */
    open?: boolean;
    /** Whether the menu is open initially, for a menu that opens and closes by itself. */
    defaultOpen?: boolean;
    /**
     * Called when the menu is about to open or close, with the new state and the details of the event, such as
     * its `reason`.
     */
    onOpenChange?: MenuRootProps["onOpenChange"];
    /** Called after the menu has opened or closed, once its animation has finished, with the new state. */
    onOpenChangeComplete?: MenuRootProps["onOpenChangeComplete"];
    /**
     * Whether the menu blocks interaction with the rest of the page while it is open, so that a click outside
     * the menu only closes it. Set it to `false` for a menu that leaves the page usable.
     *
     * @defaultValue `true`
     */
    modal?: boolean;
    /** A ref to the menu's imperative actions, such as `close()`, which closes the menu. */
    actionsRef?: MenuRootProps["actionsRef"];
    /** Added to the component's own classes on the popup, the surface with the `menu` role. */
    className?: string;
    /** Inline styles for the popup, the surface with the `menu` role. */
    style?: CSSProperties;
    /**
     * Props for the inner part: `positioner`, the element that positions the popup. As a function, it receives
     * the owner state: `side` and `align`.
     */
    slotProps?: MenuSlotProps;
}

/**
 * A list of actions that opens from a button, such as the actions for a table row or the user menu of an
 * application. The menu takes little space until it's needed: use it for actions that don't need to be visible
 * all the time. Keep the main action of a view visible as a `Button` instead.
 *
 * Pass the button that opens the menu as `trigger`, and the actions as `MenuItem` children; use `MenuLinkItem`
 * for items that navigate. Order the items by frequency or by workflow, group related ones with `MenuGroup` or
 * `MenuSeparator`, and put destructive actions last, with `tone="danger"`.
 *
 * Clicking the trigger, or pressing Enter, Space or the arrow down key while it has focus, opens the menu. The
 * arrow keys move through the items, typing the first letters of an item highlights it, Enter or Space
 * activates it and closes the menu, and Escape closes it without an action; focus then returns to the trigger.
 * Clicking outside the menu closes it too. While open, the menu blocks interaction with the rest of the page;
 * set `modal={false}` for a menu that leaves the page usable.
 *
 * The menu opens in a layer above the page, also above dialogs, so it isn't clipped by containers. It renders at
 * the end of `<body>`, and inside a `ThemeSwitch` it takes the theme and color scheme of the theme switch around
 * its trigger. Screen readers announce the trigger as a button that opens a menu, and the menu by the trigger's
 * accessible name.
 *
 * The props the component doesn't handle, such as `id`, `aria-label` and `finalFocus`, go to the popup.
 *
 * @summary A list of actions that opens from a button.
 * @experimental
 */
export function Menu({
    trigger,
    side = "bottom",
    align = "start",
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    modal = true,
    actionsRef,
    disabled,
    className,
    slotProps,
    children,
    ...popupProps
}: MenuProps) {
    const ownerState: MenuOwnerState = { side, align };
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
    const popupTheme = usePopupTheme(triggerRef, open ?? isOpen);

    return (
        <BaseMenu.Root
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={(nextOpen, eventDetails) => {
                onOpenChange?.(nextOpen, eventDetails);
                if (!eventDetails.isCanceled) {
                    setIsOpen(nextOpen);
                }
            }}
            onOpenChangeComplete={onOpenChangeComplete}
            modal={modal}
            actionsRef={actionsRef}
            disabled={disabled}
        >
            <BaseMenu.Trigger ref={triggerRef} render={trigger} />
            <BaseMenu.Portal>
                <BaseMenu.Positioner
                    {...resolveSlotProps({
                        ownProps: { ...popupTheme, className: styles.positioner, side, align, sideOffset: 4 },
                        slotProps: slotProps?.positioner,
                        ownerState,
                    })}
                >
                    <BaseMenu.Popup {...popupProps} className={clsx(styles.root, className)}>
                        {children}
                    </BaseMenu.Popup>
                </BaseMenu.Positioner>
            </BaseMenu.Portal>
        </BaseMenu.Root>
    );
}
