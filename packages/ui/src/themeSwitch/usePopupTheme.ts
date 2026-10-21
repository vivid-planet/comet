"use client";

import { type RefObject, useLayoutEffect, useState } from "react";

/** The theme attributes of a popup, which renders at the end of `<body>`, outside the theme switch around its trigger. */
export interface PopupThemeAttributes {
    "data-dextinity-theme"?: string;
    "data-dextinity-color-scheme"?: string;
}

/**
 * Gives a popup the theme and color scheme of the nearest element around its trigger that names them, such as a
 * `ThemeSwitch`, so the popup looks like its trigger. It reads them when the popup opens, from the DOM, so it
 * needs no React context.
 */
export function usePopupTheme(triggerRef: RefObject<Element | null>, isOpen: boolean): PopupThemeAttributes {
    const [attributes, setAttributes] = useState<PopupThemeAttributes>({});

    useLayoutEffect(() => {
        const themedElement = isOpen ? triggerRef.current?.closest("[data-dextinity-theme]") : null;
        if (!themedElement) {
            return;
        }
        setAttributes({
            "data-dextinity-theme": themedElement.getAttribute("data-dextinity-theme") ?? undefined,
            "data-dextinity-color-scheme": themedElement.getAttribute("data-dextinity-color-scheme") ?? undefined,
        });
    }, [triggerRef, isOpen]);

    return attributes;
}
