import { FindUsersArgs, User, UserPermissionsUserServiceInterface, Users } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

import { staticUsers } from "./static-users";

@Injectable()
export class UserService implements UserPermissionsUserServiceInterface {
    getUser(id: string): User {
        const user = staticUsers.find((user) => user.id === id);
        if (!user) throw new Error("User not found");
        return user;
    }
    findUsers(args: FindUsersArgs): Users {
        const search = args.search?.toLowerCase();
        const users = staticUsers.filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
        return [users, users.length];
    }
}
