import { styled } from "@mui/material/styles";

export const ImagesContainer = styled("div")`
    position: relative;
    width: 100%;
    height: 100%;
`;

export const Image = styled("img")`
    display: flex;
    object-fit: cover;
    width: 100%;
    height: 100%;
`;

export const StackedImage = styled("div")`
    position: absolute;
    border: 1px solid white;
`;

const TwoImagesStackedImage = styled(StackedImage)`
    width: 80%;
    height: 80%;
`;
export const TwoImagesStackedImageLeft = styled(TwoImagesStackedImage)`
    z-index: 2;
`;

export const TwoImagesStackedImageRight = styled(TwoImagesStackedImage)`
    z-index: 1;
    bottom: 0;
    right: 0;
`;

const ThreeImagesStackedImage = styled(StackedImage)`
    width: 70%;
    height: 70%;
`;

export const ThreeImagesStackedImageLeft = styled(ThreeImagesStackedImage)`
    z-index: 3;
    top: 0;
    left: 0;
`;

export const ThreeImagesStackedImageCenter = styled(ThreeImagesStackedImage)`
    z-index: 2;
    margin-left: auto;
    margin-right: auto;
    margin-top: auto;
    margin-bottom: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;

export const ThreeImagesStackedImageRight = styled(ThreeImagesStackedImage)`
    z-index: 1;
    bottom: 0;
    right: 0;
`;
