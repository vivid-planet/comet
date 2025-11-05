import { type GQLPageTreeNodeScope } from "@src/graphql.generated";

import type { PredefinedPage } from "./predefinedPages";

type CreateSitePathOptions = {
    path: string;
    scope: Pick<GQLPageTreeNodeScope, "language">;
};

/**
 * Creates a Site path from the provided options.
 *
 * @return {string} The resolved URL: /{scope.language}/path
 */
export const createSitePath = ({ path, scope }: CreateSitePathOptions) => {
    if (!path.startsWith("/")) {
        throw new Error("Path must start with a `/`.");
    }

    return `/${scope.language}${path}`;
};

type CreatePredefinedPageSitePathOptions = {
    type: string;
    /**
     * Array of predefined pages for this scope
     *
     * - client components can get predefinedPages from context using useRouterContext().predefinedPages
     * - server components can get predefinedPages by calling fetchPredefinedPages()
     */
    predefinedPages: PredefinedPage[];
    scope: Pick<GQLPageTreeNodeScope, "language">;
    subPath: string;
};

export const createPredefinedPageSitePath = ({ type, subPath, predefinedPages, scope }: CreatePredefinedPageSitePathOptions) => {
    if (subPath && !subPath.startsWith("/")) {
        throw new Error("Path must start with a `/`.");
    }
    const page = predefinedPages.find((page) => page.type === type);
    if (!page) throw new Error(`No predefined page found for type: ${type}`); // this can happen if the predefined page is not created yet

    return `/${scope.language}${page.path}${subPath}`;
};
