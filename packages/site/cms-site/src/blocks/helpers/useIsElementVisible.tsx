import { RefObject, useEffect, useState } from "react";

export const useIsElementInViewport = (ref: RefObject<HTMLDivElement>) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const options = { root: null, rootMargin: "0px", threshold: 1.0 };
        const observer = new IntersectionObserver((entries) => {
            setIsVisible(entries[0].isIntersecting);
        }, options);
        if (ref.current) observer.observe(ref.current);
        const inViewRefValue = ref.current;

        return () => {
            if (inViewRefValue) observer.unobserve(inViewRefValue);
        };
    }, [ref]);

    return isVisible;
};
