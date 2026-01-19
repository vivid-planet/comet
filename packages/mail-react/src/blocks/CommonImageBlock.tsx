import { MjmlImage } from "@faire/mjml-react";
import type { ComponentProps } from "react";

import { type PixelImageBlockData } from "../blocks.generated.js";
import { calculateInheritAspectRatio, generateImageUrl, getOptimalAllowedImageWidth } from "./helpers/imageBlockHelpers.js";

interface Props extends ComponentProps<typeof MjmlImage> {
    data: PixelImageBlockData;
    validSizes: number[];
    baseUrl: string;
    desktopRenderWidth?: number;
    contentWidth?: number;
}

function isAbsoluteUrl(url: string): boolean {
    return !url.startsWith("/");
}

export const CommonImageBlock = ({ data, desktopRenderWidth = 600, contentWidth = 600, validSizes, baseUrl, ...restProps }: Props) => {
    const { damFile, cropArea, urlTemplate } = data;

    if (!damFile?.image) {
        return null;
    }

    const usedCropArea = cropArea ?? damFile.image.cropArea;
    const usedAspectRatio = calculateInheritAspectRatio(damFile.image, usedCropArea);

    const imageUrl: string = generateImageUrl(
        {
            width: getOptimalAllowedImageWidth(validSizes, desktopRenderWidth, contentWidth),
            src: urlTemplate,
        },
        usedAspectRatio,
    );

    const desktopImageHeight = Math.round(desktopRenderWidth / usedAspectRatio);

    return (
        <MjmlImage
            src={isAbsoluteUrl(imageUrl) ? imageUrl : `${baseUrl}${imageUrl}`}
            // @ts-expect-error mjml-react expects a boolean but mjml2html requires "true" as string
            fluidOnMobile="true"
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
