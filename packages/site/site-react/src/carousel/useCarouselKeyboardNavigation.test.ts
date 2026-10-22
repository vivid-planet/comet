import type { UseEmblaCarouselType } from "embla-carousel-react";
import type { KeyboardEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCarouselKeyboardNavigation } from "./useCarouselKeyboardNavigation";

type EmblaApi = NonNullable<UseEmblaCarouselType[1]>;

const createCarousel = ({
    selectedIndex,
    canScrollPrev = true,
    canScrollNext = true,
}: {
    selectedIndex: number;
    canScrollPrev?: boolean;
    canScrollNext?: boolean;
}) => {
    const root = document.createElement("div");
    root.tabIndex = -1;
    const buttons = Array.from({ length: 4 }, () => document.createElement("button"));
    const slides = buttons.map((button) => {
        const slide = document.createElement("div");
        slide.appendChild(button);
        root.appendChild(slide);
        return slide;
    });
    document.body.appendChild(root);

    const emblaApi = {
        slideNodes: () => slides,
        selectedScrollSnap: () => selectedIndex,
        canScrollPrev: () => canScrollPrev,
        canScrollNext: () => canScrollNext,
        scrollPrev: vi.fn(),
        scrollNext: vi.fn(),
    } as unknown as EmblaApi;

    return { root, slides, buttons, emblaApi };
};

const createKeyDownEvent = ({
    key,
    target,
    currentTarget,
    defaultPrevented = false,
}: {
    key: string;
    target: Element;
    currentTarget: HTMLElement;
    defaultPrevented?: boolean;
}) => {
    const event = {
        key,
        target,
        currentTarget,
        defaultPrevented,
        preventDefault: vi.fn(() => {
            event.defaultPrevented = true;
        }),
    };

    return event as typeof event & KeyboardEvent<HTMLElement>;
};

// Three slides per view, starting at the snap index.
const getSlidesInViewAtSnap = (snapIndex: number) => [snapIndex, snapIndex + 1, snapIndex + 2];

describe("useCarouselKeyboardNavigation", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("scrolls to the next and previous snap with the arrow keys", () => {
        const { root, emblaApi } = createCarousel({ selectedIndex: 0 });
        const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });

        handleKeyDown(createKeyDownEvent({ key: "ArrowRight", target: root, currentTarget: root }));
        handleKeyDown(createKeyDownEvent({ key: "ArrowLeft", target: root, currentTarget: root }));

        expect(emblaApi.scrollNext).toHaveBeenCalledOnce();
        expect(emblaApi.scrollPrev).toHaveBeenCalledOnce();
    });

    it("ignores other keys", () => {
        const { root, emblaApi } = createCarousel({ selectedIndex: 0 });
        const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });
        const event = createKeyDownEvent({ key: "ArrowDown", target: root, currentTarget: root });

        handleKeyDown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(emblaApi.scrollNext).not.toHaveBeenCalled();
    });

    it("doesn't scroll beyond the first or last snap", () => {
        const { root, emblaApi } = createCarousel({ selectedIndex: 1, canScrollNext: false });
        const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });

        handleKeyDown(createKeyDownEvent({ key: "ArrowRight", target: root, currentTarget: root }));

        expect(emblaApi.scrollNext).not.toHaveBeenCalled();
    });

    it("leaves the arrow keys to elements that use them", () => {
        const { root, slides, emblaApi } = createCarousel({ selectedIndex: 0 });
        const input = document.createElement("input");
        slides[0].appendChild(input);
        const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });
        const event = createKeyDownEvent({ key: "ArrowRight", target: input, currentTarget: root });

        handleKeyDown(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(emblaApi.scrollNext).not.toHaveBeenCalled();
    });

    it("ignores keys that a nested carousel has already handled", () => {
        const { root, emblaApi } = createCarousel({ selectedIndex: 0 });
        const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });

        handleKeyDown(createKeyDownEvent({ key: "ArrowRight", target: root, currentTarget: root, defaultPrevented: true }));

        expect(emblaApi.scrollNext).not.toHaveBeenCalled();
    });

    it("moves the focus to the carousel when the focused slide scrolls out of view", () => {
        const { root, buttons, emblaApi } = createCarousel({ selectedIndex: 0 });
        const button = buttons[0];
        button.focus();
        const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });

        handleKeyDown(createKeyDownEvent({ key: "ArrowRight", target: button, currentTarget: root }));

        expect(document.activeElement).toBe(root);
        expect(emblaApi.scrollNext).toHaveBeenCalledOnce();
    });

    it("keeps the focus in a slide that stays in view", () => {
        const { root, buttons, emblaApi } = createCarousel({ selectedIndex: 0 });
        const button = buttons[1];
        button.focus();
        const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });

        handleKeyDown(createKeyDownEvent({ key: "ArrowRight", target: button, currentTarget: root }));

        expect(document.activeElement).toBe(button);
    });
});
