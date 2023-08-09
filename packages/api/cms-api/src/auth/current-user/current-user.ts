export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
    permissions?: {
        permission: string;
        configuration?: Record<string, unknown>;
        overrideContentScopes: boolean;
        contentScopes: {
            scope: string;
            values: string[];
        }[];
    }[];
    contentScopes?: {
        scope: string;
        values: string[];
    }[];
}

export interface CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: (data: any) => Promise<CurrentUserInterface>;
}
