import { Test, type TestingModule } from "@nestjs/testing";

import { AbstractAccessControlService } from "./access-control.service";
import { type CurrentUser } from "./dto/current-user";

declare module "./user-permissions.types" {
    export interface PermissionOverrides {
        accessControlServiceTest: "p1" | "p2";
    }
}

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

    describe("isEqualOrMorePermissions", () => {
        it("should be false on fewer permissions", () => {
            expect(AbstractAccessControlService.isEqualOrMorePermissions([], [{ permission: "p1", contentScopes: [] }])).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [] }],
                    [
                        { permission: "p1", contentScopes: [] },
                        { permission: "p2", contentScopes: [] },
                    ],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [] }],
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                    [{ permission: "p1", contentScopes: [{ domain: "main" }, { domain: "secondary" }] }],
                ),
            ).toBe(false);
        });

        it("should be false on wrong permissions", () => {
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [] }],
                    [{ permission: "p2", contentScopes: [] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                    [{ permission: "p1", contentScopes: [{ domain: "secondary" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                    [{ permission: "p1", contentScopes: [{ domain: "main", language: "english" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [{ domain: "main", language: "english" }] }],
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                    [
                        { permission: "p1", contentScopes: [{ domain: "secondary" }] },
                        { permission: "p2", contentScopes: [{ domain: "main" }] },
                    ],
                ),
            ).toBe(false);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [
                        { permission: "p1", contentScopes: [{ domain: "secondary" }] },
                        { permission: "p2", contentScopes: [{ domain: "main" }] },
                    ],
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(false);
        });

        it("should be true on equal permissions", () => {
            expect(AbstractAccessControlService.isEqualOrMorePermissions([], [])).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [] }],
                    [{ permission: "p1", contentScopes: [] }],
                ),
            ).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(true);
        });

        it("should be true on more permissions", () => {
            expect(AbstractAccessControlService.isEqualOrMorePermissions([{ permission: "p1", contentScopes: [] }], [])).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [{ permission: "p1", contentScopes: [{ domain: "main" }, { domain: "secondary" }] }],
                    [{ permission: "p1", contentScopes: [{ domain: "main" }] }],
                ),
            ).toBe(true);
            expect(
                AbstractAccessControlService.isEqualOrMorePermissions(
                    [
                        { permission: "p1", contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                        { permission: "p2", contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                    ],
                    [
                        { permission: "p1", contentScopes: [{ domain: "main" }, { domain: "secondary" }] },
                        { permission: "p2", contentScopes: [{ domain: "secondary" }] },
                    ],
                ),
            ).toBe(true);
        });
    });
});
