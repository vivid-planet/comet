/**
 * Resolves once React has run the effects of the last render. Base UI attaches some event listeners in effects,
 * such as a tooltip trigger's hover listener, and a play function that runs right after a fast render, as in a
 * production build, would hover before they exist.
 */
export function afterEffects() {
    return new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
}
