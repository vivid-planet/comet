import { CurrentUserInterface } from "./current-user";

export interface CurrentUserLoaderInterface {
    load: (userId: string, data?: unknown) => Promise<CurrentUserInterface>;
}

export const CURRENT_USER_LOADER = "current-user-loader";
