import { type RefObject, useCallback, useRef } from "react";
import { useDragDropManager } from "react-dnd";
import { type ListOnScrollProps } from "react-window";

import ScrollManager from "./ScrollManager";
import useAnimationFrame from "./useAnimationFrame";

interface UseSmoothScrollApi {
    onScroll: (props: ListOnScrollProps) => void;
    outerRef: RefObject<HTMLElement | null>;
}

export function useDndWindowScroll(): UseSmoothScrollApi {
    const domRef = useRef<HTMLElement>(null); // Dom-el to the virtual-list-element
    const scrollPosition = useRef<ListOnScrollProps>(undefined); // Scroll-position of the virtual-list-element
    const ddm = useDragDropManager();

    // Manipulating the dom directly with dom-api
    // Changes the scroll position on every frame, when the drag-onject is over or below the virtual-list-element
    // Scrolling-velocity varies with the distance of the dragged-object to virtual-list-element
    const handleListScroll = useCallback(() => {
        const monitor = ddm.getMonitor();

        // Is the user dragging an object?
        const isDragging = monitor && monitor.getClientOffset() ? true : false; // monitor.isDragging() does not return relyable results, indicating dragging by asking for the client-offset works

        if (domRef.current && monitor && isDragging) {
            const scrollCommand = ScrollManager.getScrollCommand(domRef.current, monitor.getClientOffset()?.y || 0);
            if (scrollCommand) {
                const offset = scrollPosition.current?.scrollOffset || 0;
                const nextOffset =
                    scrollCommand.direction === "backward"
                        ? Math.max(offset - scrollCommand.distance, 0)
                        : Math.min(offset + scrollCommand.distance, Number.MAX_SAFE_INTEGER); // @TODO: replace Number.MAX_SAFE_INTEGER with the height of the virtual-list
                if (nextOffset !== offset) {
                    domRef.current?.scrollTo({ behavior: "auto", left: 0, top: nextOffset });
                }
            }
        }
    }, [ddm]); // ddm is a reference itself, that's why we could also omit ddm-dependency

    // Update the current scroll position on every scroll
    const handleScroll = useCallback((props: ListOnScrollProps) => {
        scrollPosition.current = props;
    }, []);

    // Call handleListScroll on every frame
    useAnimationFrame(handleListScroll);

    // Props must be passed to the virtual list
    return {
        onScroll: handleScroll,
        outerRef: domRef,
    };
}
