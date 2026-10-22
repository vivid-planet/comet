"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { useRender } from "@base-ui/react/use-render";
import { clsx } from "clsx";
import { type CSSProperties, type ReactElement, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Icon } from "../icon/Icon";
import { IconButton } from "../iconButton/IconButton";
import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import { usePopupTheme } from "../themeSwitch/usePopupTheme";
import styles from "./Dialog.module.css";

/** @experimental */
export type DialogSize = "small" | "medium" | "large";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type DialogOwnerState = {
    size: DialogSize;
};

/** @experimental */
export interface DialogSlotProps {
    /**
     * The layer that dims the page behind the dialog. It only dims: clicks beside the dialog land on the
     * `viewport` above it. It carries the theme of a `ThemeSwitch` around the trigger.
     */
    backdrop?: SlotProps<BaseDialog.Backdrop.Props, DialogOwnerState>;
    /**
     * The element that covers the window above the backdrop and centers the dialog in it. A click on it, beside
     * the dialog, closes the dialog, unless `disablePointerDismissal` is set. It carries the theme of a
     * `ThemeSwitch` around the trigger.
     */
    viewport?: SlotProps<BaseDialog.Viewport.Props, DialogOwnerState>;
    /** The `<h2>` element that holds `title` and names the dialog. Replace it for another heading level, for example `{ render: <h3 /> }`. */
    title?: SlotProps<BaseDialog.Title.Props, DialogOwnerState>;
    /** The paragraph that holds `description`. Screen readers announce it together with the title. */
    description?: SlotProps<BaseDialog.Description.Props, DialogOwnerState>;
    /**
     * The element around `children`. It scrolls when the dialog doesn't fit into the window, and then has
     * `data-scrollable` and can receive focus, so keyboard users can scroll it too. Rendered only when there
     * are `children`.
     */
    body?: SlotProps<ElementSlotProps<"div">, DialogOwnerState>;
    /** The element around `actions`, at the bottom end of the dialog. Rendered only when there are `actions`. */
    actions?: SlotProps<ElementSlotProps<"div">, DialogOwnerState>;
    /** The close button in the top corner, rendered only when `closeLabel` is set. `render` replaces the icon button. */
    close?: SlotProps<BaseDialog.Close.Props, DialogOwnerState>;
}

type DialogRootProps = BaseDialog.Root.Props;

/** @experimental */
export interface DialogProps
    extends
        Omit<BaseDialog.Popup.Props, "className" | "style" | "render" | "children" | "title">,
        Pick<DialogRootProps, "open" | "defaultOpen" | "onOpenChange" | "onOpenChangeComplete" | "actionsRef" | "disablePointerDismissal"> {
    /**
     * The button that opens the dialog, such as a `Button`. Focus returns to it when the dialog closes. The
     * dialog adds its event handlers and ARIA attributes to it, so it must be a component that passes its props
     * and `ref` on to a `<button>`, as the package's buttons do. A `Tooltip` does too: for an icon button with
     * a tooltip, pass the `Tooltip` with the icon button inside it, not a `Tooltip` around the `Dialog`. Leave
     * it out for a dialog that opens otherwise, for example from a menu item, and control it with `open` and
     * `onOpenChange`.
     */
    trigger?: ReactElement;
    /**
     * The title, which names the dialog for assistive technology too. Phrase it as the task or the question,
     * for example "Edit product" or "Delete product?".
     */
    title: ReactNode;
    /**
     * A short text below the title that explains the task or the consequence of the decision, for example
     * "You can't undo this.". Screen readers announce it when the dialog opens.
     */
    description?: ReactNode;
    /**
     * The content below the title and the description, such as form fields. It scrolls when the dialog doesn't
     * fit into the window, while the title and the actions stay visible.
     */
    children?: ReactNode;
    /**
     * The buttons at the bottom end of the dialog, such as "Cancel" and "Save". Put the main action last, as a
     * primary `Button`, and wrap a button that only closes the dialog in a `DialogClose`.
     */
    actions?: ReactNode;
    /**
     * The accessible name of a close button with a cross in the top corner, for example "Close". The button is
     * only shown when the label has text. Add it to a dialog without a "Cancel" or "Close" action, so touch
     * screen reader users, who can't press Escape, can leave it.
     */
    closeLabel?: string;
    /**
     * The dialog's width: `small` for a confirmation, `medium` for a form, `large` for wide content, such as a
     * table. On a narrow screen, the dialog takes the window's width.
     *
     * @defaultValue `"medium"`
     */
    size?: DialogSize;
    /**
     * Keeps the dialog open when the user clicks beside it, for example for a form whose input would be lost.
     * Escape and the dialog's own buttons still close it.
     */
    disablePointerDismissal?: boolean;
    /** Added to the component's own classes on the popup, the surface with the `dialog` role. */
    className?: string;
    /** Inline styles for the popup, the surface with the `dialog` role. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `backdrop`, `viewport`, `title`, `description`, `body` (the element around
     * `children`), `actions` and `close` (the close button). As a function, it receives the owner state: `size`.
     */
    slotProps?: DialogSlotProps;
}

