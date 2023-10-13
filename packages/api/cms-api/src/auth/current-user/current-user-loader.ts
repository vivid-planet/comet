import { CurrentUserInterface } from "./current-user";

export interface CurrentUserLoaderInterface {
    load: (data: unknown) => Promise<CurrentUserInterface>;
}

export class CurrentUserLoader implements CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(data: any): Promise<CurrentUserInterface> {
        return data;
    }
}

export const CURRENT_USER_LOADER = "current-user-loader";
