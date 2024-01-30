import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
    permissions?: {
        permission: string;
        contentScopes: ContentScope[];
    }[];
}
