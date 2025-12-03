import "swiper/css";
import "swiper/css/navigation";

import { parseAspectRatio, type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type MediaGalleryBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { Typography } from "@src/common/components/Typography";
import { PageLayout } from "@src/layout/PageLayout";
import { type CSSProperties } from "react";
import { Pagination } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import { BasicSwiper } from "../components/BasicSwiper";
import styles from "./MediaGalleryBlock.module.scss";

type MediaGalleryBlockProps = PropsWithData<MediaGalleryBlockData>;

export const MediaGalleryBlock = withPreview(
    ({ data }: MediaGalleryBlockProps) => {
        // Set aspect ratio as CSS variable for use in calculation in SCSS
        const swiperStyle: CSSProperties = { "--aspect-ratio-numeric": parseAspectRatio(data.aspectRatio) };

        return (
            <BasicSwiper
                className={styles.swiperWrapper}
                style={swiperStyle}
                slidesPerView={1}
                slidesPerGroup={1}
                modules={[Pagination]}
                pagination={{ clickable: true }}
                longSwipesRatio={0.1}
                threshold={3}
                allowTouchMove
                watchOverflow
            >
                {data.items.blocks.map((block) => (
                    <SwiperSlide key={block.key}>
                        <MediaBlock data={block.props.media} aspectRatio={data.aspectRatio} />
                        <Typography variant="paragraph200" className={styles.mediaCaption}>
                            {block.props.caption}
                        </Typography>
                    </SwiperSlide>
                ))}
            </BasicSwiper>
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
