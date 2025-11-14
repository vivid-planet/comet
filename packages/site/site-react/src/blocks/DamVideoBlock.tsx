"use client";

import clsx from "clsx";
import { type ReactElement, type ReactNode, useRef, useState } from "react";

import { type DamVideoBlockData } from "../blocks.generated";
import { withPreview } from "../iframebridge/withPreview";
import { PreviewSkeleton } from "../previewskeleton/PreviewSkeleton";
import styles from "./DamVideoBlock.module.scss";
import { useIsElementInViewport } from "./helpers/useIsElementInViewport";
import { type VideoPreviewImageProps } from "./helpers/VideoPreviewImage";
import { type PropsWithData } from "./PropsWithData";

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
    playButtonAriaLabel?: string;
}

export const DamVideoBlock = withPreview(
    ({
        data: { damFile, autoplay, loop, showControls, previewImage },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
        previewImageIcon,
        playButtonAriaLabel,
    }: DamVideoBlockProps) => {
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

        const videoRef = useRef<HTMLVideoElement>(null);

        useIsElementInViewport(videoRef, (inView) => {
            if (autoplay && videoRef.current) {
                if (inView) {
                    videoRef.current.play();
                } else {
                    videoRef.current.pause();
                }
            }
        });

        return (
            <>
                {hasPreviewImage && showPreviewImage ? (
                    renderPreviewImage({
                        onPlay: () => setShowPreviewImage(false),
                        image: previewImage,
                        aspectRatio,
                        sizes: previewImageSizes,
                        fill: fill,
                        icon: previewImageIcon,
                        playButtonAriaLabel,
                    })
                ) : (
                    <video
                        autoPlay={autoplay || (hasPreviewImage && !showPreviewImage)}
                        controls={showControls}
                        loop={loop}
                        playsInline
                        muted={autoplay}
                        ref={videoRef}
                        className={clsx(styles.video, fill && styles.fill)}
                        style={!fill ? { "--aspect-ratio": aspectRatio.replace("x", " / ") } : undefined}
                    >
                        {damFile.captions?.map((caption) => {
                            return <track key={caption.id} src={caption.fileUrl} kind="captions" srcLang={caption.language} />;
                        })}
                        <source src={damFile.fileUrl} type={damFile.mimetype} />
                    </video>
                )}
            </>
        );
    },
    { label: "Video" },
);
