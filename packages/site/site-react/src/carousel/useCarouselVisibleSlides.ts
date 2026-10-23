"use client";

import type { UseEmblaCarouselType } from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { getSlidesInView } from "./getSlidesInView";

export const useCarouselVisibleSlides = (emblaApi: UseEmblaCarouselType[1]) => {
    // `null` until the slides have been measured, for example in the server render.
    const [slidesInView, setSlidesInView] = useState<number[] | null>(null);

    const getSlidesInViewAtSnap = useCallback(
        (snapIndex: number) => {
            if (!emblaApi) {
                return [];
            }

            return getSlidesInView({
                slides: emblaApi.slideNodes().map((slide) => ({ start: slide.offsetLeft, end: slide.offsetLeft + slide.offsetWidth })),
                viewportSize: emblaApi.rootNode().clientWidth,
                scrollProgress: emblaApi.scrollSnapList()[snapIndex] ?? 0,
            });
        },
        [emblaApi],
    );

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        // Uses the target of the scroll, because Embla's `slidesInView()` only updates after the animation has ended.
        const syncSlidesInView = () => {
            setSlidesInView(getSlidesInViewAtSnap(emblaApi.selectedScrollSnap()));
        };

        syncSlidesInView();
        emblaApi.on("select", syncSlidesInView).on("reInit", syncSlidesInView);

        return () => {
            emblaApi.off("select", syncSlidesInView).off("reInit", syncSlidesInView);
        };
    }, [emblaApi, getSlidesInViewAtSnap]);

    return { slidesInView, getSlidesInViewAtSnap };
};
