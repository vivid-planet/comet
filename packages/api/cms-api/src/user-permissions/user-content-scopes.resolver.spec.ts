import { createMock } from "@golevelup/ts-vitest";
import type { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { describe, expect, it } from "vitest";

import type { ContentScopeWithLabel } from "./dto/content-scope";
import type { UserContentScopes } from "./entities/user-content-scopes.entity";
import type { ContentScope } from "./interfaces/content-scope.interface";
import type { User } from "./interfaces/user";
import { UserContentScopesResolver } from "./user-content-scopes.resolver";
import type { UserPermissionsService } from "./user-permissions.service";
import { UserPermissions } from "./user-permissions.types";

const availableContentScopes: ContentScopeWithLabel[] = [
    { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
    { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
    { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
];

function createResolver(contentScopes: ContentScope[]): UserContentScopesResolver {
    const userService = createMock<UserPermissionsService>({
        findUserOrThrow: async () => ({ id: "1", name: "User", email: "user@example.com" }) satisfies User,
        getContentScopes: async () => contentScopes,
        getAvailableContentScopes: async () => availableContentScopes,
    });

    return new UserContentScopesResolver(createMock<EntityRepository<UserContentScopes>>(), userService, createMock<EntityManager>());
}

describe("UserContentScopesResolver", () => {
    describe("userPermissionsContentScopes", () => {
        it("returns the assigned content scopes that are available", async () => {
            const resolver = createResolver([{ domain: "main", language: "en" }]);

            const contentScopes = await resolver.userPermissionsContentScopes("1");

            expect(contentScopes).toEqual([{ domain: "main", language: "en" }]);
        });

        it("keeps wildcard content scopes even though they are not part of the available content scopes", async () => {
            const resolver = createResolver([{ domain: "main", language: UserPermissions.allValues }]);

            const contentScopes = await resolver.userPermissionsContentScopes("1");

            expect(contentScopes).toEqual([{ domain: "main", language: UserPermissions.allValues }]);
        });

        it("combines available and wildcard content scopes", async () => {
            const resolver = createResolver([
                { domain: "secondary", language: "en" },
                { domain: "main", language: UserPermissions.allValues },
            ]);

            const contentScopes = await resolver.userPermissionsContentScopes("1");

            expect(contentScopes).toEqual([
                { domain: "secondary", language: "en" },
                { domain: "main", language: UserPermissions.allValues },
            ]);
        });
    });

    describe("userPermissionsAvailableContentScopeDimensions", () => {
        it("returns the dimensions from the service", async () => {
            const dimensions = [
                { name: "domain", label: "Domain" },
                { name: "language", label: "Language" },
                { name: "product", label: "Product" },
            ];
            const userService = createMock<UserPermissionsService>({
                getAvailableContentScopeDimensions: async () => dimensions,
            });
            const resolver = new UserContentScopesResolver(
                createMock<EntityRepository<UserContentScopes>>(),
                userService,
                createMock<EntityManager>(),
            );

            expect(await resolver.userPermissionsAvailableContentScopeDimensions()).toEqual(dimensions);
        });
    });
});
