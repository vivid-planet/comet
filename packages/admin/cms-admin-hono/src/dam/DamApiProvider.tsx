import type { DamRoutes, DamScopeSchema } from "@dextinity/cms-hono";
import { hc } from "hono/client";
import { createContext, type PropsWithChildren, useContext, useMemo } from "react";

export type DamScope = Record<string, string>;

export type DamApiClient = ReturnType<typeof hc<DamRoutes<DamScopeSchema>>>;

interface DamApi {
    client: DamApiClient;
    scope: DamScope;
    /** Prefixes the file and image URLs of the API responses, which are relative to the API */
    resolveUrl: (path: string) => string;
}

const DamApiContext = createContext<DamApi | undefined>(undefined);

interface DamApiProviderProps {
    /** The absolute URL of the API, the DAM routes are mounted at `${apiUrl}/dam` */
    apiUrl: string;
    scope: DamScope;
}

export function DamApiProvider({ apiUrl, scope, children }: PropsWithChildren<DamApiProviderProps>) {
    const value = useMemo<DamApi>(
        () => ({
            // Preview URLs are authenticated, so the admin can show files that aren't published on the site
            client: hc<DamRoutes<DamScopeSchema>>(`${apiUrl}/dam`, { headers: { "x-preview-dam-urls": "1" } }),
            scope,
            resolveUrl: (path) => `${apiUrl}${path}`,
        }),
        [apiUrl, scope],
    );

    return <DamApiContext.Provider value={value}>{children}</DamApiContext.Provider>;
}

export function useDamApi(): DamApi {
    const damApi = useContext(DamApiContext);
    if (!damApi) {
        throw new Error("useDamApi must be used within a DamApiProvider");
    }
    return damApi;
}
