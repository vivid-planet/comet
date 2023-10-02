import { FindUsersArgs, User, UserPermissions, UserPermissionsOptions } from "@comet/cms-api";

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

export const userPermissionsOptions: UserPermissionsOptions = {
    getAvailablePermissions: () => ["news", "products"],
    getAvailableContentScopes: () => [
        { domain: "main", language: "de" },
        { domain: "main", language: "en" },
        { domain: "secondary", language: "en" },
    ],
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
    getPermissionsForUser: (user: User) => {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allPermissions;
        } else {
            return [{ permission: "news" }];
        }
    },
    getContentScopesForUser: (user: User) => {
        if (user.email.endsWith("@comet-dxp.com")) {
            return UserPermissions.allContentScopes;
        } else {
            return [{ domain: "main", language: "en" }];
        }
    },
};
