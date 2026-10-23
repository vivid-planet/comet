"use client";

import { type RefObject, useLayoutEffect, useState } from "react";

/** The theme attributes of a popup, which renders at the end of `<body>`, outside the theme switch around its trigger. */
export interface PopupThemeAttributes {
    "data-dextinity-theme"?: string;
    "data-dextinity-color-scheme"?: string;
}

const themeAttributeNames = ["data-dextinity-theme", "data-dextinity-color-scheme"];

/**
 * Gives a popup the theme and color scheme of the nearest element around its trigger that names them, such as a
 * `ThemeSwitch`, so the popup looks like its trigger. It reads them from the DOM, so it needs no React context:
 * when the popup opens, and again whenever they change while it's open and the trigger is on the page.
 */
export function usePopupTheme(triggerRef: RefObject<Element | null>, isOpen: boolean): PopupThemeAttributes {
    const [attributes, setAttributes] = useState<PopupThemeAttributes>({});

    useLayoutEffect(() => {
        const trigger = triggerRef.current;
        if (!isOpen || !trigger) {
            return;
        }

        const copyTheme = () => {
            // A trigger that left the page, such as the item of a menu that closed when it opened a dialog, keeps its theme.
            if (!trigger.isConnected) {
                return;
            }
            const themedElement = trigger.closest("[data-dextinity-theme]");
            const theme = themedElement?.getAttribute("data-dextinity-theme") ?? undefined;
            const colorScheme = themedElement?.getAttribute("data-dextinity-color-scheme") ?? undefined;
            setAttributes((current) =>
                current["data-dextinity-theme"] === theme && current["data-dextinity-color-scheme"] === colorScheme
                    ? current
                    : { "data-dextinity-theme": theme, "data-dextinity-color-scheme": colorScheme },
            );
        };

        copyTheme();
        const observer = new MutationObserver(copyTheme);
        observer.observe(trigger.ownerDocument.documentElement, { attributeFilter: themeAttributeNames, subtree: true });
        return () => observer.disconnect();
    }, [triggerRef, isOpen]);

    return attributes;
}
