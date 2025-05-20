import { generateImageUrl, parseAspectRatio } from "@comet/site-react";
// eslint-disable-next-line no-restricted-imports
import NextImage, { type ImageProps as NextImageProps } from "next/image";

type Props = Omit<NextImageProps, "loader"> & { aspectRatio: string };

export function Image({ aspectRatio, ...nextImageProps }: Props) {
    const usedAspectRatio = parseAspectRatio(aspectRatio);

    return <NextImage loader={(loaderProps) => generateImageUrl(loaderProps, usedAspectRatio)} {...nextImageProps} />;
}
