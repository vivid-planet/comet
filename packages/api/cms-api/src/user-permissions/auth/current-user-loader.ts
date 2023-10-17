import { Inject } from "@nestjs/common";
import { CurrentUserLoaderInterface } from "src/auth/current-user/current-user-loader";

import { USER_PERMISSIONS_SERVICE } from "../user-permissions.constants";
import { UserPermissionsService } from "../user-permissions.service";

export class UserPermissionsCurrentUserLoader implements CurrentUserLoaderInterface {
    constructor(@Inject(USER_PERMISSIONS_SERVICE) private readonly service: UserPermissionsService) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(userId: string, data?: any) {
        const user = await this.service.getUser(userId);
        return { ...(await this.service.createCurrentUser(user)), ...data };
    }
}
