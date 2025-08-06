import "swiper/css";
import "swiper/css/navigation";

import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type MediaGalleryBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { Typography } from "@src/common/components/Typography";
import { PageLayout } from "@src/layout/PageLayout";
import styled from "styled-components";
import { Navigation } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import { BasicSwiper } from "../components/BasicSwiper";

type MediaGalleryBlockProps = PropsWithData<MediaGalleryBlockData>;

export const MediaGalleryBlock = withPreview(
    ({ data }: MediaGalleryBlockProps) => {
        const aspectRatioValues = data.aspectRatio.split("x");

        return (
            <SwiperWrapper
                modules={[Navigation]}
                slidesPerView={1}
                slidesPerGroup={1}
                pagination={{
                    clickable: true,
                }}
                longSwipesRatio={0.1}
                threshold={3}
                allowTouchMove
                watchOverflow
                $aspectRatioHorizontal={aspectRatioValues[0]}
                $aspectRatioVertical={aspectRatioValues[1]}
            >
                {data.items.blocks.map((block) => (
                    <SwiperSlide key={block.key}>
                        <MediaBlock data={block.props.media} aspectRatio={data.aspectRatio} />
                        <MediaCaption variant="p200">{block.props.caption}</MediaCaption>
                    </SwiperSlide>
                ))}
            </SwiperWrapper>
        );
    },
    { label: "MediaGallery" },
);

export const PageContentMediaGalleryBlock = (props: MediaGalleryBlockProps) => (
    <PageLayout grid>
        <PageLayoutContent>
            <MediaGalleryBlock {...props} />
        </PageLayoutContent>
    </PageLayout>
);

const PageLayoutContent = styled.div`
    grid-column: 2 / -2;
    position: relative;

    ${({ theme }) => theme.breakpoints.sm.mediaQuery} {
        grid-column: 5 / -5;
    }

    ${({ theme }) => theme.breakpoints.lg.mediaQuery} {
        grid-column: 6 / -6;
    }

    ${({ theme }) => theme.breakpoints.xl.mediaQuery} {
        grid-column: 7 / -7;
    }
`;

const MediaCaption = styled(Typography)`
    margin-top: ${({ theme }) => theme.spacing.S300};
    padding-right: calc(var(--swiper-button-size) * 2 + ${({ theme }) => theme.spacing.S300} + ${({ theme }) => theme.spacing.S500});

    /* min-height to show arrows when no caption */
    min-height: 20px;

    ${({ theme }) => theme.breakpoints.md.mediaQuery} {
        min-height: 22px;
    }
`;

const SwiperWrapper = styled(BasicSwiper)<{ $aspectRatioHorizontal: string; $aspectRatioVertical: string }>`
    --swiper-button-size: 16px;

    .swiper-button-prev,
    .swiper-button-next {
        width: var(--swiper-button-size);
        height: var(--swiper-button-size);
        position: absolute;
        z-index: 10;
        top: 0;
        transition: opacity 0.2s linear;
        cursor: pointer;

        /* Move buttons just below the image height, calculated with aspectRatio. not possible with top: 100% because this moves them down the whole slider height which is variable because of caption text */
        padding-top: ${({ theme }) => theme.spacing.S300};
        margin-top: calc(${({ $aspectRatioVertical }) => $aspectRatioVertical} / ${({ $aspectRatioHorizontal }) => $aspectRatioHorizontal} * 100%);

        &::after {
            content: "";
            width: inherit;
            height: inherit;
            display: block;

            mask-image: url("/assets/icons/arrow-right.svg");
            mask-repeat: no-repeat;
            background-color: ${({ theme }) => theme.palette.primary.main};
        }
    }

    .swiper-button-prev {
        /* Button width plus space */
        right: calc(var(--swiper-button-size) + ${({ theme }) => theme.spacing.S300});
        left: auto;

        &::after {
            transform: rotate(180deg);
        }
    }

    .swiper-button-next {
        right: 0;
    }

    /* fade text in on active slide */
    ${MediaCaption} {
        opacity: 0;
        transition: opacity 0.3s linear 0s;
    }

    .swiper-slide {
        &-active {
            ${MediaCaption} {
                opacity: 1;
                transition: opacity 0.3s linear 0.2s;
            }
        }
    }
`;
