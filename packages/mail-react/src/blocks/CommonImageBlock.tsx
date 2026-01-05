import { MjmlImage } from "@faire/mjml-react";
import type { ComponentProps } from "react";

import { type PixelImageBlockData } from "../blocks.generated";
import { calculateInheritAspectRatio, generateImageUrl, getDamAllowedImageWidth } from "./helpers/imageBlockHelpers";

interface Props extends ComponentProps<typeof MjmlImage> {
    data: PixelImageBlockData;
    desktopRenderWidth?: number;
    contentWidth?: number;
}

export const CommonImageBlock = ({ data, desktopRenderWidth = 600, contentWidth = 600, ...restProps }: Props) => {
    const { damFile, cropArea, urlTemplate } = data;

    if (!damFile?.image) {
        return null;
    }

    const usedCropArea = cropArea ?? damFile.image.cropArea;
    const usedAspectRatio = calculateInheritAspectRatio(damFile.image, usedCropArea);

    const imageUrl: string = generateImageUrl(
        {
            width: getDamAllowedImageWidth(desktopRenderWidth, contentWidth),
            src: urlTemplate,
        },
        usedAspectRatio,
    );

    const desktopImageHeight = Math.round(desktopRenderWidth / usedAspectRatio);

    return (
        <MjmlImage
            src={imageUrl}
            fluidOnMobile={true}
            cssClass="image-block"
            width={desktopRenderWidth}
            height={desktopImageHeight}
            alt={damFile.altText}
            title={damFile.title}
            padding={0}
            {...restProps}
        />
    );
};
