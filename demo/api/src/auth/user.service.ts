import { FindUsersArgs, User, UserPermissionsUserServiceInterface, Users } from "@comet/cms-api";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { staticUsers } from "./static-users";

@Injectable()
export class UserService implements UserPermissionsUserServiceInterface {
    getUser(id: string, currentUser?: User): User {
        const index = parseInt(id) - 1;
        if (staticUsers[index]) {
            if (currentUser && !currentUser.isAdmin && staticUsers[index].isAdmin) throw new UnauthorizedException("Not allowed");
            return staticUsers[index];
        }
        throw new Error("User not found");
    }
    findUsers(args: FindUsersArgs, currentUser: User): Users {
        const search = args.search?.toLowerCase();
        let users = staticUsers.filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
        if (!currentUser.isAdmin) {
            users = users.filter((u) => !u.isAdmin);
        }
        return [users, users.length];
    }
}
