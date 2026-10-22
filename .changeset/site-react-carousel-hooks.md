---
"@dextinity/site-react": minor
"@dextinity/site-nextjs": minor
---

Add hooks for accessible carousels based on Embla Carousel

The hooks contain the behavior of a carousel, while the markup and the styling stay in the project:

- `useCarouselState` sets up Embla and tracks the scroll snaps. It moves the focus to the opposite button or to the carousel when a focused previous button, next button or dot is disabled or removed.
- `useCarouselVisibleSlides` measures which slides are fully visible at the target of a scroll. A project can replace it for options the hooks don't support, such as `loop`.
- `useCarouselKeyboardNavigation` scrolls with the arrow keys, unless an input or a nested carousel uses them, and keeps the focus when the focused slide scrolls out of view.
- `useCarouselNativeScrollReset` undoes native scrolling of the viewport, for example by screen readers, so only Embla moves the slides.
- `useCarouselAutoHeight` sizes the carousel to the tallest slide in view.

**Example**

```tsx
const Carousel = ({ label, slideCount, children }: CarouselProps) => {
    const { emblaApi, viewportRef, rootRef, previousButtonRef, nextButtonRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
        useCarouselState({ slideCount });
    const { slidesInView, getSlidesInViewAtSnap } = useCarouselVisibleSlides(emblaApi);
    const handleKeyDown = useCarouselKeyboardNavigation({ emblaApi, getSlidesInViewAtSnap });
    useCarouselNativeScrollReset(emblaApi);

    return (
        <div ref={rootRef} role="group" aria-roledescription="carousel" aria-label={label} tabIndex={-1} onKeyDown={handleKeyDown}>
            <button ref={previousButtonRef} type="button" disabled={!canScrollPrev} onClick={scrollPrev} aria-label="Previous slide" />
            <div ref={viewportRef} className={styles.viewport}>
                <div className={styles.container}>
                    {Children.map(children, (child, index) => (
                        <div role="group" aria-roledescription="slide" inert={slidesInView !== null && !slidesInView.includes(index)}>
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            <button ref={nextButtonRef} type="button" disabled={!canScrollNext} onClick={scrollNext} aria-label="Next slide" />
        </div>
    );
};
```