/**
 * A modal dialog that opens on top of the page for a short task the user completes or cancels before going on,
 * such as confirming a destructive action or editing a few fields of an item. The page behind it stays where
 * it is, so the user returns to it afterwards.
 *
 * Use a page instead of a dialog for long or multi-step forms, for content that people want to link to or
 * keep open next to other work, and for anything that needs more room than a small screen offers. Don't open
 * a dialog from a dialog if the second one could be part of the first.
 *
 * Give the dialog a `title` that names the task, a `description` where the consequence needs explaining, the
 * content as `children` and the buttons as `actions`, with the main action last. Pass the button that opens
 * it as `trigger`, or control it with `open` and `onOpenChange`, for example to close it after a form is
 * saved. To give the trigger a tooltip, pass the `Tooltip` as `trigger`, with the button inside it. Wrap a
 * button that only closes the dialog, such as "Cancel", in a `DialogClose`.
 *
 * While the dialog is open, the page behind it is inert and doesn't scroll. Focus moves to the first element
 * in the dialog that can receive focus, stays inside it, and returns to the trigger when the dialog closes.
 * Escape and clicking beside the dialog close it. Screen readers announce the dialog with its title and
 * description.
 *
 * The dialog renders at the end of `<body>`, on top of the page. Inside a `ThemeSwitch`, it takes the theme and
 * color scheme of the theme switch around its trigger, or, without a `trigger`, around the element that had
 * focus when it opened.
 *
 * The props the component doesn't handle, such as `id`, `initialFocus` and `finalFocus`, go to the popup.
 *
 * @summary A modal dialog with a title, a description, content and actions.
 * @experimental
 */
