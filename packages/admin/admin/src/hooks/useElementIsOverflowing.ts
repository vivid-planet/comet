import React from "react";

export const useElementIsOverflowing = (ref: React.RefObject<HTMLElement>) => {
    const [isOverflowing, setIsOverflowing] = React.useState(false);

    React.useEffect(() => {
        const element = ref.current;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setIsOverflowing(entry.target.clientWidth < entry.target.scrollWidth);
            }
        });

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
            observer.disconnect();
        };
    }, [ref]);

    return isOverflowing;
};
