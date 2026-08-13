import { MjmlColumn, MjmlImage, MjmlSection, type PropsWithData, useConfig } from "@dextinity/mail-react";
import { calculateInheritAspectRatio, generateImageUrl } from "@dextinity/site-nextjs";
import type { NewsletterImageBlockData } from "@src/blocks.generated";

interface NewsletterImageBlockProps extends PropsWithData<NewsletterImageBlockData> {
    desktopRenderWidth?: number;
    contentWidth?: number;
}

export const NewsletterImageBlock = ({ data, desktopRenderWidth = 600, contentWidth = 600 }: NewsletterImageBlockProps) => {
    const { pixelImageBlock } = useConfig();
    const { damFile, cropArea, urlTemplate } = data.image;

    if (!damFile?.image || !pixelImageBlock) {
        return null;
    }

    const usedCropArea = cropArea ?? damFile.image.cropArea;
    const usedAspectRatio = calculateInheritAspectRatio(damFile.image, usedCropArea);

    const imageUrl: string = generateImageUrl(
        {
            width: getOptimalAllowedImageWidth(pixelImageBlock.validSizes, desktopRenderWidth, contentWidth),
            src: urlTemplate,
        },
        usedAspectRatio,
    );

    const desktopImageHeight = Math.round(desktopRenderWidth / usedAspectRatio);

    return (
        <MjmlSection>
            <MjmlColumn>
                <MjmlImage
                    src={isAbsoluteUrl(imageUrl) ? imageUrl : `${pixelImageBlock.baseUrl}${imageUrl}`}
                    // @ts-expect-error mjml-react expects a boolean but mjml2html requires "true" as string
                    fluidOnMobile="true"
                    cssClass="image-block"
                    width={desktopRenderWidth}
                    height={desktopImageHeight}
                    alt={damFile.altText}
                    title={damFile.title}
                    padding={0}
                />
            </MjmlColumn>
        </MjmlSection>
    );
};

function isAbsoluteUrl(url: string): boolean {
    return !url.startsWith("/");
}

const getOptimalAllowedImageWidth = (validSizes: number[], minimumWidth: number, contentWidth: number): number => {
    const sortedValidSizes = validSizes.sort((a, b) => a - b);

    let width: number | null = null;
    const largestPossibleWidth = sortedValidSizes[sortedValidSizes.length - 1];

    sortedValidSizes.forEach((validWidth) => {
        if (minimumWidth === contentWidth) {
            width = contentWidth * 2;
        } else if (!width && validWidth >= minimumWidth * 2) {
            width = validWidth;
        }
    });

    if (!width) {
        return largestPossibleWidth;
    }

    return width;
};
