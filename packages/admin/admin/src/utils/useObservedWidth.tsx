import debounce from "lodash.debounce";
import { RefObject, useEffect, useMemo, useState } from "react";

export const useObservedWidth = (ref: RefObject<HTMLElement>): number => {
    const [containerWidth, setContainerWidth] = useState(ref.current?.clientWidth ?? 0);
    const element = ref.current;

    const elementObserver = useMemo(() => {
        return new ResizeObserver(() => {
            debounce(() => {
                if (!element) return;
                setContainerWidth(element.clientWidth);
            }, 500)();
        });
    }, [element]);

    useEffect(() => {
        if (!element) return;
        elementObserver.observe(element);
        setContainerWidth(element.clientWidth);

        return () => {
            elementObserver.unobserve(element);
        };
    }, [element, elementObserver]);

    return containerWidth;
};
