import clsx from "clsx";
import { type ComponentProps, type ElementType } from "react";

import { SvgUse } from "../helpers/SvgUse";
import styles from "./Button.module.scss";

export type ButtonVariant = "contained" | "outlined" | "text";

type ButtonProps<T extends ElementType> = {
    as?: T;
    variant?: ButtonVariant;
    startIcon?: string;
    endIcon?: string;
} & Omit<ComponentProps<T>, "variant">;

export const Button = <T extends ElementType = "button">(props: ButtonProps<T>) => {
    const { as: Component = "button", variant = "contained", className, startIcon, endIcon, children, ...rest } = props;
    return (
        <Component className={clsx(styles.button, styles[variant], className)} {...rest}>
            {startIcon && <SvgUse href={startIcon} width={16} height={16} />}
            {children}
            {endIcon && <SvgUse href={endIcon} width={16} height={16} />}
        </Component>
    );
};
