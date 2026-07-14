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

    describe("findUsersByIds", () => {
        const userA: User = { id: "a", name: "User A", email: "a@example.com" };
        const userB: User = { id: "b", name: "User B", email: "b@example.com" };

        it("uses findUsersByIds of the userService and returns users in the order of the passed ids", async () => {
            const userService = { findUsersByIds: vi.fn().mockResolvedValue([userB, userA]), findUsers: vi.fn() };
            const service = createService({ userService });

            await expect(service.findUsersByIds(["a", "missing", "b"])).resolves.toEqual([userA, null, userB]);
            expect(userService.findUsersByIds).toHaveBeenCalledTimes(1);
            expect(userService.findUsersByIds).toHaveBeenCalledWith(["a", "missing", "b"]);
        });

        it("falls back to findUser per id when the userService doesn't implement findUsersByIds", async () => {
            const findUser = vi.fn().mockImplementation((id: string) => (id === "a" ? userA : null));
            const userService = { findUser, findUsers: vi.fn() };
            const service = createService({ userService });

            await expect(service.findUsersByIds(["a", "missing"])).resolves.toEqual([userA, null]);
            expect(findUser).toHaveBeenCalledTimes(2);
        });
    });
});
