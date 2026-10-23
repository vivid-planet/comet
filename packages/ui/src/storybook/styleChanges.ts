const listeners = new Set<() => void>();
let observer: MutationObserver | undefined;
let styleVersion = 0;

/**
 * Calls `onChange` whenever computed token values may have changed: when `<html>` switches its theme or color
 * scheme, and when a stylesheet changes, for example when Vite replaces an edited theme while Storybook runs.
 */
export function subscribeToStyleChanges(onChange: () => void) {
    listeners.add(onChange);

    if (observer === undefined) {
        observer = new MutationObserver(() => {
            styleVersion += 1;
            for (const listener of listeners) {
                listener();
            }
        });
        observer.observe(document.head, { childList: true, subtree: true, characterData: true });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-dextinity-theme", "data-dextinity-color-scheme"] });
    }

    return () => {
        listeners.delete(onChange);
        if (listeners.size === 0) {
            observer?.disconnect();
            observer = undefined;
        }
    };
}

export function getStyleVersion() {
    return styleVersion;
}
