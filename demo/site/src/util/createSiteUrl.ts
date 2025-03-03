import type { UrlObject } from "url";

type CreateUrlObjectWithScopeOptions = {
    /**
     * path with leading /
     *
     * Sample: "/test/to/my/page"
     */
    path: string;

    scope: {
        language: string;
    };
};

export const createUrlObjectWithScope = ({ path, scope }: CreateUrlObjectWithScopeOptions): UrlObject => {
    return {
        pathname: `/${scope.language}${path}`,
    };
};
