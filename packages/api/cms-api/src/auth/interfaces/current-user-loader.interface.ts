import { CurrentUser } from "../dto/current-user";

export interface CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    load: (token: string, data: any) => Promise<CurrentUser>;
}
