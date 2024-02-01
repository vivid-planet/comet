import { ContentScope } from "../../user-permissions/interfaces/content-scope.interface";

export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
    contentScopes?: ContentScope[] | null; // null means all
    permissions?: {
        permission: string;
        contentScopes: ContentScope[] | null; // null means contentScopes from above
    }[];
}
