"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { clsx } from "clsx";
import {
    type CSSProperties,
    type ReactElement,
    type ReactNode,
    type Ref,
    type RefCallback,
    type RefObject,
    useCallback,
    useRef,
    useState,
} from "react";

import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { usePopupTheme } from "../themeSwitch/usePopupTheme";
import styles from "./Tooltip.module.css";

/** @experimental */
export type TooltipSide = "top" | "bottom" | "inline-start" | "inline-end";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type TooltipOwnerState = {
    side: TooltipSide;
};

/** @experimental */
export interface TooltipSlotProps {
    /**
     * The popup, the element that holds `content`, which also receives `className` and `style`. Its other props,
     * such as `id`, go here.
     */
    popup?: SlotProps<BaseTooltip.Popup.Props, TooltipOwnerState>;
    /**
     * The element that positions the tooltip against the trigger. Its props, such as `sideOffset`, `align` and
     * `collisionPadding`, change where the tooltip opens. It carries the theme of a `ThemeSwitch` around the
     * trigger.
     */
    positioner?: SlotProps<BaseTooltip.Positioner.Props, TooltipOwnerState>;
    /** The arrow that points at the trigger, rendered only with `showArrow`. */
    arrow?: SlotProps<BaseTooltip.Arrow.Props, TooltipOwnerState>;
}

type TooltipRootProps = BaseTooltip.Root.Props;

type TooltipTriggerProps = BaseTooltip.Trigger.Props;

/** @experimental */
export interface TooltipProps
    extends
        Omit<TooltipTriggerProps, "className" | "style" | "render" | "children" | "ref" | "content" | "delay" | "disabled" | "handle" | "payload">,
        Pick<TooltipRootProps, "open" | "defaultOpen" | "onOpenChange" | "onOpenChangeComplete" | "disabled" | "actionsRef"> {
    /**
     * The tooltip's text: a few words that name the trigger, for example "Edit product", optionally with its
     * keyboard shortcut. Repeat the trigger's accessible name rather than adding information: screen reader and
     * touch users don't get the tooltip.
     */
    content: ReactNode;
    /**
     * The element the tooltip belongs to, such as an `IconButton`. Hovering it or focusing it with the keyboard
     * shows the tooltip. The tooltip adds its event handlers to it, so it must be a component that passes its
     * props and `ref` on to an element that can receive focus, as the package's buttons do.
     */
    children: ReactElement;
    /** A ref to the trigger, the element of `children`. A `ref` on `children` itself works too. */
    ref?: Ref<HTMLElement>;
    /**
     * The side of the trigger the tooltip opens on. It opens on the other side when there's no room.
     * `inline-start` and `inline-end` follow the writing direction: left and right in a left-to-right page.
     *
     * @defaultValue `"top"`
     */
    side?: TooltipSide;
    /**
     * How long the pointer has to rest on the trigger before the tooltip opens, in milliseconds. Focusing the
     * trigger with the keyboard opens it right away.
     *
     * @defaultValue The `delay` of an enclosing `TooltipProvider`, or `600`.
     */
    delay?: number;
    /** Shows an arrow that points at the trigger, for a tooltip that would otherwise be unclear about which element it belongs to. */
    showArrow?: boolean;
    /** Turns the tooltip off while its trigger stays usable, for example while a truncated text is shown in full. */
    disabled?: boolean;
    /** Added to the component's own classes on the popup, the element that holds `content`. */
    className?: string;
    /** Inline styles for the popup, the element that holds `content`. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `popup`, the element that holds `content`, `positioner`, the element that
     * positions the popup, and `arrow`. As a function, it receives the owner state: `side`.
     */
    slotProps?: TooltipSlotProps;
}

