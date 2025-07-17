"use client";
import { PixelImageBlock, PropsWithData, withPreview } from "@comet/site-nextjs";
import { ProductListCarouselBlockData } from "@src/blocks.generated";
import styled from "styled-components";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation]);

type ProductListCarouselProps = PropsWithData<ProductListCarouselBlockData>;

export const ProductListCarouselBlock = withPreview(
    ({ data }: ProductListCarouselProps) => {
        return (
            <Wrapper>
                <Swiper
                    modules={[Navigation]}
                    slidesPerView={3}
                    spaceBetween={20}
                    navigation
                    longSwipesRatio={0.1}
                    threshold={3}
                    allowTouchMove
                    watchOverflow
                >
                    {data.products.blocks.map((block) => (
                        <SwiperSlide key={block.key}>
                            <Item>
                                <PixelImageBlock data={block.props.image} aspectRatio="1x1" />
                                <Name>{block.props.name}</Name>
                            </Item>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Wrapper>
        );
    },
    { label: "Product Carousel" },
);

const Wrapper = styled.div`
    position: relative;
`;

const Item = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Name = styled.div`
    margin-top: 8px;
`;
