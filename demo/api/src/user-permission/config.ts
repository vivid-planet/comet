import { FindUsersArgs, User, UserPermissionConfigInterface, USERPERMISSIONS } from "@comet/cms-api";
import { Injectable } from "@nestjs/common";
import { staticUsers } from "@src/auth/auth.module";

@Injectable()
export class UserPermissionConfig implements UserPermissionConfigInterface {
    getUser(id: string) {
        const index = parseInt(id) - 1;
        if (staticUsers[index]) return staticUsers[index];
        throw new Error("User not found");
    }
    findUsers(args: FindUsersArgs): [User[], number] {
        const search = args.search?.toLowerCase();
        const users = staticUsers.filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
        return [users, users.length];
    }
    getAvailablePermissions() {
        return {
            news: "news",
            products: "products",
        };
    }
    getAvailableContentScopes() {
        return {
            domain: ["main", "secondary"],
            language: ["en", "de"],
        } as const;
    }
    getPermissionsForUser(user: User) {
        if (user.email.endsWith("@comet-dxp.com")) {
            return USERPERMISSIONS.allPermissions;
        } else {
            return [{ permission: "news" }];
        }
    }
    getContentScopesForUser(user: User) {
        if (user.email.endsWith("@comet-dxp.com")) {
            return USERPERMISSIONS.allContentScopes;
        } else {
            return {
                domain: ["main"] as const,
                language: [user.language],
            };
        }
    }
}
