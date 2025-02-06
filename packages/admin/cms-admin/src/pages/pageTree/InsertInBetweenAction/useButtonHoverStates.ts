import { type Dispatch, type MouseEvent, type SetStateAction, useState } from "react";

interface InsertInBetweenButtonHoverStatesApi {
    top: boolean;
    bottom: boolean;
    setTop: Dispatch<SetStateAction<boolean>>;
    setBottom: Dispatch<SetStateAction<boolean>>;
    defaultHandler: Record<"mouseOverTop" | "mouseOutTop" | "mouseOverBottom" | "mouseOutBottom", (event: MouseEvent<HTMLButtonElement>) => void>;
}
// convinience hook to have a nicer api
export function useButtonHoverStates(): InsertInBetweenButtonHoverStatesApi {
    const [top, setTop] = useState(false);
    const [bottom, setBottom] = useState(false);

    const defaultHandler = {
        mouseOverTop: () => {
            setTop(true);
        },
        mouseOutTop: () => {
            setTop(false);
        },
        mouseOverBottom: () => {
            setBottom(true);
        },
        mouseOutBottom: () => {
            setBottom(false);
        },
    };
    return {
        top,
        bottom,
        setTop,
        setBottom,
        defaultHandler,
    };
}
