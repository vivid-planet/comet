export type SiteConfig<ContentScope = object, Private = object, Public = object> = {
    name: string;
    contentScope: ContentScope;
    domains: {
        main: string;
        preliminary?: string;
        pattern?: string;
        cdn?: string;
        additional?: string[];
        preview: string;
    };
    preloginEnabled?: boolean;
    public?: Public;
} & Private;
export type SiteConfigPrivate<S extends SiteConfig<object, object, object>> = Omit<S, "public"> & {
    url: string;
    previewUrl: string;
} & S["public"];
export type SiteConfigPublic<S extends SiteConfig<object, object, object>> = Pick<S, "contentScope" | "name" | "domains" | "preloginEnabled"> & {
    url: string;
    previewUrl: string;
} & S["public"];
