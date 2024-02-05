import * as React from "react";
import { useLocation } from "react-router";

const scrollPositions: Record<string, number | undefined> = {};

interface UseScrollRestorationProps<Element> {
    ref: React.MutableRefObject<Element | null>;
    onScroll: () => void;
}

export function useScrollRestoration<Element extends HTMLElement>(identifier: string): UseScrollRestorationProps<Element> {
    const location = useLocation();
    const identifierForRoute = `${location.pathname}-${identifier}`;

    const ref = React.useRef<Element>(null);

    React.useLayoutEffect((): void => {
        if (ref.current) {
            ref.current.scrollTo(0, scrollPositions[identifierForRoute] ?? 0);
        }
    }, [identifierForRoute]);

    for (const key of Object.keys(scrollPositions)) {
        const keyWithoutIdentifier = key.replace(`-${identifier}`, "");

        if (keyWithoutIdentifier.startsWith(location.pathname) && keyWithoutIdentifier !== location.pathname) {
            scrollPositions[key] = 0;
        }
    }

    const onScroll = React.useCallback(() => {
        if (ref.current) {
            scrollPositions[identifierForRoute] = ref.current.scrollTop;
        }
    }, [identifierForRoute]);

    return { ref, onScroll };
}