export function Dialog({
    trigger,
    title,
    description,
    actions,
    closeLabel,
    size = "medium",
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    actionsRef,
    disablePointerDismissal,
    className,
    slotProps,
    children,
    ...popupProps
}: DialogProps) {
    const ownerState: DialogOwnerState = { size };
    const triggerRef = useRef<HTMLButtonElement>(null);
    const themeSourceRef = useRef<Element | null>(null);
    const [trackedOpen, setTrackedOpen] = useState(Boolean(defaultOpen));
    const isOpen = open ?? trackedOpen;

    // Declared before usePopupTheme, so it runs first, and before Base UI moves focus into the dialog a microtask later.
    useLayoutEffect(() => {
        if (isOpen) {
            themeSourceRef.current = triggerRef.current ?? document.activeElement;
        }
    }, [isOpen]);
    const popupTheme = usePopupTheme(themeSourceRef, isOpen);

    return (
        <BaseDialog.Root
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={(nextOpen, eventDetails) => {
                onOpenChange?.(nextOpen, eventDetails);
                if (!eventDetails.isCanceled) {
                    setTrackedOpen(nextOpen);
                }
            }}
            onOpenChangeComplete={onOpenChangeComplete}
            actionsRef={actionsRef}
            disablePointerDismissal={disablePointerDismissal}
        >
            {trigger !== undefined && <BaseDialog.Trigger ref={triggerRef} render={trigger} />}
            <BaseDialog.Portal>
                <BaseDialog.Backdrop
                    {...resolveSlotProps({ ownProps: { ...popupTheme, className: styles.backdrop }, slotProps: slotProps?.backdrop, ownerState })}
                />
                <BaseDialog.Viewport
                    {...resolveSlotProps({ ownProps: { ...popupTheme, className: styles.viewport }, slotProps: slotProps?.viewport, ownerState })}
                >
                    <BaseDialog.Popup {...popupProps} data-size={size} className={clsx(styles.root, className)}>
                        <BaseDialog.Title {...resolveSlotProps({ ownProps: { className: styles.title }, slotProps: slotProps?.title, ownerState })}>
                            {title}
                        </BaseDialog.Title>
                        {hasContent(description) && (
                            <BaseDialog.Description
                                {...resolveSlotProps({ ownProps: { className: styles.description }, slotProps: slotProps?.description, ownerState })}
                            >
                                {description}
                            </BaseDialog.Description>
                        )}
                        {hasContent(children) && (
                            <DialogBody {...resolveSlotProps({ ownProps: { className: styles.body }, slotProps: slotProps?.body, ownerState })}>
                                {children}
                            </DialogBody>
                        )}
                        {hasContent(actions) && (
                            <SlotElement
                                tagName="div"
                                {...resolveSlotProps({ ownProps: { className: styles.actions }, slotProps: slotProps?.actions, ownerState })}
                            >
                                {actions}
                            </SlotElement>
                        )}
                        {/* Last in the focus order, so focus moves to the content or the actions first when the dialog opens. */}
                        {closeLabel ? (
                            <BaseDialog.Close
                                {...resolveSlotProps({
                                    ownProps: {
                                        className: styles.close,
                                        render: (
                                            <IconButton label={closeLabel} size="small">
                                                <Icon name="close" />
                                            </IconButton>
                                        ),
                                    },
                                    slotProps: slotProps?.close,
                                    ownerState,
                                })}
                            />
                        ) : null}
                    </BaseDialog.Popup>
                </BaseDialog.Viewport>
            </BaseDialog.Portal>
        </BaseDialog.Root>
    );
}

function DialogBody({ render, ...props }: ElementSlotProps<"div">) {
    const [element, setElement] = useState<Element | null>(null);
    const isScrollable = useIsScrollable(element);

    return useRender({
        defaultTagName: "div",
        render,
        ref: setElement,
        props: { tabIndex: isScrollable ? 0 : undefined, "data-scrollable": isScrollable ? "" : undefined, ...props },
    });
}

/** Whether an element's content overflows it, so that it scrolls. */
function useIsScrollable(element: Element | null) {
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        if (element === null || typeof ResizeObserver === "undefined") {
            return;
        }

        const observedElement = element;
        const resizeObserver = new ResizeObserver(update);
        const mutationObserver = new MutationObserver(update);

        function update() {
            // The children's sizes change without the element's once it has reached its maximum height.
            for (const child of observedElement.children) {
                resizeObserver.observe(child);
            }
            // Ignores a pixel of overflow from rounding.
            setIsScrollable(
                observedElement.scrollHeight - observedElement.clientHeight > 1 || observedElement.scrollWidth - observedElement.clientWidth > 1,
            );
        }

        resizeObserver.observe(observedElement);
        mutationObserver.observe(observedElement, { childList: true, subtree: true, characterData: true });

        return () => {
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        };
    }, [element]);

    return isScrollable;
}
