type SlideBounds = {
    start: number;
    end: number;
};

type GetSlidesInViewOptions = {
    slides: SlideBounds[];
    viewportSize: number;
    /** Scroll progress of the scroll snap, between 0 and 1, as returned by Embla's `scrollSnapList()`. */
    scrollProgress: number;
};

// Offsets are rounded to whole pixels.
const tolerance = 1;

export const getSlidesInView = ({ slides, viewportSize, scrollProgress }: GetSlidesInViewOptions) => {
    if (slides.length === 0) {
        return [];
    }

    const contentStart = Math.min(...slides.map((slide) => slide.start));
    const contentEnd = Math.max(...slides.map((slide) => slide.end));
    const scrollLength = Math.max(0, contentEnd - contentStart - viewportSize);
    const viewStart = contentStart + scrollProgress * scrollLength;
    const viewEnd = viewStart + viewportSize;

    return slides.flatMap((slide, index) => (slide.start >= viewStart - tolerance && slide.end <= viewEnd + tolerance ? [index] : []));
};
