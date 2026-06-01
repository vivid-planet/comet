import type { DiscoveryService } from "@golevelup/nestjs-discovery";
import { createMock } from "@golevelup/ts-vitest";
import type { EntityRepository } from "@mikro-orm/postgresql";
import { describe, expect, it, vi } from "vitest";

import type { UserContentScopes } from "./entities/user-content-scopes.entity";
import type { UserPermission } from "./entities/user-permission.entity";
import type { User } from "./interfaces/user";
import { UserPermissionsService } from "./user-permissions.service";
import type { AccessControlServiceInterface, UserPermissionsOptions, UserPermissionsUserServiceInterface } from "./user-permissions.types";

const createService = ({
    options = {},
    userService,
}: {
    options?: UserPermissionsOptions;
    userService?: UserPermissionsUserServiceInterface;
} = {}) =>
    new UserPermissionsService(
        options,
        userService,
        createMock<AccessControlServiceInterface>(),
        createMock<EntityRepository<UserPermission>>(),
        createMock<EntityRepository<UserContentScopes>>(),
        createMock<DiscoveryService>(),
    );

describe("UserPermissionsService", () => {
    describe("isSystemUser", () => {
        it("returns true for an id listed in systemUsers", () => {
            const service = createService({ options: { systemUsers: ["system", "cron"] } });

            expect(service.isSystemUser("system")).toBe(true);
            expect(service.isSystemUser("cron")).toBe(true);
        });

        it("returns false for an id not listed in systemUsers", () => {
            const service = createService({ options: { systemUsers: ["system"] } });

            expect(service.isSystemUser("some-user-id")).toBe(false);
        });

        it("returns false when systemUsers is undefined", () => {
            const service = createService({ options: {} });

            expect(service.isSystemUser("system")).toBe(false);
        });

        it("returns false when systemUsers is empty", () => {
            const service = createService({ options: { systemUsers: [] } });

            expect(service.isSystemUser("system")).toBe(false);
        });

        it("matches by exact id (no substring or case-insensitive match)", () => {
            const service = createService({ options: { systemUsers: ["system"] } });

            expect(service.isSystemUser("System")).toBe(false);
            expect(service.isSystemUser("system-user")).toBe(false);
            expect(service.isSystemUser("")).toBe(false);
        });
    });

    describe("findUser", () => {
        const user: User = { id: "abc", name: "Max Mustermann", email: "max@example.com" };

        it("returns the user when userService resolves", async () => {
            const userService = { getUser: vi.fn().mockResolvedValue(user), findUsers: vi.fn() };
            const service = createService({ userService });

            await expect(service.findUser("abc")).resolves.toEqual(user);
            expect(userService.getUser).toHaveBeenCalledWith("abc");
        });

        it("returns null when userService rejects", async () => {
            const userService = { getUser: vi.fn().mockRejectedValue(new Error("not found")), findUsers: vi.fn() };
            const service = createService({ userService });

            await expect(service.findUser("missing")).resolves.toBeNull();
        });

        it("throws when userService is not configured", async () => {
            const service = createService({ userService: undefined });

            await expect(service.findUser("abc")).rejects.toThrow(/userService/);
        });
    });
});
