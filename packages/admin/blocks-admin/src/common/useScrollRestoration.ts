import * as React from "react";
import { useLocation } from "react-router";

interface UseScrollRestorationProps<Element> {
    ref: React.MutableRefObject<Element | null>;
    onScroll: () => void;
}

export function useScrollRestoration<Element extends HTMLElement>(identifier: string): UseScrollRestorationProps<Element> {
    const location = useLocation();
    const identifierForRoute = `${location.pathname}-${identifier}`;

    const ref = React.useRef<Element>(null);

    const scrollPositionsRef = React.useRef<Record<string, number | undefined>>({});

    React.useLayoutEffect((): void => {
        if (ref.current) {
            ref.current.scrollTo(0, scrollPositionsRef.current[identifierForRoute] ?? 0);
        }
    }, [identifierForRoute]);

    const onScroll = React.useCallback(() => {
        if (ref.current) {
            scrollPositionsRef.current[identifierForRoute] = ref.current.scrollTop;
        }
    }, [identifierForRoute]);

    return { ref, onScroll };
}
