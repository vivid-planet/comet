export interface PageTreeConfig {
    /** The trees of the application, e.g. `["mainNavigation", "topMenu"]` */
    categories: readonly [string, ...string[]];
    /** The document types a node can have, e.g. `["Page", "Link"]`. Only the type is stored for now, the documents (content) follow later. */
    documentTypes: readonly [string, ...string[]];
    /** Paths no page may have, e.g. routes of the site. Defaults to `/admin` and `/preview`. */
    reservedPaths?: string[];
}

export const homeSlug = "home";

export const defaultReservedPaths = ["/admin", "/preview"];
