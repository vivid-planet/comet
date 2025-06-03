"use client";
import clsx from "clsx";
import { type ComponentProps } from "react";

import styles from "./PageLayout.module.scss";

interface PageLayoutProps extends ComponentProps<"div"> {
    grid?: boolean;
}

export const PageLayout = ({ grid, className, ...restProps }: PageLayoutProps) => (
    <div className={clsx(styles.root, grid && styles.grid, className)} {...restProps} />
);
