"use client";

import { PropsWithChildren, ReactNode } from "react";

import { usePreview } from "../preview/usePreview";
import * as sc from "./PreviewSkeleton.sc";

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
                <sc.BarSkeleton $backgroundColor={backgroundColor} $color={color}>
                    {title}
                </sc.BarSkeleton>
            );
        } else if (type === "rows") {
            return (
                <sc.RowsContainer $width="100%">
                    <sc.RowSkeleton $width="75%" $backgroundColor={backgroundColor} $color={color}>
                        {title}
                    </sc.RowSkeleton>
                    <sc.RowSkeleton $width="100%" $backgroundColor={backgroundColor} $color={color} />
                    <sc.RowSkeleton $width="50%" $backgroundColor={backgroundColor} $color={color} />
                </sc.RowsContainer>
            );
        } else if (type === "media") {
            return (
                <sc.ImageContainer $aspectRatio={validAspectRatio} $height={height} $backgroundColor={backgroundColor} $color={color}>
                    {title}
                </sc.ImageContainer>
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
        // If "inherit" is passed to the image, the goal is for the NextJS's image component to use the image's original aspect ratio, not "inherit" as a CSS aspect ratio.
        // In that case, we cannot get the actual aspect ratio, so we use the fallback behavior in the skeleton.
        return undefined;
    }

    if (aspectRatio === "auto") {
        // The goal of using "auto" as a CSS aspect ratio is to use the image's original aspect ratio.
        // Since the image does not exist while the skeleton is shown, we use the fallback behavior in the skeleton.
        return undefined;
    }

    if (typeof aspectRatio === "string") {
        return aspectRatio.replace("x", "/");
    }

    return aspectRatio;
};

export { PreviewSkeleton };
