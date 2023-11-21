import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
    role?: string;
    rights?: CurrentUserRightInterface[];
    permissions?: {
        permission: string;
    }[];
    contentScopes?: ContentScope[];
}

export interface CurrentUserRightInterface {
    right: string;
    values: string[];
}

export interface CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: (data: any) => Promise<CurrentUserInterface>;
}
