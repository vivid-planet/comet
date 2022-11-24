import { Injectable } from "@nestjs/common";

import { CurrentUser } from "./dto/current-user";
import { CurrentUserLoaderInterface } from "./interfaces/current-user-loader.interface";

@Injectable()
export class DefaultCurrentUserLoaderService implements CurrentUserLoaderInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(data: any): Promise<CurrentUser> {
        return {
            id: data.sub,
            name: data.name ? data.name : data.sub,
            role: data.ext?.role,
        };
    }
}
