import clsx from "clsx";
import { type ComponentProps, type ElementType, type PropsWithChildren } from "react";

import styles from "./Typography.module.scss";

export type TypographyVariant = "h600" | "h550" | "h500" | "h450" | "h400" | "h350" | "p300" | "p200";

const variantToElementMap: Record<TypographyVariant, ElementType> = {
    h600: "h1",
    h550: "h2",
    h500: "h3",
    h450: "h4",
    h400: "h5",
    h350: "h6",
    p300: "p",
    p200: "p",
};

export interface TypographyProps extends PropsWithChildren<ComponentProps<"p">> {
    as?: ElementType;
    variant?: TypographyVariant;
    bottomSpacing?: boolean;
}

export const Typography = ({ as, variant = "p300", bottomSpacing = false, className, children, ...restProps }: TypographyProps) => {
    const Component = as || variantToElementMap[variant] || "p";
    return (
        <Component className={clsx(styles.typography, styles[variant], !bottomSpacing && styles.noBottomSpacing, className)} {...restProps}>
            {children}
        </Component>
    );
};
