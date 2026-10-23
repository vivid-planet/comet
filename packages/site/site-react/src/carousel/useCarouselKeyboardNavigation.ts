import type { UseEmblaCarouselType } from "embla-carousel-react";
import type { KeyboardEvent } from "react";

const arrowKeyConsumerSelector = [
    "input",
    "textarea",
    "select",
    '[contenteditable]:not([contenteditable="false"])',
    '[role="slider"]',
    '[role="spinbutton"]',
    '[role="textbox"]',
].join(", ");

const consumesArrowKeys = (target: EventTarget) => target instanceof Element && target.closest(arrowKeyConsumerSelector) !== null;

type UseCarouselKeyboardNavigationOptions = {
    emblaApi: UseEmblaCarouselType[1];
    getSlidesInViewAtSnap: (snapIndex: number) => number[];
};

/**
 * Returns the `onKeyDown` handler for the carousel root, which has to be focusable (`tabIndex={-1}`), because the focus
 * moves there when the focused slide scrolls out of view.
 */
export const useCarouselKeyboardNavigation = ({ emblaApi, getSlidesInViewAtSnap }: UseCarouselKeyboardNavigationOptions) => {
    return (event: KeyboardEvent<HTMLElement>) => {
        // A nested carousel or an element in a slide has already handled the key.
        if (event.defaultPrevented) {
            return;
        }

        if (!emblaApi || (event.key !== "ArrowLeft" && event.key !== "ArrowRight") || consumesArrowKeys(event.target)) {
            return;
        }

        event.preventDefault();

        const isPrevious = event.key === "ArrowLeft";

        if (isPrevious ? !emblaApi.canScrollPrev() : !emblaApi.canScrollNext()) {
            return;
        }

        const focusedSlideIndex = emblaApi.slideNodes().findIndex((slide) => slide.contains(event.target as Node));
        const targetSnapIndex = emblaApi.selectedScrollSnap() + (isPrevious ? -1 : 1);

        // A slide that scrolls out of view becomes inert, which would move its focus to the document body.
        if (focusedSlideIndex !== -1 && !getSlidesInViewAtSnap(targetSnapIndex).includes(focusedSlideIndex)) {
            event.currentTarget.focus();
        }

        if (isPrevious) {
            emblaApi.scrollPrev();
        } else {
            emblaApi.scrollNext();
        }
    };
};
