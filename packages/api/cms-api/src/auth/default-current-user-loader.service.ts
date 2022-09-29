import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { CurrentUserLoaderInterface } from "./interfaces/current-user-loader.interface";

@Injectable()
export class DefaultCurrentUserLoaderService implements CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(token: string, data: any): Promise<CurrentUser> {
        const user = {
            id: data.sub,
            role: data.ext?.role,
        };
        return user;
    }
}
