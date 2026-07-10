import type { DiscoveryService } from "@golevelup/nestjs-discovery";
import { createMock } from "@golevelup/ts-vitest";
import type { EntityRepository } from "@mikro-orm/postgresql";
import { describe, expect, it } from "vitest";

import type { UserContentScopes } from "./entities/user-content-scopes.entity";
import type { UserPermission } from "./entities/user-permission.entity";
import { UserPermissionsService } from "./user-permissions.service";
import type { AccessControlServiceInterface, UserPermissionsOptions } from "./user-permissions.types";

function createService(options: UserPermissionsOptions): UserPermissionsService {
    return new UserPermissionsService(
        options,
        undefined,
        createMock<AccessControlServiceInterface>(),
        createMock<EntityRepository<UserPermission>>(),
        createMock<EntityRepository<UserContentScopes>>(),
        createMock<DiscoveryService>(),
    );
}

describe("UserPermissionsService", () => {
    describe("getAvailableContentScopeDimensions", () => {
        it("returns the configured dimensions and humanizes missing labels", async () => {
            const service = createService({
                availableContentScopeDimensions: [{ name: "domain", label: "Domain" }, { name: "language" }, { name: "product" }],
            });

            const dimensions = await service.getAvailableContentScopeDimensions();

            expect(dimensions).toEqual([
                { name: "domain", label: "Domain" },
                { name: "language", label: "Language" },
                { name: "product", label: "Product" },
            ]);
        });

        it("resolves a factory function", async () => {
            const service = createService({
                availableContentScopeDimensions: () => [{ name: "domain" }],
            });

            const dimensions = await service.getAvailableContentScopeDimensions();

            expect(dimensions).toEqual([{ name: "domain", label: "Domain" }]);
        });

        it("derives the dimensions from the available content scopes when not configured", async () => {
            const service = createService({
                availableContentScopes: [
                    { domain: "main", language: "en" },
                    { domain: "main", language: "de" },
                ],
            });

            const dimensions = await service.getAvailableContentScopeDimensions();

            expect(dimensions).toEqual([
                { name: "domain", label: "Domain" },
                { name: "language", label: "Language" },
            ]);
        });

        it("returns no dimensions when nothing is configured", async () => {
            const service = createService({});

            const dimensions = await service.getAvailableContentScopeDimensions();

            expect(dimensions).toEqual([]);
        });
    });
});
