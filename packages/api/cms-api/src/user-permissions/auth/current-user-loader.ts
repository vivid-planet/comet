import { Injectable } from "@nestjs/common";
import { CurrentUserLoaderInterface } from "src/auth/current-user/current-user-loader";

import { UserPermissionsService } from "../user-permissions.service";

@Injectable()
export class UserPermissionsCurrentUserLoader implements CurrentUserLoaderInterface {
    constructor(private readonly service: UserPermissionsService) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(userId: string, data?: any) {
        const user = await this.service.getUser(userId);
        return { ...(await this.service.createCurrentUser(user)), ...data };
    }
}
