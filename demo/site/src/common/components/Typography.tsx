import clsx from "clsx";
import { type ComponentProps, type ElementType, type PropsWithChildren } from "react";

import styles from "./Typography.module.scss";

type TypographyVariant = "h600" | "h550" | "h500" | "h450" | "h400" | "h350" | "e600" | "e550" | "e500" | "e450" | "p300" | "p200";

const variantToElementMap: Record<TypographyVariant, ElementType> = {
    h600: "h1",
    h550: "h2",
    h500: "h3",
    h450: "h4",
    h400: "h5",
    h350: "h6",
    e600: "p",
    e550: "p",
    e500: "p",
    e450: "p",
    p300: "p",
    p200: "p",
};

export type TypographyProps<T extends ElementType> = {
    as?: T;
    variant?: TypographyVariant;
    bottomSpacing?: boolean;
} & Omit<ComponentProps<T>, "variant">;

export const Typography = <T extends ElementType = "p">(props: PropsWithChildren<TypographyProps<T>>) => {
    const { as, variant = "p300", bottomSpacing = false, className, children, ...restProps } = props;
    const Component = as || variantToElementMap[variant] || "p";
    return (
        <Component
            className={clsx(styles.root, styles[`root--${variant}`], !bottomSpacing && styles[`root--noBottomSpacing`], className)}
            {...restProps}
        >
            {children}
        </Component>
    );
};
