"use client";

import { type PropsWithChildren, type ReactNode } from "react";

import { usePreview } from "../preview/usePreview";
import styles from "./PreviewSkeleton.module.css";

interface SkeletonProps extends PropsWithChildren {
    type?: "bar" | "rows" | "media";
    aspectRatio?: string | number;
    height?: string | number;
    hasContent: boolean;
    backgroundColor?: string;
    color?: string;
    title?: ReactNode;
    customContainer?: ReactNode;
}

const PreviewSkeleton = ({
    children,
    customContainer,
    title,
    type = "bar",
    aspectRatio,
    height,
    hasContent,
    color = "#A8A7A8",
    backgroundColor = type === "media" ? "#efefef" : "#E0DDE0",
}: SkeletonProps) => {
    const preview = usePreview();
    const validAspectRatio = getValidAspectRatio(aspectRatio);

    if (preview.showPreviewSkeletons && !hasContent) {
        if (customContainer) {
            return <>{customContainer}</>;
        } else if (type === "bar") {
            return (
                <div className={styles.barSkeleton} style={{ backgroundColor, color }}>
                    {title}
                </div>
            );
        } else if (type === "rows") {
            return (
                <div className={styles.rowsContainer}>
                    <div className={styles.rowSkeleton} style={{ width: "75%", backgroundColor, color }}>
                        {title}
                    </div>
                    <div className={styles.rowSkeleton} style={{ width: "100%", backgroundColor, color }} />
                    <div className={styles.rowSkeleton} style={{ width: "50%", backgroundColor, color }} />
                </div>
            );
        } else if (type === "media") {
            return (
                <div
                    className={styles.imageContainer}
                    style={{
                        aspectRatio: validAspectRatio,
                        height: validAspectRatio ? undefined : height,
                        backgroundColor,
                        color,
                    }}
                >
                    {title}
                </div>
            );
        }
    }

    if (!hasContent) {
        return null;
    }

    return <>{children}</>;
};

const getValidAspectRatio = (aspectRatio: string | number | undefined) => {
    if (aspectRatio === "inherit") {
        return undefined;
    }

    if (aspectRatio === "auto") {
        return undefined;
    }

    if (typeof aspectRatio === "string") {
        return aspectRatio.replace("x", "/");
    }

    return aspectRatio;
};

export { PreviewSkeleton };
