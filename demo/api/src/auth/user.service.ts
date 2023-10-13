import { ContentScopesForUser, FindUsersArgs, PermissionsForUser, User, UserPermissions, UserPermissionsUserService, Users } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

const staticUsers: User[] = [
    {
        id: "1",
        name: "Admin",
        email: "demo@comet-dxp.com",
        language: "en",
    },
    {
        id: "2",
        name: "Non-Admin",
        email: "test@test.com",
        language: "en",
    },
];

@Injectable()
export class UserService implements UserPermissionsUserService {
    getUser(id: string): User {
        const index = parseInt(id) - 1;
        if (staticUsers[index]) return staticUsers[index];
        throw new Error("User not found");
    }
    findUsers(args: FindUsersArgs): Users {
        const search = args.search?.toLowerCase();
        const users = staticUsers.filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
        return [users, users.length];
    }
    getPermissionsForUser(user: User): PermissionsForUser {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allPermissions;
        } else {
            return [{ permission: "news" }];
        }
    }
    getContentScopesForUser(user: User): ContentScopesForUser {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    }
}
