import { Inject } from "@nestjs/common";
import { CurrentUserLoaderInterface } from "src/auth/current-user/current-user-loader";

import { USER_PERMISSIONS_SERVICE } from "../user-permissions.constants";
import { UserPermissionsService } from "../user-permissions.service";

export class UserPermissionsCurrentUserLoader implements CurrentUserLoaderInterface {
    constructor(@Inject(USER_PERMISSIONS_SERVICE) private readonly service: UserPermissionsService) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async load(userData: any) {
        const user = await this.service.getUser(userData.id ?? userData.sub); // TODO Change CurrentUserLoaderInterface to avoid guesses like these
        return { ...(await this.service.createCurrentUser(user)), ...userData };
    }
}
