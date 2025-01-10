import { styled } from "@pigment-css/react";

interface BarSkeletonStyleProps {
    $backgroundColor: string;
    $color: string;
}
export const BarSkeleton = styled.div<BarSkeletonStyleProps>({
    minHeight: "20px",
    backgroundColor: ({ $backgroundColor }) => $backgroundColor,
    color: ({ $color }) => $color,
    marginBottom: "5px",
    marginRight: "5px",
});

interface RowsContainerStyleProps {
    $width: string;
}

export const RowsContainer = styled.div<RowsContainerStyleProps>({
    width: ({ $width }) => $width,
    minWidth: "300px",
});

interface RowsSkeletonStyleProps {
    $width: string;
    $backgroundColor: string;
    $color: string;
}

export const RowSkeleton = styled.div<RowsSkeletonStyleProps>({
    marginBottom: "10px",
    width: ({ $width }) => $width,
    backgroundColor: ({ $backgroundColor }) => $backgroundColor,
    color: ({ $color }) => $color,
    minHeight: "20px",
});

interface ImageSkeletonStyleProps {
    $backgroundColor: string;
    $color: string;
    $aspectRatio: string | number | undefined;
    $height: string | number | undefined;
}

export const ImageContainer = styled.div<ImageSkeletonStyleProps>({
    backgroundColor: ({ $backgroundColor }) => $backgroundColor,
    color: ({ $color }) => $color,
    width: "100%",
    height: ({ $aspectRatio, $height = 300 }) => (typeof $aspectRatio === "undefined" ? $height : undefined),
    aspectRatio: ({ $aspectRatio }) => (typeof $aspectRatio !== "undefined" ? $aspectRatio : undefined),
});
