import { type PropsWithData, withPreview } from "@comet/site-nextjs";
import { type SliderBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import { PageLayout } from "@src/layout/PageLayout";
import styled from "styled-components";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type SliderBlockProps = PropsWithData<SliderBlockData>;

export const SliderBlock = withPreview(
    ({ data: { sliderList } }: SliderBlockProps) => {
        return (
            <PageLayout>
                <Slider>
                    <SwiperContainer>
                        <Swiper
                            modules={[Navigation]}
                            slidesPerView={3}
                            spaceBetween={20}
                            longSwipesRatio={0.1}
                            threshold={3}
                            allowTouchMove
                            watchOverflow
                            autoHeight
                        >
                            {sliderList.blocks.map((block) => (
                                <SwiperSlide key={block.key}>
                                    <SliderItemBlockRoot>
                                        <MediaWrapper>
                                            <MediaBlock data={block.props.media} fill aspectRatio="16x9" sizes="50vw" />
                                        </MediaWrapper>
                                        <RichTextBlock data={block.props.text} />
                                    </SliderItemBlockRoot>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </SwiperContainer>
                </Slider>
            </PageLayout>
        );
    },
    { label: "Slider" },
);

const Slider = styled.div`
    position: relative;
`;

const SwiperContainer = styled.div`
    overflow: hidden;

    .swiper {
        overflow: visible;
    }
`;

const SliderItemBlockRoot = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const MediaWrapper = styled.div`
    position: relative;
    height: 200px;
`;