/**
 * A short label that appears next to an element while it is hovered or focused, for example to name an icon
 * button for sighted users or to show a keyboard shortcut.
 *
 * A tooltip is only a visual aid: it never holds an element's only accessible name or information the user
 * needs, because screen readers don't announce it and touch devices don't show it. Name the trigger itself,
 * and show the same text in the tooltip: an `IconButton` already has a `label`, so a tooltip with the same
 * text makes it clear to everyone. Put information that users need into the page, for example a field's
 * `description`, or into a popover that opens on click.
 *
 * Pass the trigger as `children` and the text as `content`. The tooltip opens after a short `delay` when the
 * pointer rests on the trigger, and right away when the trigger receives keyboard focus. It closes when the
 * pointer leaves, when focus moves on and on Escape. Wrap a group of triggers, such as a toolbar, in a
 * `TooltipProvider`, so that after the first tooltip the next ones open without a delay.
 *
 * A disabled button keeps its tooltip on hover, but keyboard focus only reaches it with
 * `focusableWhenDisabled`. So a disabled icon button stays named for sighted users, but don't rely on a
 * tooltip to explain why a button is disabled: say it on the page. Set `disabled` on the tooltip to turn it
 * off.
 *
 * The props the component doesn't handle, such as `id`, event handlers, ARIA attributes and `ref`, go to the
 * trigger, merged with the props of `children`. So a tooltip can be the trigger of a `Dialog` or a `Menu`:
 * pass the `Tooltip` with the button inside it as their `trigger`. Don't wrap a `Dialog` or a `Menu` in a
 * `Tooltip`: they pass the props they don't handle to their popup, not to their trigger.
 *
 * The tooltip renders at the end of `<body>`, on top of the page. Inside a `ThemeSwitch`, it takes the theme
 * and color scheme of the theme switch around its trigger.
 *
 * @summary A short label for an element, shown on hover and keyboard focus.
 * @experimental
 */
export function Tooltip({
    content,
    side = "top",
    delay,
    showArrow,
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    disabled,
    actionsRef,
    className,
    style,
    slotProps,
    ref,
    children,
    ...triggerProps
}: TooltipProps) {
    const ownerState: TooltipOwnerState = { side };
    const triggerRef = useRef<HTMLElement>(null);
    const mergedTriggerRef = useMergedRef(triggerRef, ref);
    const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
    const popupTheme = usePopupTheme(triggerRef, open ?? isOpen);

    return (
        <BaseTooltip.Root
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={(nextOpen, eventDetails) => {
                onOpenChange?.(nextOpen, eventDetails);
                if (!eventDetails.isCanceled) {
                    setIsOpen(nextOpen);
                }
            }}
            onOpenChangeComplete={onOpenChangeComplete}
            disabled={disabled}
            actionsRef={actionsRef}
        >
            <BaseTooltip.Trigger {...triggerProps} ref={mergedTriggerRef} delay={delay} render={children} />
            <BaseTooltip.Portal>
                <BaseTooltip.Positioner
                    {...resolveSlotProps({
                        ownProps: { ...popupTheme, className: styles.positioner, side, sideOffset: showArrow ? 10 : 6 },
                        slotProps: slotProps?.positioner,
                        ownerState,
                    })}
                >
                    <BaseTooltip.Popup
                        {...resolveSlotProps({
                            ownProps: { className: clsx(styles.root, className), style },
                            slotProps: slotProps?.popup,
                            ownerState,
                        })}
                    >
                        {showArrow && (
                            <BaseTooltip.Arrow
                                {...resolveSlotProps({ ownProps: { className: styles.arrow }, slotProps: slotProps?.arrow, ownerState })}
                            />
                        )}
                        {content}
                    </BaseTooltip.Popup>
                </BaseTooltip.Positioner>
            </BaseTooltip.Portal>
        </BaseTooltip.Root>
    );
}

/** A ref that sets both the component's own ref and the consumer's `ref` to the element. */
function useMergedRef<Instance>(ownRef: RefObject<Instance | null>, consumerRef: Ref<Instance> | undefined): RefCallback<Instance> {
    return useCallback(
        (instance: Instance | null) => {
            ownRef.current = instance;
            const consumerCleanup = setRef(consumerRef, instance);

            return () => {
                ownRef.current = null;
                if (typeof consumerCleanup === "function") {
                    consumerCleanup();
                } else {
                    setRef(consumerRef, null);
                }
            };
        },
        [ownRef, consumerRef],
    );
}

function setRef<Instance>(ref: Ref<Instance> | undefined, instance: Instance | null) {
    if (typeof ref === "function") {
        return ref(instance);
    }
    if (ref) {
        ref.current = instance;
    }
}
