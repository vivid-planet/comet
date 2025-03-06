type CreateSitePathOptions = {
    path: string;
    scope: {
        language: string;
    };
};

/**
 * Creates a Site path from the provided options.
 *
 * @return {string} The resolved URL: /{scope.language}/path
 */
export const createSitePath = ({ path, scope }: CreateSitePathOptions) => {
    if (path.startsWith("/")) {
        return `/${scope.language}${path}`;
    }

    return `/${scope.language}/${path}`;
};
