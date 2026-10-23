"use client";

import type { UseEmblaCarouselType } from "embla-carousel-react";
import { useEffect } from "react";

// Sizes the carousel to the tallest slide in view. The slides must not stretch to the height of the container.
export const useCarouselAutoHeight = (emblaApi: UseEmblaCarouselType[1], slidesInView: number[] | null) => {
    useEffect(() => {
        if (!emblaApi || slidesInView === null) {
            return;
        }

        const container = emblaApi.containerNode();
        const visibleSlides = slidesInView.map((index) => emblaApi.slideNodes()[index]).filter((slide) => slide !== undefined);

        const updateHeight = () => {
            container.style.height = `${Math.max(...visibleSlides.map((slide) => slide.offsetHeight))}px`;
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        for (const slide of visibleSlides) {
            resizeObserver.observe(slide);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [emblaApi, slidesInView]);
};
