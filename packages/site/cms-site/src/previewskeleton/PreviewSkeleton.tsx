"use client";
import * as React from "react";

import { usePreview } from "../preview/usePreview";
import * as sc from "./PreviewSkeleton.sc";

interface SkeletonProps {
    type?: "bar" | "rows" | "media";
    height?: number;
    hasContent: boolean;
    backgroundColor?: string;
    color?: string;
    title?: React.ReactNode;
    customContainer?: React.ReactNode;
    children?: React.ReactNode;
}

const PreviewSkeleton: React.FunctionComponent<SkeletonProps> = ({
    children,
    customContainer,
    title,
    type = "bar",
    hasContent,
    color = "#A8A7A8",
    backgroundColor = type === "media" ? "#efefef" : "#E0DDE0",
}) => {
    const preview = usePreview();

    if (preview.showPreviewSkeletons && !hasContent) {
        if (customContainer) {
            return <>{customContainer}</>;
        } else if (type === "bar") {
            return (
                <sc.BarSkeleton backgroundColor={backgroundColor} color={color}>
                    {title}
                </sc.BarSkeleton>
            );
        } else if (type === "rows") {
            return (
                <sc.RowsContainer width={"100%"}>
                    <sc.RowSkeleton width={"75%"} backgroundColor={backgroundColor} color={color}>
                        {title}
                    </sc.RowSkeleton>
                    <sc.RowSkeleton width={"100%"} backgroundColor={backgroundColor} color={color} />
                    <sc.RowSkeleton width={"50%"} backgroundColor={backgroundColor} color={color} />
                </sc.RowsContainer>
            );
        } else if (type === "media") {
            return (
                <sc.ImageContainer backgroundColor={backgroundColor} color={color}>
                    {title}
                </sc.ImageContainer>
            );
        }
    }
    return <>{children}</>;
};

export { PreviewSkeleton };
