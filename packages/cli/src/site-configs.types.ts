export type SiteConfig = {
    name: string;
    contentScope: Record<string, unknown>;
    domains: {
        main: string;
        preliminary?: string;
        pattern?: RegExp;
        additional?: string[];
        preview: string;
    };
    preloginEnabled?: boolean;
    public?: Record<string, unknown>;
};
export type SiteConfigPrivate<S extends SiteConfig> = S & {
    url: string;
    previewUrl: string;
};
export type SiteConfigPublic<S extends SiteConfig> = Pick<S, "name" | "contentScope" | "domains" | "preloginEnabled" | "public"> & {
    url: string;
    previewUrl: string;
};
