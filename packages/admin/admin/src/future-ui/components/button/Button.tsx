import { Button as BaseButton } from "@base-ui/react/button";
import { clsx } from "clsx";

import styles from "./Button.module.scss";

/** @experimental */
export interface ButtonProps extends Omit<BaseButton.Props, "className"> {
    className?: string;
    variant?: "primary" | "secondary";
}

/**
 * A button for triggering actions.
 *
 * @experimental
 */
export function Button({ disabled, type = "button", variant = "primary", className, children, ...restProps }: ButtonProps) {
    return (
        <BaseButton
            {...restProps}
            type={type}
            disabled={disabled}
            className={clsx(
                styles.root,
                variant === "primary" && styles["root--variantPrimary"],
                variant === "secondary" && styles["root--variantSecondary"],
                disabled && styles["root--disabled"],
                className,
            )}
        >
            {children}
        </BaseButton>
    );
}
