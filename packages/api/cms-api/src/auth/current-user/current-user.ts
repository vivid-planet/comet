export interface CurrentUserInterface {
    id: string;
    name: string;
    email: string;
    language: string;
    role: string;
    rights?: CurrentUserRightInterface[];
}

export interface CurrentUserRightInterface {
    right: string;
    values: string[];
}
