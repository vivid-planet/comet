import { FindUsersArgs, User, UserPermissionConfigInterface, USERPERMISSIONS } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";

export const staticUsers: User[] = [
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
export class UserPermissionConfigService implements UserPermissionConfigInterface {
    async findUsers(args: FindUsersArgs): Promise<[User[], number]> {
        const search = args.search?.toLowerCase();
        const users = staticUsers.filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
        return [users, users.length];
    }
    async getUser(id: string) {
        const index = parseInt(id) - 1;
        if (staticUsers[index]) return staticUsers[index];
        throw new Error("User not found");
    }
    getAvailableContentScopes() {
        return {
            domain: [<const>"main", <const>"secondary"],
            language: ["en", "de"],
        };
    }
    getAvailablePermissions() {
        return {
            news: "news",
            products: "products",
        };
    }
    async getPermissionsForUser(user: User) {
        if (user.email.endsWith("@comet-dxp.com")) {
            return USERPERMISSIONS.allPermissions;
        } else {
            return [{ permission: <const>"news" }];
        }
    }
    async getContentScopesForUser(user: User) {
        if (user.email.endsWith("@comet-dxp.com")) {
            return USERPERMISSIONS.allContentScopes;
        } else {
            return {
                domain: [<const>"main"],
                language: [user.language],
            };
        }
    }
}
