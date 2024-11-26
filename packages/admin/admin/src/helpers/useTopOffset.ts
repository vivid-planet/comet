import { useEffect, useState } from "react";

export const useTopOffset = (ref: React.RefObject<HTMLElement>) => {
    const [topOffset, setTopOffset] = useState(0);

    useEffect(() => {
        const updateTopOffset = () => {
            if (ref.current) {
                setTopOffset(ref.current.getBoundingClientRect().top);
            }
        };

        updateTopOffset();
        window.addEventListener("resize", updateTopOffset);

        return () => {
            window.removeEventListener("resize", updateTopOffset);
        };
    }, [ref]);

    return topOffset;
};
