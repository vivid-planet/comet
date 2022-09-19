import { CurrentUser, CurrentUserLoaderInterface } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CurrentUserLoaderService implements CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(token: string, data: any): Promise<CurrentUser> {
        const user = {
            id: data.sub,
            role: data.ext?.role,
            domains: data.ext?.domain,
        };
        return user;
    }
}
