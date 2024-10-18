"use client";

import { PropsWithChildren, ReactNode } from "react";

import { usePreview } from "../preview/usePreview";
import * as sc from "./PreviewSkeleton.sc";

interface SkeletonProps extends PropsWithChildren {
    type?: "bar" | "rows" | "media";
    height?: number;
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
    hasContent,
    color = "#A8A7A8",
    backgroundColor = type === "media" ? "#efefef" : "#E0DDE0",
}: SkeletonProps) => {
    const preview = usePreview();

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
                <sc.ImageContainer $backgroundColor={backgroundColor} $color={color}>
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

export { PreviewSkeleton };
