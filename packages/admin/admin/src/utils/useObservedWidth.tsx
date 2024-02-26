import debounce from "lodash.debounce";
import * as React from "react";

export const useObservedWidth = (ref: React.RefObject<HTMLElement>): number => {
    const [containerWidth, setContainerWidth] = React.useState(ref.current?.clientWidth ?? 0);
    const element = ref.current;

    const elementObserver = React.useMemo(() => {
        return new ResizeObserver(() => {
            debounce(() => {
                if (!element) return;
                setContainerWidth(element.clientWidth);
            }, 500)();
        });
    }, [element]);

    React.useEffect(() => {
        if (!element) return;
        elementObserver.observe(element);
        setContainerWidth(element.clientWidth);

        return () => {
            elementObserver.unobserve(element);
        };
    }, [element, elementObserver]);

    return containerWidth;
};
