import { useEffect } from "react";

export const useIsElementInViewport = (ref: React.RefObject<Element>, callback: (inView: boolean) => void) => {
    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                callback(entry.isIntersecting);
            },
            { threshold: 0.5 },
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, callback]);
};
