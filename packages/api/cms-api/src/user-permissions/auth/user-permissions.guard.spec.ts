import { createMock } from "@golevelup/ts-jest";
import { BaseEntity, Entity, MikroORM, PrimaryKey } from "@mikro-orm/core";
import { ExecutionContext } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";

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
    let moduleRef: ModuleRef;

    const mockAnnotations = (annotations: {
        requiredPermission?: RequiredPermissionMetadata;
        affectedEntities?: AffectedEntityMeta[];
        scopedEntity?: ScopedEntityMeta<TestEntity>;
    }) => {
        reflector.getAllAndOverride = jest.fn().mockImplementation((decorator: string) => {
            if (decorator === "requiredPermission") return annotations.requiredPermission;
            if (decorator === "affectedEntities") return annotations.affectedEntities;
            if (decorator === "scopedEntity") return annotations.scopedEntity;
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
                        locale: "en",
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
        moduleRef = createMock<ModuleRef>();
        contentScopeService = new ContentScopeService(reflector, orm, moduleRef);
        accessControlService = new AccessControlService();
        guard = new UserPermissionsGuard(reflector, contentScopeService, accessControlService);
    });

    it("allows user with exact permission", async () => {
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
    });

    it("allows user with at least one permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: true },
            },
        });
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
    });

    it("denies user with a wrong permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p2", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    it("denies user with only a partial permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1.write", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    it("denies user with empty permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    it("denies user without permissions", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [],
                }),
            ),
        ).toBe(false);
    });

    it("allows user with at least one of the required permissions", async () => {
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
    });

    it("denies user without one the the required permissions", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1", "p2"], // One of the permissions is required
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p3", contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    it("allows user with scope", async () => {
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
    });

    it("allows user with scope when submitted scope is partial", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: ["p1"],
                options: { skipScopeCheck: false },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a", b: "b" }] }],
                    args: { scope: { a: "a" } },
                }),
            ),
        ).toBe(true); // It is explicitly allowed to have a partial scope (e.g. for operations using ScopeParts). To prevent allowing empty objects, the shape of the content scope object must be checked in another place (e.g. in the Input-Object of a graphql-resolver)
    });

    it("allows user with scope when submitted scope is empty", async () => {
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
                    args: { scope: {} },
                }),
            ),
        ).toBe(true); // It is explicitly allowed to have a partial scope (e.g. for operations using ScopeParts). To prevent allowing empty objects, the shape of the content scope object must be checked in another place (e.g. in the Input-Object of a graphql-resolver)
    });

    it("denies user with wrong scope", async () => {
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
                    args: { scope: { a: "b" } },
                }),
            ),
        ).toBe(false);
    });

    it("denies user with a partial scope", async () => {
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
                    args: { scope: { a: "a", b: "b" } },
                }),
            ),
        ).toBe(false);
    });

    it("allows user by affected entity", async () => {
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
    });

    it("denies user with wrong scope by affected entity", async () => {
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
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "b" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    it("allows user by multiple affected entities", async () => {
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
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "a" }, { a: "b" }] }],
                    args: { id: [1, 2] },
                }),
            ),
        ).toBe(true);
    });

    it("denies user without all requried scopes by multiple affected entities", async () => {
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
                    args: { id: [1, 2] },
                }),
            ),
        ).toBe(false);
    });

    it("allows user by scoped entity", async () => {
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
    });

    it("denies user with wrong scope by scoped entity", async () => {
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
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "b" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    it("allows user by multiple scopes from one scoped entity", async () => {
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
    });

    it("denies user with wrong scope by multiple scopes from one scoped entity", async () => {
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
                    userPermissions: [{ permission: "p1", contentScopes: [{ a: "c" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    it("fails when RequiredPermission decorator is missing", async () => {
        mockAnnotations({});
        expect(async () =>
            guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "p1", contentScopes: [] }],
                }),
            ),
        ).rejects.toThrowError("RequiredPermission decorator is missing");
    });

    it("fails when RequiredPermission decorator has empty permissions", async () => {
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
    });

    it("fails when Content Scope cannot be acquired", async () => {
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
