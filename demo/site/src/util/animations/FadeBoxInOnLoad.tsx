"use client";

import { usePreview } from "@comet/site-nextjs";
import clsx from "clsx";
import { type ReactElement } from "react";

import styles from "./FadeBoxInOnLoad.module.scss";

interface FadeBoxInOnLoadProps {
    direction?: "top" | "right" | "bottom" | "left";
    children: ReactElement;
    delay?: number;
    duration?: number;
}

export function FadeBoxInOnLoad({ children, direction = undefined, delay = 0, duration }: FadeBoxInOnLoadProps) {
    const { previewType } = usePreview();

    const style = {
        "--fade-delay": `${delay}ms`,
        ...(duration != null && { "--fade-duration": `${duration}ms` }),
    } as React.CSSProperties;

    return (
        <div
            className={clsx(
                styles.root,
                previewType !== "BlockPreview" && direction === "left" && styles.fromLeft,
                previewType !== "BlockPreview" && direction === "right" && styles.fromRight,
                previewType !== "BlockPreview" && direction === "top" && styles.fromTop,
                previewType !== "BlockPreview" && direction === "bottom" && styles.fromBottom,
                previewType !== "BlockPreview" && direction === undefined && styles.fadeIn,
            )}
            style={style}
        >
            {children}
        </div>
    );
}
