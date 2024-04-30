export type SiteConfig = {
    name: string;
    contentScope: Record<string, unknown>;
    domains: {
        main: string;
        preliminary?: string;
        pattern?: string;
        cdn?: string;
        additional?: string[];
        preview: string;
    };
    preloginEnabled?: boolean;
    public?: Record<string, unknown>;
};
export type SiteConfigPrivate<S extends SiteConfig> = Omit<S, "public"> & {
    url: string;
    previewUrl: string;
} & S["public"];
export type SiteConfigPublic<S extends SiteConfig> = Pick<S, "contentScope" | "name" | "domains" | "preloginEnabled"> & {
    url: string;
    previewUrl: string;
} & S["public"];
