export type BaseSiteConfig = {
    name: string;
    domains: {
        main: string;
        preliminary?: string;
        pattern?: string; // No RegExp because it's not serializable (necessary for Next.JS, see https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values)
        additional?: string[];
    };
    preloginEnabled?: boolean;
    public?: Record<string, unknown>;
};
export type ExtractPrivateSiteConfig<S extends BaseSiteConfig> = S & {
    url: string;
};
export type ExtractPublicSiteConfig<S extends BaseSiteConfig> = Pick<S, "name" | "domains" | "preloginEnabled" | "public"> & {
    url: string;
};
