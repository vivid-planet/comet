"use client";
import "swiper/css";
import "swiper/css/navigation";

import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type MediaGalleryBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { Typography } from "@src/common/components/Typography";
import { PageLayout } from "@src/layout/PageLayout";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./MediaGalleryBlock.module.scss";

type MediaGalleryBlockProps = PropsWithData<MediaGalleryBlockData>;

export const MediaGalleryBlock = withPreview(
    ({ data }: MediaGalleryBlockProps) => {
        const aspectRatioValues = data.aspectRatio.split("x");
        const aspectRatio = (Number(aspectRatioValues[0]) / Number(aspectRatioValues[1])) * 100;

        return (
            <Swiper
                className={styles.swiperWrapper}
                modules={[Navigation]}
                slidesPerView={1}
                slidesPerGroup={1}
                navigation
                longSwipesRatio={0.1}
                threshold={3}
                allowTouchMove
                watchOverflow
                style={{
                    "--aspect-ratio": `${aspectRatio}%`,
                }}
            >
                {data.items.blocks.map((block) => (
                    <SwiperSlide key={block.key}>
                        <MediaBlock data={block.props.media} aspectRatio={data.aspectRatio} />
                        <Typography variant="p200" className={styles.mediaCaption}>
                            {block.props.caption}
                        </Typography>
                    </SwiperSlide>
                ))}
            </Swiper>
        );
    },
    { label: "MediaGallery" },
);

export const PageContentMediaGalleryBlock = (props: MediaGalleryBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <MediaGalleryBlock {...props} />
        </div>
    </PageLayout>
);
