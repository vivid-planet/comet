/**
 * Reads a future-ui component's public part names off its SCSS module. Future
 * UI's styling contract makes a module's local class names the public part
 * names (`root`, `startIcon`, `endIcon`), so the parts need no source parsing
 * beyond collecting the class selectors — owner-state styling uses `data-*`
 * attribute selectors, which are not parts.
 */

/**
 * Matches a class selector's local name. The leading boundary (start of input
 * or a character that can precede a selector) keeps `data-*` attribute
 * selectors, custom-property names (`--comet-…`), and decimals (`0.5`) from
 * being read as classes, since none of those are introduced by a `.`.
 */
const CLASS_SELECTOR_PATTERN = /(?:^|[\s,>+~(])\.(-?[A-Za-z_][\w-]*)/g;

/** Removes block and line comments so selector-like tokens inside them are ignored. */
function stripComments(scss: string): string {
    return scss.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

/**
 * The local class names declared in a SCSS module, in first-seen order and
 * deduplicated. These are the component's public part names.
 */
export function extractScssParts(scssSource: string): string[] {
    const source = stripComments(scssSource);
    const parts: string[] = [];
    for (const match of source.matchAll(CLASS_SELECTOR_PATTERN)) {
        const name = match[1];
        if (!parts.includes(name)) {
            parts.push(name);
        }
    }
    return parts;
}
