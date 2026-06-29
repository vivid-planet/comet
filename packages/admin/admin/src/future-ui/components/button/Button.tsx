import { Button as BaseButton } from "@base-ui/react/button";
import { clsx } from "clsx";
import type { ElementType, ReactNode } from "react";

import { resolveSlotProps, type SlotPropsValue } from "../../utils/slotProps";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary";

/**
 * The resolved configuration that influences the component's appearance or behavior.
 *
 * @experimental
 */
export type ButtonOwnerState = {
    variant: ButtonVariant;
    disabled: boolean;
};

interface ButtonSlots {
    /**
     * Element for the `startIcon` slot.
     *
     * @defaultValue `span`
     */
    startIcon?: ElementType;
    /**
     * Element for the `endIcon` slot.
     *
     * @defaultValue `span`
     */
    endIcon?: ElementType;
}

interface ButtonSlotProps {
    /** Props for the `startIcon` slot. */
    startIcon?: SlotPropsValue<ButtonOwnerState, "span">;
    /** Props for the `endIcon` slot. */
    endIcon?: SlotPropsValue<ButtonOwnerState, "span">;
}

/** @experimental */
export interface ButtonProps extends Omit<BaseButton.Props, "className"> {
    /**
     * Visual style.
     *
     * @defaultValue `"primary"`
     */
    variant?: ButtonVariant;
    /**
     * Prevents interaction with the button.
     *
     * @defaultValue `false`
     */
    disabled?: boolean;
    /** Added alongside the component's own classes. */
    className?: string;
    /** Sets which element a named inner part renders as. */
    slots?: ButtonSlots;
    /** Props for each slot, merged with the slot's own props rather than replacing them. */
    slotProps?: ButtonSlotProps;
    /** The icon to render before the button's text. */
    startIcon?: ReactNode;
    /** The icon to render after the button's text. */
    endIcon?: ReactNode;
}

/**
 * A button for triggering actions.
 *
 * @experimental
 */
export function Button({
    disabled = false,
    type = "button",
    variant = "primary",
    className,
    slots,
    slotProps,
    startIcon,
    endIcon,
    children,
    ...restProps
}: ButtonProps) {
    const ownerState: ButtonOwnerState = { variant, disabled };

    const StartIconSlot = slots?.startIcon ?? "span";
    const EndIconSlot = slots?.endIcon ?? "span";

    const startIconProps = resolveSlotProps<ButtonOwnerState, "span">({ className: styles.startIcon }, slotProps?.startIcon, ownerState);
    const endIconProps = resolveSlotProps<ButtonOwnerState, "span">({ className: styles.endIcon }, slotProps?.endIcon, ownerState);

    return (
        <BaseButton
            {...restProps}
            type={type}
            disabled={ownerState.disabled}
            data-variant={ownerState.variant}
            className={clsx(styles.root, className)}
        >
            {startIcon != null && <StartIconSlot {...startIconProps}>{startIcon}</StartIconSlot>}
            {children}
            {endIcon != null && <EndIconSlot {...endIconProps}>{endIcon}</EndIconSlot>}
        </BaseButton>
    );
}
