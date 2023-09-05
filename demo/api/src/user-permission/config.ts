import { FindUsersArgs, User, UserPermissionConfigInterface, USERPERMISSIONS } from "@comet/cms-api";
import { staticUsers } from "@src/auth/auth.module";

export const userPermissionConfig: UserPermissionConfigInterface = {
    getUser: (id: string) => {
        const index = parseInt(id) - 1;
        if (staticUsers[index]) return staticUsers[index];
        throw new Error("User not found");
    },
    findUsers: (args: FindUsersArgs) => {
        const search = args.search?.toLowerCase();
        const users = staticUsers.filter((user) => !search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
        return [users, users.length];
    },
    getAvailablePermissions: () => ({
        news: "news",
        products: "products",
    }),
    getAvailableContentScopes: () => [
        { domain: "main", language: "de" },
        { domain: "main", language: "en" },
        { domain: "secondary", language: "en" },
    ],
    getPermissionsForUser: (user: User) => {
        if (user.email.endsWith("@comet-dxp.com")) {
            return USERPERMISSIONS.allPermissions;
        } else {
            return [{ permission: "news" }];
        }
    },
    getContentScopesForUser: (user: User) => {
        if (user.email.endsWith("@comet-dxp.com")) {
            return USERPERMISSIONS.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    },
};
