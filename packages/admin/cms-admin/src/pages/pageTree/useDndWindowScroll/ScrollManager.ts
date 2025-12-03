interface ScrollCommand {
    direction: "forward" | "backward";
    distance: number; // Scroll-distance in pixel
}

export default class ScrollManager {
    private static MAX_MOUSE_DISTANCE_FOR_FASTEST = 50;
    private static MAX_SCROLL_DISTANCE = 50;

    public static getScrollCommand(el: HTMLElement, offsetYOfDragged: number): ScrollCommand | false {
        const { bottom, top } = ScrollManager.getBorders(el);

        const stateOfDraggable: false | { distanceToEl: number; direction: "backward" | "forward" } =
            offsetYOfDragged < top
                ? { direction: "backward", distanceToEl: top - offsetYOfDragged }
                : offsetYOfDragged > bottom
                  ? { direction: "forward", distanceToEl: offsetYOfDragged - bottom }
                  : false;
        if (!stateOfDraggable) {
            return false;
        }

        const velocity = ScrollManager.distanceToVelocity(stateOfDraggable.distanceToEl);
        return {
            direction: stateOfDraggable.direction,
            distance: Math.round(velocity * ScrollManager.MAX_SCROLL_DISTANCE),
        };
    }
    private static getBorders(el: HTMLElement): { top: number; bottom: number } {
        return {
            top: el.getBoundingClientRect().top,
            bottom: el.getBoundingClientRect().top + el.clientHeight,
        };
    }

    // Converts the mouse distance to the list-container to a velocity value
    // where 1 is fastest and 0 is slowest
    private static distanceToVelocity(distance: number): number {
        return Math.min(ScrollManager.MAX_MOUSE_DISTANCE_FOR_FASTEST, distance) / ScrollManager.MAX_MOUSE_DISTANCE_FOR_FASTEST;
    }
}
