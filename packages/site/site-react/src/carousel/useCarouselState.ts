"use client";

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { type RefCallback, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

type EmblaOptions = NonNullable<Parameters<typeof useEmblaCarousel>[0]>;

export type CarouselOptions = Omit<EmblaOptions, "axis" | "containScroll" | "direction" | "dragFree" | "loop" | "watchFocus">;

type UseCarouselStateOptions = {
    slideCount: number;
    options?: CarouselOptions;
};

export type CarouselState = {
    emblaApi: UseEmblaCarouselType[1];
    viewportRef: UseEmblaCarouselType[0];
    rootRef: RefObject<HTMLDivElement | null>;
    previousButtonRef: RefObject<HTMLButtonElement | null>;
    nextButtonRef: RefObject<HTMLButtonElement | null>;
    getDotRef: (index: number) => RefCallback<HTMLButtonElement>;
    snapCount: number;
    hasNavigation: boolean;
    selectedIndex: number;
    canScrollPrev: boolean;
    canScrollNext: boolean;
    scrollPrev: () => void;
    scrollNext: () => void;
    scrollTo: (index: number) => void;
};

export const useCarouselState = ({ slideCount, options }: UseCarouselStateOptions): CarouselState => {
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
    const emblaOptions = useMemo<EmblaOptions>(
        () => ({
            align: "start",
            ...options,
            // Slides out of view can't be focused, so Embla doesn't need to scroll to focused slides.
            watchFocus: false,
            ...(prefersReducedMotion && { duration: 0 }),
        }),
        [options, prefersReducedMotion],
    );
    const [viewportRef, emblaApi] = useEmblaCarousel(emblaOptions);

    const rootRef = useRef<HTMLDivElement>(null);
    const previousButtonRef = useRef<HTMLButtonElement>(null);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Number of positions the carousel can stop at. Assumes one slide per view until Embla has measured the slides.
    const [snapCount, setSnapCount] = useState(slideCount);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        // A focused button that gets disabled or removed would move the focus to the document body.
        const moveFocusTo = (button: HTMLButtonElement | null, isButtonEnabled: boolean) => {
            if (button && isButtonEnabled) {
                // React only enables the button with the next render, and a disabled button can't receive the focus.
                button.disabled = false;
                button.focus();
            } else {
                rootRef.current?.focus();
            }
        };

        const syncSelection = () => {
            const canScrollPrevAfterSelect = emblaApi.canScrollPrev();
            const canScrollNextAfterSelect = emblaApi.canScrollNext();

            if (document.activeElement === previousButtonRef.current && !canScrollPrevAfterSelect) {
                moveFocusTo(nextButtonRef.current, canScrollNextAfterSelect);
            } else if (document.activeElement === nextButtonRef.current && !canScrollNextAfterSelect) {
                moveFocusTo(previousButtonRef.current, canScrollPrevAfterSelect);
            }

            setSelectedIndex(emblaApi.selectedScrollSnap());
            setCanScrollPrev(canScrollPrevAfterSelect);
            setCanScrollNext(canScrollNextAfterSelect);
        };

        // Embla re-initializes itself when the viewport is resized and when slides are added or removed.
        const syncLayout = () => {
            const snapCountAfterLayout = emblaApi.scrollSnapList().length;
            const isNavigationRemoved = snapCountAfterLayout <= 1;
            const focusedDotIndex = dotRefs.current.findIndex((dot) => dot !== null && dot === document.activeElement);
            const isFocusedDotRemoved = focusedDotIndex !== -1 && (isNavigationRemoved || focusedDotIndex >= snapCountAfterLayout);
            const isFocusedButtonRemoved =
                isNavigationRemoved && (document.activeElement === previousButtonRef.current || document.activeElement === nextButtonRef.current);

            if (isFocusedDotRemoved || isFocusedButtonRemoved) {
                rootRef.current?.focus();
            }

            setSnapCount(snapCountAfterLayout);
            syncSelection();
        };

        syncLayout();
        emblaApi.on("select", syncSelection).on("reInit", syncLayout);

        return () => {
            emblaApi.off("select", syncSelection).off("reInit", syncLayout);
        };
    }, [emblaApi]);

    const getDotRef = useCallback(
        (index: number) => (dot: HTMLButtonElement | null) => {
            dotRefs.current[index] = dot;
        },
        [],
    );

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

    return useMemo(
        () => ({
            emblaApi,
            viewportRef,
            rootRef,
            previousButtonRef,
            nextButtonRef,
            getDotRef,
            snapCount,
            hasNavigation: snapCount > 1,
            selectedIndex,
            canScrollPrev,
            canScrollNext,
            scrollPrev,
            scrollNext,
            scrollTo,
        }),
        [emblaApi, viewportRef, getDotRef, snapCount, selectedIndex, canScrollPrev, canScrollNext, scrollPrev, scrollNext, scrollTo],
    );
};
