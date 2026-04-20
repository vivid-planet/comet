import { Test, type TestingModule } from "@nestjs/testing";

import { AbstractAccessControlService } from "./access-control.service";
import { type CurrentUser } from "./dto/current-user";
import { type Permission } from "./user-permissions.types";

const permissions = {
    p1: "p1" as Permission,
    p2: "p2" as Permission,
};

describe("AbstractAccessControlService", () => {
    class ConcreteAccessControlService extends AbstractAccessControlService {}

    let service: ConcreteAccessControlService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConcreteAccessControlService],
        }).compile();

        service = module.get<ConcreteAccessControlService>(ConcreteAccessControlService);
    });

    describe("isAllowed", () => {
        it("should treat null and undefined scope dimensions the same", () => {
            const user: CurrentUser = {
                id: "b26d86a7-32bb-4c84-ab9d-d167dddd40ff",
                name: "User",
                email: "user@example.com",
                permissions: [{ permission: "pageTree", contentScopes: [{ domain: "main", language: null }] }],
            };

            expect(service.isAllowed(user, "pageTree", { domain: "main" })).toBe(true);

            expect(service.isAllowed(user, "pageTree", { domain: "main", language: null })).toBe(true);

            expect(service.isAllowed(user, "pageTree", { domain: "main", language: undefined })).toBe(true);
        });
    });

    describe("getPermissionMismatches", () => {
        it("should return missing permission when permission does not exist", () => {
            expect(AbstractAccessControlService.getPermissionMismatches([], [{ permission: permissions.p1, contentScopes: [] }])).toEqual([
                { permission: permissions.p1, missingContentScopes: [] },
            ]);
        });

        it("should return missing permission when one of multiple permissions is missing", () => {
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [] }],
                    [
                        { permission: permissions.p1, contentScopes: [] },
                        { permission: permissions.p2, contentScopes: [] },
                    ],
                ),
            ).toEqual([{ permission: permissions.p2, missingContentScopes: [] }]);
        });

        it("should return missing content scopes when permission exists but content scopes are missing", () => {
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toEqual([{ permission: permissions.p1, missingContentScopes: [{ domain: "main" }] }]);
        });

        it("should return only missing content scopes when some are present", () => {
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] }],
                ),
            ).toEqual([{ permission: permissions.p1, missingContentScopes: [{ domain: "secondary" }] }]);
        });

        it("should return mismatches for wrong content scopes", () => {
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "secondary" }] }],
                ),
            ).toEqual([{ permission: permissions.p1, missingContentScopes: [{ domain: "secondary" }] }]);
        });

        it("should return mismatches when content scope dimensions differ", () => {
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main", language: "english" }] }],
                ),
            ).toEqual([{ permission: permissions.p1, missingContentScopes: [{ domain: "main", language: "english" }] }]);
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main", language: "english" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toEqual([{ permission: permissions.p1, missingContentScopes: [{ domain: "main" }] }]);
        });

        it("should return multiple mismatches for different permissions", () => {
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [
                        { permission: permissions.p1, contentScopes: [{ domain: "secondary" }] },
                        { permission: permissions.p2, contentScopes: [{ domain: "main" }] },
                    ],
                ),
            ).toEqual([
                { permission: permissions.p1, missingContentScopes: [{ domain: "secondary" }] },
                { permission: permissions.p2, missingContentScopes: [] },
            ]);
        });

        it("should return empty array for equal permissions", () => {
            expect(AbstractAccessControlService.getPermissionMismatches([], [])).toEqual([]);
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [] }],
                    [{ permission: permissions.p1, contentScopes: [] }],
                ),
            ).toEqual([]);
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toEqual([]);
        });

        it("should return empty array when user has more permissions", () => {
            expect(AbstractAccessControlService.getPermissionMismatches([{ permission: permissions.p1, contentScopes: [] }], [])).toEqual([]);
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toEqual([]);
            expect(
                AbstractAccessControlService.getPermissionMismatches(
                    [
                        { permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                        { permission: permissions.p2, contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                    ],
                    [
                        { permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                        { permission: permissions.p2, contentScopes: [{ domain: "secondary" }] },
                    ],
                ),
            ).toEqual([]);
        });
    });

    describe("isEqualOrMorePermissions", () => {
        it("should be false on fewer permissions", () => {
            expect(AbstractAccessControlService.isEqualOrMorePermissions([], [{ permission: permissions.p1, contentScopes: [] }])).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [] }],
                    [
                        { permission: permissions.p1, contentScopes: [] },
                        { permission: permissions.p2, contentScopes: [] },
                    ],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] }],
                ),
            ).toBe(false);
        });

        it("should be false on wrong permissions", () => {
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [] }],
                    [{ permission: permissions.p2, contentScopes: [] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "secondary" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main", language: "english" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main", language: "english" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [
                        { permission: permissions.p1, contentScopes: [{ domain: "secondary" }] },
                        { permission: permissions.p2, contentScopes: [{ domain: "main" }] },
                    ],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [
                        { permission: permissions.p1, contentScopes: [{ domain: "secondary" }] },
                        { permission: permissions.p2, contentScopes: [{ domain: "main" }] },
                    ],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(false);
        });

        it("should be true on equal permissions", () => {
            expect(AbstractAccessControlService.isEqualOrMorePermissions([], [])).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [] }],
                    [{ permission: permissions.p1, contentScopes: [] }],
                ),
            ).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(true);
        });

        it("should be true on more permissions", () => {
            expect(AbstractAccessControlService.isEqualOrMorePermissions([{ permission: permissions.p1, contentScopes: [] }], [])).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] }],
                    [{ permission: permissions.p1, contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [
                        { permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                        { permission: permissions.p2, contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                    ],
                    [
                        { permission: permissions.p1, contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                        { permission: permissions.p2, contentScopes: [{ domain: "secondary" }] },
                    ],
                ),
            ).toBe(true);
        });
    });
});
