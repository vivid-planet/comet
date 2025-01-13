type ResolveUrlOptions = {
    /**
     * the baseUrl will be prepended to the resulting path
     *
     * Sample: "http://localhost:3000"
     * @default: "/"
     */
    baseUrl?: string;

    /**
     * path with leading /
     *
     * Sample: "/test/to/my/page"
     */
    path: string;

    scope: {
        language: string;
    } | null;

    /**
     * If provided, the anchor will be appended to the resulting URL
     *
     * Sample: "my-anchor"
     */
    anchor?: string;
};

/**
 * Resolves a path, scope and a baseUrl to a real URL which can be navigated to.
 *
 * @return {string} The resolved URL: /{scope.language}/test/to/my/page#my-anchor
 */
export const resolveUrl = ({ baseUrl = "/", path, scope, anchor }: ResolveUrlOptions) => {
    let safeScope = "";
    if (scope != null) {
        safeScope = scope.language;
    }
    let anchorPostfix = "";
    if (anchor) {
        anchorPostfix = `#${anchor}`;
    }
    return `${baseUrl}${safeScope}${path}${anchorPostfix}`;
};
