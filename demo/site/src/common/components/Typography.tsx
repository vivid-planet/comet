import clsx from "clsx";
import { type ComponentProps, type ElementType } from "react";

import styles from "./Typography.module.scss";

type TypographyVariant = "h600" | "h550" | "h500" | "h450" | "h400" | "h350" | "p300" | "p200";

const variantToElementMap: Record<TypographyVariant, "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p"> = {
    h600: "h1",
    h550: "h2",
    h500: "h3",
    h450: "h4",
    h400: "h5",
    h350: "h6",
    p300: "p",
    p200: "p",
};

export type TypographyProps = {
    as?: ElementType;
    variant?: TypographyVariant;
    bottomSpacing?: boolean;
} & ComponentProps<"p">;

export const Typography = (props: TypographyProps) => {
    const { variant = "p300", bottomSpacing = true, as: Component = variantToElementMap[variant], className, ...rest } = props;
    return <Component className={clsx(styles.base, styles[variant], !bottomSpacing && styles.noBottomSpacing, className)} {...rest} />;
};
