"use client";

import { clsx } from "clsx";
import type { AriaRole, CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";

import { Icon } from "../icon/Icon";
import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Alert.module.css";

/** @experimental */
export type AlertTone = "info" | "success" | "warning" | "danger";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type AlertOwnerState = {
    tone: AlertTone;
};

/** @experimental */
export interface AlertSlotProps {
    /** The element around the icon, in the tone's color. Rendered only while the alert shows an icon. */
    icon?: SlotProps<ElementSlotProps<"span">, AlertOwnerState>;
    /** The element next to the icon that holds the title, the message and the action. */
    content?: SlotProps<ElementSlotProps<"div">, AlertOwnerState>;
    /** The element that holds `title`. Rendered only when the alert has a title. */
    title?: SlotProps<ElementSlotProps<"div">, AlertOwnerState>;
    /** The element that holds the message, `children`. */
    message?: SlotProps<ElementSlotProps<"div">, AlertOwnerState>;
    /** The element that holds `action`. Rendered only when the alert has an action. */
    action?: SlotProps<ElementSlotProps<"div">, AlertOwnerState>;
}

/** @experimental */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children" | "role"> {
    /**
     * What kind of message it is, which sets the colors and the icon: `info` for neutral information, such as a
     * hint about a feature, `success` for a completed action, `warning` for something that needs attention but
     * doesn't stop the user, and `danger` for an error or a failed action.
     *
     * @defaultValue `"info"`
     */
    tone?: AlertTone;
    /** A short summary above the message, for example "Payment failed". A message of a sentence or two needs none. */
    title?: ReactNode;
    /**
     * The message. Say what happened and, where it helps, what the user can do, for example "The image is larger
     * than 10 MB. Upload a smaller file." Name the tone in the text when it matters: the color and the icon only
     * support it.
     */
    children: ReactNode;
    /**
     * An action the message leads to, such as a `Button` with `size="small"` that retries a failed upload, or a
     * link. Without a title, it follows the message on the same line when both fit and moves below it otherwise;
     * with a title, it is below the message. Buttons of every variant keep their contrast on every tone.
     */
    action?: ReactNode;
    /**
     * Replaces the tone's icon, for example with another `Icon`. Pass `false` to show no icon. The tone's icon is
     * decorative; to announce the tone, pass an `Icon` with a `label`, such as `<Icon name="danger" label="Error" />`.
     *
     * @defaultValue `<Icon name={tone} />`, the icon named after the tone
     */
    icon?: ReactNode;
    /**
     * Makes the alert a live region, so screen readers announce its message. Use `alert` for an urgent message
     * that appears after the user's action, such as an error after submitting a form: it is announced as soon as
     * the alert is added to the page, interrupting what the screen reader is saying. Use `status` for a message
     * that can wait, such as "Changes saved": it is announced when the screen reader is idle, but reliably only
     * when it changes while the alert is on the page, not when the alert is added with it. For a status message
     * that appears, render the alert without a role inside an element with `role="status"` that is on the page
     * before the message. A message that is on the page from the start, such as a note above a form, needs no
     * role.
     */
    role?: AriaRole;
    /** Added to the component's own classes on the outer element. */
    className?: string;
    /** Inline styles for the outer element. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `icon`, `content`, `title`, `message` and `action`. As a function, it receives
     * the owner state: `tone`.
     */
    slotProps?: AlertSlotProps;
    /** A ref to the outer `<div>`. */
    ref?: Ref<HTMLDivElement>;
}

/**
 * A message about the page or about the result of an action, in the page's flow, such as a hint above a form,
 * a warning that a product is out of stock, or an error after a failed save.
 *
 * Pick the `tone` by what the message means, and write the message so it says the same without the color and
 * the icon. Keep it short: a sentence or two, with an optional `title` and one `action`. Place it near the
 * content it is about. For a message that needs a decision before the user can go on, use `Dialog` instead.
 *
 * It has no role, so assistive technology reads it like other content. For an urgent message that appears in
 * response to the user's action, set `role="alert"`, so it is announced when it appears; a message that can
 * wait goes into a `role="status"` element that is on the page before it (see `role`). The props the component
 * doesn't handle, such as `id` and `aria-*`, go to the outer `<div>`.
 *
 * @summary A message about the page or an action, in four tones, with an optional title and action.
 * @experimental
 */
export function Alert({ tone = "info", title, action, icon, className, slotProps, children, ...restProps }: AlertProps) {
    const ownerState: AlertOwnerState = { tone };
    const shownIcon = icon === undefined ? <Icon name={tone} /> : icon;

    return (
        <div {...restProps} data-tone={tone} className={clsx(styles.root, className)}>
            {hasContent(shownIcon) && (
                <SlotElement tagName="span" {...resolveSlotProps({ ownProps: { className: styles.icon }, slotProps: slotProps?.icon, ownerState })}>
                    {shownIcon}
                </SlotElement>
            )}
            <SlotElement tagName="div" {...resolveSlotProps({ ownProps: { className: styles.content }, slotProps: slotProps?.content, ownerState })}>
                {hasContent(title) && (
                    <SlotElement
                        tagName="div"
                        {...resolveSlotProps({ ownProps: { className: styles.title }, slotProps: slotProps?.title, ownerState })}
                    >
                        {title}
                    </SlotElement>
                )}
                <SlotElement
                    tagName="div"
                    {...resolveSlotProps({ ownProps: { className: styles.message }, slotProps: slotProps?.message, ownerState })}
                >
                    {children}
                </SlotElement>
                {hasContent(action) && (
                    <SlotElement
                        tagName="div"
                        {...resolveSlotProps({ ownProps: { className: styles.action }, slotProps: slotProps?.action, ownerState })}
                    >
                        {action}
                    </SlotElement>
                )}
            </SlotElement>
        </div>
    );
}
