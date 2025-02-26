type CreateSiteUrlOptions = {
    /**
     * path with leading /
     *
     * Sample: "/test/to/my/page"
     */
    path: string;

    scope: {
        language: string;
    };

    /**
     * If provided, the anchor will be appended to the resulting URL
     *
     * Sample: "my-anchor"
     */
    anchor?: string;
};
/**
 * Creates a URL from the provided options.
 *
 * @return {string} The resolved URL: /{scope.language}/test/to/my/page#my-anchor
 */
export const createSiteUrl = ({ path, scope, anchor }: CreateSiteUrlOptions) => {
    let anchorPostfix = "";
    if (anchor) {
        anchorPostfix = `#${anchor}`;
    }
    return `/${scope.language}${path}${anchorPostfix}`;
};
