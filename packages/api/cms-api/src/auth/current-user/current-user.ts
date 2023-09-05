import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
    permissions?: {
        permission: string;
        configuration?: Record<string, unknown>;
        overrideContentScopes: boolean;
        contentScopes: ContentScope[];
    }[];
    contentScopes?: ContentScope[];
}

export interface CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: (data: any) => Promise<CurrentUserInterface>;
}
