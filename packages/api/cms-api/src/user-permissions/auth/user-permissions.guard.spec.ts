import { createMock } from "@golevelup/ts-jest";
import { BaseEntity, Entity, MikroORM, PrimaryKey } from "@mikro-orm/core";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { AbstractAccessControlService } from "../access-control.service";
import { ContentScopeService } from "../content-scope.service";
import { AffectedEntityMeta } from "../decorators/affected-entity.decorator";
import { RequiredPermissionMetadata } from "../decorators/required-permission.decorator";
import { ScopedEntityMeta } from "../decorators/scoped-entity.decorator";
import { CurrentUser } from "../dto/current-user";
import { UserPermissionsGuard } from "./user-permissions.guard";

@Entity()
class TestEntity extends BaseEntity<TestEntity, "id"> {
    @PrimaryKey()
    id: number;
}

class AccessControlService extends AbstractAccessControlService {}

describe("UserPermissionsGuard", () => {
    let guard: UserPermissionsGuard;
    let reflector: Reflector;
    let orm: MikroORM;
    let contentScopeService: ContentScopeService;
    let accessControlService: AccessControlService;

    const mockAnnotations = (annotations: {
        requiredPermission?: RequiredPermissionMetadata;
        affectedEntities?: AffectedEntityMeta[];
        scopedEntity?: ScopedEntityMeta["fn"];
    }) => {
        reflector.getAllAndOverride = jest.fn().mockImplementation((decorator: string) => {
            if (decorator === "requiredPermission") return annotations.requiredPermission;
            if (decorator === "affectedEntities") return annotations.affectedEntities;
            if (decorator === "scopedEntity") return { fn: annotations.scopedEntity };
            return false;
        });
    };
    const mockContext = (context: { userPermissions: CurrentUser["permissions"]; args?: unknown }) => {
        return createMock<ExecutionContext>({
            switchToHttp: () => ({
                getRequest: () => ({
                    user: {
                        id: "1",
                        name: "Admin",
                        email: "demo@comet-dxp.com",
                        language: "en",
                        permissions: context.userPermissions,
                    } satisfies CurrentUser,
                    params: context.args,
                }),
            }),
        });
    };
    const mockAffectedEntityValues = (values: { id: number; [key: string]: unknown }[]) => {
        orm.em.getRepository = jest
            .fn()
            .mockReturnValue({ findOneOrFail: jest.fn().mockImplementation((id: number) => values.find((v) => v.id === id)) });
    };

    beforeEach(async () => {
        reflector = new Reflector();
        orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [TestEntity],
            connect: false,
            allowGlobalContext: true,
        });
        contentScopeService = new ContentScopeService(reflector, orm);
        accessControlService = new AccessControlService();
        guard = new UserPermissionsGuard(reflector, contentScopeService, accessControlService);
    });

    test("basic permission check", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: true },
            },
        });

        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [] }],
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [
                        { permission: "p2", contentScopes: [] },
                        { permission: "p1", contentScopes: [] },
                    ],
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p2", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1.write", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [],
                }),
            ),
        ).toBe(false);
    });

    test("multiple permission check", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1", "p2"], // One of the permissions is required
                options: { skipScopeCheck: true },
            },
        });

        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [] }],
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p2", contentScopes: [] }],
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p3", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    test("content scope check by argument", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: false },
            },
        });

        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { scope: { a: "a" } },
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a", b: "b" }] }],
                    args: { scope: { a: "a" } },
                }),
            ),
        ).toBe(true); // The shape of the content scope object must be defined in the Input-Object (to be able to handle ScopeParts correctly)
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { scope: {} },
                }),
            ),
        ).toBe(true); // The shape of the content scope object must be defined in the Input-Object (to be able to handle ScopeParts correctly)
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { scope: { a: "b" } },
                }),
            ),
        ).toBe(false);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { scope: { a: "a", b: "b" } },
                }),
            ),
        ).toBe(false);
    });

    test("content scope check by affected entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: false },
            },
            affectedEntities: [{ entity: TestEntity, options: { idArg: "id" } }],
        });
        mockAffectedEntityValues([
            { id: 1, scope: { a: "a" } },
            { id: 2, scope: { a: "b" } },
        ]);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "b" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "b" }] }],
                    args: { id: 2 },
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }, { a: "b" }] }],
                    args: { id: [1, 2] },
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { id: [1, 2] },
                }),
            ),
        ).toBe(false);
    });

    test("content scope check by scoped entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: false },
            },
            affectedEntities: [{ entity: TestEntity, options: { idArg: "id" } }],
            scopedEntity: (_entity) => ({ a: "a" }),
        });
        mockAffectedEntityValues([{ id: 1 }]);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "b" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    test("multiple content scopes check by scoped entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: false },
            },
            affectedEntities: [{ entity: TestEntity, options: { idArg: "id" } }],
            scopedEntity: (_entity) => [{ a: "a" }, { a: "b" }], // One of the scopes is required
        });
        mockAffectedEntityValues([{ id: 1 }]);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }, { a: "c" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(true);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "c" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    test("errors", async () => {
        mockAnnotations({});
        expect(async () =>
            guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [] }],
                }),
            ),
        ).rejects.toThrowError("RequiredPermission decorator is missing");

        mockAnnotations({
            requiredPermission: {
                requiredPermission: [],
                options: { skipScopeCheck: true },
            },
        });
        expect(async () =>
            guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [] }],
                }),
            ),
        ).rejects.toThrowError("RequiredPermission decorator has empty permissions");

        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: false },
            },
        });
        expect(async () =>
            guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }] }],
                    args: {},
                }),
            ),
        ).rejects.toThrowError("Could not get content scope");
    });
});
