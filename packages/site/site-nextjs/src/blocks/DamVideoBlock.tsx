"use client";

import { type PropsWithData, PreviewSkeleton, useIsElementInViewport, withPreview } from "@comet/site-react";
import clsx from "clsx";
import { type ReactElement, type ReactNode, useRef, useState } from "react";

import { type DamVideoBlockData } from "../blocks.generated";
import styles from "./DamVideoBlock.module.scss";
import { type VideoPreviewImageProps, VideoPreviewImage } from "./helpers/VideoPreviewImage";

interface DamVideoBlockProps extends PropsWithData<DamVideoBlockData> {
    aspectRatio?: string;
    previewImageSizes?: string;
    renderPreviewImage?: (props: VideoPreviewImageProps) => ReactElement;
    fill?: boolean;
    previewImageIcon?: ReactNode;
}

export const DamVideoBlock = withPreview(
    ({
        data: { damFile, autoplay, loop, showControls, previewImage, subtitles },
        aspectRatio = "16x9",
        previewImageSizes,
        renderPreviewImage,
        fill,
        previewImageIcon,
    }: DamVideoBlockProps) => {
        if (damFile === undefined) {
            return <PreviewSkeleton type="media" hasContent={false} aspectRatio={aspectRatio} />;
        }

        const [showPreviewImage, setShowPreviewImage] = useState(true);
        const hasPreviewImage = Boolean(previewImage && previewImage.damFile);

        const videoRef = useRef<HTMLVideoElement>(null);

        useIsElementInViewport(videoRef, (inView) => {
            if (autoplay && videoRef.current) {
                inView ? videoRef.current.play() : videoRef.current.pause();
            }
        });

        return (
            <>
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
                        <source src={damFile.fileUrl} type={damFile.mimetype} />
                        {subtitles?.map((s, i) => (
                            s.file ? <track key={i} src={s.file.fileUrl} kind="subtitles" srcLang={s.language} /> : null
                        ))}
                    </video>
                )}
            </>
        );
    },
    { label: "Video" },
);
