import React from "react";

interface InsertInBetweenButtonHoverStatesApi {
    top: boolean;
    bottom: boolean;
    setTop: React.Dispatch<React.SetStateAction<boolean>>;
    setBottom: React.Dispatch<React.SetStateAction<boolean>>;
    defaultHandler: Record<
        "mouseOverTop" | "mouseOutTop" | "mouseOverBottom" | "mouseOutBottom",
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
    >;
}
// convinience hook to have a nicer api
export function useButtonHoverStates(): InsertInBetweenButtonHoverStatesApi {
    const [top, setTop] = React.useState(false);
    const [bottom, setBottom] = React.useState(false);

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
