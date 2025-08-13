import { FindUsersArgs, JwtPayload, JwtToUserServiceInterface, User, UserPermissionsUserServiceInterface, Users } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

import { staticUsers } from "./static-users";

@Injectable()
export class UserService implements UserPermissionsUserServiceInterface, JwtToUserServiceInterface {
    convertJwtToUser(jwt: JwtPayload): User {
        if (!jwt.sub) throw new Error("JWT does not contain sub");
        const user = this.getUser(jwt.sub);
        if (!user) throw new Error(`User not found: ${jwt.sub}`);
        return user;
    }
    getUser(id: string): User {
        const index = parseInt(id) - 1;
        if (staticUsers[index]) return staticUsers[index];
        throw new Error("User not found");
    }
    findUsers(args: FindUsersArgs): Users {
        const search = args.search?.toLowerCase();
        const users = staticUsers.filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
        return [users.slice(args.offset, args.offset + args.limit), users.length];
    }
}
