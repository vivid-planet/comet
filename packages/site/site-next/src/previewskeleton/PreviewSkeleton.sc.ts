import styled, { css } from "styled-components";

interface BarSkeletonStyleProps {
    $backgroundColor: string;
    $color: string;
}
export const BarSkeleton = styled.div<BarSkeletonStyleProps>`
    min-height: 20px;
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    color: ${({ $color }) => $color};
    margin-bottom: 5px;
    margin-right: 5px;
`;
interface RowsContainerStyleProps {
    $width: string;
}

export const RowsContainer = styled.div<RowsContainerStyleProps>`
    width: ${({ $width }) => $width};
    min-width: 300px;
`;

interface RowsSkeletonStyleProps {
    $width: string;
    $backgroundColor: string;
    $color: string;
}

export const RowSkeleton = styled.div<RowsSkeletonStyleProps>`
    margin-bottom: 10px;
    width: ${({ $width }) => $width};
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    color: ${({ $color }) => $color};
    min-height: 20px;
`;

interface ImageSkeletonStyleProps {
    $backgroundColor: string;
    $color: string;
    $aspectRatio: string | number | undefined;
    $height: string | number | undefined;
}

export const ImageContainer = styled.div<ImageSkeletonStyleProps>`
    background-color: ${({ $backgroundColor }) => $backgroundColor};
    color: ${({ $color }) => $color};
    width: 100%;

    ${({ $aspectRatio, $height = 300 }) =>
        typeof $aspectRatio === "undefined"
            ? css`
                  height: ${$height};
              `
            : css`
                  aspect-ratio: ${$aspectRatio};
              `}
`;
