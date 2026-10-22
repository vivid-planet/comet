"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { hasContent } from "../slots/hasContent";
import { type ElementSlotProps, SlotElement } from "../slots/SlotElement";
import { resolveSlotProps, type SlotProps } from "../slots/slotProps";
import styles from "./Input.module.css";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type InputOwnerState = {
    disabled: boolean;
    multiline: boolean;
};

/** @experimental */
export interface InputSlotProps {
    /** The `<input>` element, or the `<textarea>` of a `multiline` input, which receives focus and the props the component doesn't handle. */
    input?: SlotProps<BaseInput.Props, InputOwnerState>;
    /** The element around `startAdornment`. Rendered only while there is a start adornment. */
    startAdornment?: SlotProps<ElementSlotProps<"span">, InputOwnerState>;
    /** The element around `endAdornment`. Rendered only while there is an end adornment. */
    endAdornment?: SlotProps<ElementSlotProps<"span">, InputOwnerState>;
}

/** @experimental */
export interface InputProps extends Omit<BaseInput.Props, "className" | "style" | "render" | "children" | "disabled"> {
    /**
     * Content before the text inside the box, such as a search icon or a currency symbol. Clicking it doesn't
     * focus the input, so keep it short.
     */
    startAdornment?: ReactNode;
    /** Content after the text inside the box, such as a unit, or an `IconButton` that clears the value. */
    endAdornment?: ReactNode;
    /** Renders a `<textarea>` for text of several lines, such as a description. The user can resize it vertically. */
    multiline?: boolean;
    /**
     * The number of visible text lines of a `multiline` input.
     *
     * @defaultValue `3`
     */
    rows?: number;
    /** Prevents interaction and dims the box. */
    disabled?: boolean;
    /** Added to the component's own classes on the outer element, the box that holds the adornments and the input. */
    className?: string;
    /** Inline styles for the outer element, the box that holds the adornments and the input. */
    style?: CSSProperties;
    /**
     * Props for the inner parts: `input`, `startAdornment` and `endAdornment`. As a function, it receives the
     * owner state: `disabled` and `multiline`.
     */
    slotProps?: InputSlotProps;
}

/**
 * A text input without a label of its own: the box, the text and optional adornments before and after it.
 *
 * Use it as the control of a `FormField`, which names it with its label and connects the description and the
 * error. For a text input with a label, use `TextField`. On its own, for example in a toolbar, name the input
 * with `aria-label`.
 *
 * Put an icon or a unit into `startAdornment` or `endAdornment`, and an `IconButton` that acts on the value,
 * such as clearing it, into `endAdornment`. Set `multiline` for text of several lines.
 *
 * The props the component doesn't handle, such as `value`, `onValueChange`, `placeholder`, `name` and `ref`,
 * go to the `<input>`.
 *
 * @summary A text input without a label, with optional adornments.
 * @experimental
 */
export function Input({ startAdornment, endAdornment, multiline, rows = 3, disabled, className, style, slotProps, ...inputProps }: InputProps) {
    const ownerState: InputOwnerState = { disabled: Boolean(disabled), multiline: Boolean(multiline) };

    return (
        <span
            className={clsx(styles.root, className)}
            style={style}
            data-disabled={ownerState.disabled ? "" : undefined}
            data-multiline={ownerState.multiline ? "" : undefined}
        >
            {hasContent(startAdornment) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({ ownProps: { className: styles.startAdornment }, slotProps: slotProps?.startAdornment, ownerState })}
                >
                    {startAdornment}
                </SlotElement>
            )}
            <BaseInput
                {...resolveSlotProps({
                    ownProps: {
                        ...inputProps,
                        disabled,
                        className: styles.input,
                        ...(multiline && { render: <textarea rows={rows} /> }),
                    },
                    slotProps: slotProps?.input,
                    ownerState,
                })}
            />
            {hasContent(endAdornment) && (
                <SlotElement
                    tagName="span"
                    {...resolveSlotProps({ ownProps: { className: styles.endAdornment }, slotProps: slotProps?.endAdornment, ownerState })}
                >
                    {endAdornment}
                </SlotElement>
            )}
        </span>
    );
}
