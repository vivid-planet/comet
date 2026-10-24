import type { BlockInterface } from "@dextinity/cms-admin";
import { useApi } from "@dextinity/serverless-core/client";
import type { ScopeSchema } from "@dextinity/serverless-core/server";
import { hc } from "hono/client";
import { createContext, type PropsWithChildren, type ReactNode, useContext, useMemo } from "react";

import type { PageTreeRoutes } from "../server/page-tree.module.js";

export type PageTreeScope = Record<string, string>;

export type PageTreeApiClient = ReturnType<typeof hc<PageTreeRoutes<ScopeSchema>>>;

/** The typed client of the page tree routes, mounted at `${apiUrl}/page-tree` (see `ApiProvider`) */
export function createPageTreeApiClient(apiUrl: string): PageTreeApiClient {
    return hc<PageTreeRoutes<ScopeSchema>>(`${apiUrl}/page-tree`);
}

export interface PageTreeRootBlock {
    /** The label of the editor's tab */
    label: ReactNode;
    block: BlockInterface;
}

export interface PageTreeDocumentType {
    label: ReactNode;
    icon: ReactNode;
    /** Shown for nodes that are hidden in the menu */
    hideInMenuIcon?: ReactNode;
    /** The admin blocks of the API's root blocks, with the same keys. The editor shows a tab for each. */
    rootBlocks: Record<string, PageTreeRootBlock>;
}

export interface PageTreeCategory {
    category: string;
    label: ReactNode;
}

interface PageTreeApi {
    client: PageTreeApiClient;
    scope: PageTreeScope;
    categories: PageTreeCategory[];
    documentTypes: Record<string, PageTreeDocumentType>;
}

const PageTreeApiContext = createContext<PageTreeApi | undefined>(undefined);

interface PageTreeApiProviderProps {
    scope: PageTreeScope;
    /** The categories of the API's config, with labels */
    categories: PageTreeCategory[];
    /** The document types of the API's config, with labels, icons and root blocks */
    documentTypes: Record<string, PageTreeDocumentType>;
}

/** Provides the typed client of the page tree routes and the scope to work in */
export function PageTreeApiProvider({ scope, categories, documentTypes, children }: PropsWithChildren<PageTreeApiProviderProps>) {
    const { apiUrl } = useApi();
    const value = useMemo<PageTreeApi>(
        () => ({ client: createPageTreeApiClient(apiUrl), scope, categories, documentTypes }),
        [apiUrl, scope, categories, documentTypes],
    );

    return <PageTreeApiContext.Provider value={value}>{children}</PageTreeApiContext.Provider>;
}

export function usePageTreeApi(): PageTreeApi {
    const pageTreeApi = useContext(PageTreeApiContext);
    if (!pageTreeApi) {
        throw new Error("usePageTreeApi must be used within a PageTreeApiProvider");
    }
    return pageTreeApi;
}
