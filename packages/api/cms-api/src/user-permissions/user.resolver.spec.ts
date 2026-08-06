import { createMock } from "@golevelup/ts-vitest";
import { describe, expect, it } from "vitest";

import type { UserPermissionsUser } from "./dto/user";
import type { UserPermission } from "./entities/user-permission.entity";
import { UserResolver } from "./user.resolver";
import type { UserContentScopesLoaderService } from "./user-content-scopes-loader.service";
import type { UserPermissionsService } from "./user-permissions.service";

describe("UserResolver", () => {
    describe("permissionsCount", () => {
        it("counts a permission granted both by rule and manually only once", async () => {
            const userService = createMock<UserPermissionsService>({
                getPermissions: async () => [{ permission: "pageTree" }, { permission: "pageTree" }, { permission: "dam" }] as UserPermission[],
            });
            const resolver = new UserResolver(userService, createMock<UserContentScopesLoaderService>());

            expect(await resolver.permissionsCount({ id: "1" } as UserPermissionsUser)).toBe(2);
        });
    });
});
