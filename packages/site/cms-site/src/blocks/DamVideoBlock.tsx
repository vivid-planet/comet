"use client";
import { styled } from "@pigment-css/react";
import { ReactElement, ReactNode, useState } from "react";

import { DamVideoBlockData } from "../blocks.generated";
import { WithPreviewComponent } from "../iframebridge/WithPreviewComponent";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import { VideoPreviewImage, VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import { PropsWithData } from "./PropsWithData";

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage?: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
}

export const DamVideoBlock = ({ data, aspectRatio = "16x9", previewImageSizes, renderPreviewImage, fill, previewImageIcon }: DamVideoBlockProps) => {
    const { damFile, autoplay, loop, showControls, previewImage } = data;
    const [showPreviewImage, setShowPreviewImage] = useState(true);
    if (damFile === undefined) {
        return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
    }

    const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

    if (damFile === undefined) {
        return null;
    }
    return (
        <WithPreviewComponent data={data} label="Video">
            {hasPreviewImage && showPreviewImage ? (
                renderPreviewImage ? (
                    renderPreviewImage({
                        onPlay: () => setShowPreviewImage(false),
                        image: previewImage,
                        aspectRatio,
                        sizes: previewImageSizes,
                        fill: fill,
                        icon: previewImageIcon,
                    })
                ) : (
                    <VideoPreviewImage
                        onPlay={() => setShowPreviewImage(false)}
                        image={previewImage}
                        aspectRatio={aspectRatio}
                        sizes={previewImageSizes}
                        fill={fill}
                        icon={previewImageIcon}
                    />
                )
            ) : (
                <Video
                    autoPlay={autoplay || (hasPreviewImage && !showPreviewImage)}
                    controls={showControls}
                    loop={loop}
                    playsInline
                    muted={autoplay}
                    $aspectRatio={aspectRatio.replace("x", " / ")}
                    $fill={fill}
                >
                    <source src={damFile.fileUrl} type={damFile.mimetype} />
                </Video>
            )}
        </WithPreviewComponent>
    );
};

const Video = styled.video<{ $aspectRatio: string; $fill?: boolean }>({
    width: "100%",
    objectFit: "cover",
    aspectRatio: ({ $fill, $aspectRatio }) => ($fill ? undefined : $aspectRatio),
    height: ({ $fill }) => ($fill ? "100%" : undefined),
});
