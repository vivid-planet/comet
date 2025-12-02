import { createMock } from "@golevelup/ts-jest";
import { BaseEntity, defineConfig, Entity, MikroORM, PrimaryKey } from "@mikro-orm/postgresql";
import { ExecutionContext } from "@nestjs/common";
import { ModuleRef, Reflector } from "@nestjs/core";

import { DISABLE_COMET_GUARDS_METADATA_KEY } from "../../auth/decorators/disable-comet-guards.decorator";
import { AbstractAccessControlService } from "../access-control.service";
import { ContentScopeService } from "../content-scope.service";
import { AFFECTED_ENTITY_METADATA_KEY, AffectedEntityMeta } from "../decorators/affected-entity.decorator";
import { REQUIRED_PERMISSION_METADATA_KEY, RequiredPermissionMetadata } from "../decorators/required-permission.decorator";
import { SCOPED_ENTITY_METADATA_KEY, ScopedEntityMeta } from "../decorators/scoped-entity.decorator";
import { CurrentUser } from "../dto/current-user";
import { Permission } from "../user-permissions.types";
import { UserPermissionsStorageService } from "../user-permissions-storage.service";
import { UserPermissionsGuard } from "./user-permissions.guard";

const permissions = {
    p1: "p1" as Permission,
    "p1.write": "p1.write" as Permission,
    p2: "p2" as Permission,
    p3: "p3" as Permission,
};

@Entity()
class TestEntity extends BaseEntity {
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
    let userPermissionsStorageService: UserPermissionsStorageService;
    let moduleRef: ModuleRef;

    /**
     * Helper to run tests within AsyncLocalStorage context
     */
    const testWithAls = (name: string, fn: () => void) => {
        test(name, async () => {
            await new Promise<void>((resolve, reject) => {
                userPermissionsStorageService.runWith({ user: "jest" }, async () => {
                    try {
                        await fn();
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        });
    };

    const mockAnnotations = (annotations: {
        requiredPermission?: RequiredPermissionMetadata;
        affectedEntities?: AffectedEntityMeta[];
        scopedEntity?: ScopedEntityMeta<TestEntity>;
        disableCometGuards?: boolean;
    }) => {
        reflector.getAllAndOverride = jest.fn().mockImplementation((decorator: string) => {
            if (decorator === REQUIRED_PERMISSION_METADATA_KEY) return annotations.requiredPermission;
            if (decorator === AFFECTED_ENTITY_METADATA_KEY) return annotations.affectedEntities;
            if (decorator === SCOPED_ENTITY_METADATA_KEY) return annotations.scopedEntity;
            if (decorator === DISABLE_COMET_GUARDS_METADATA_KEY) return annotations.disableCometGuards;
            return false;
        });
    };
    const mockContext = (options: { userPermissions?: CurrentUser["permissions"]; args?: unknown } = {}) => {
        return createMock<ExecutionContext>({
            switchToHttp: () => ({
                getRequest: () => ({
                    user: options.userPermissions
                        ? ({
                              id: "1",
                              name: "Admin",
                              email: "demo@comet-dxp.com",
                              permissions: options.userPermissions,
                          } satisfies CurrentUser)
                        : undefined,
                    params: options.args,
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
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntity],
                connect: false,
                allowGlobalContext: true,
            }),
        );
        moduleRef = createMock<ModuleRef>();
        contentScopeService = new ContentScopeService(reflector, orm, moduleRef);
        accessControlService = new AccessControlService();
        userPermissionsStorageService = new UserPermissionsStorageService();
        guard = new UserPermissionsGuard(reflector, contentScopeService, accessControlService, {}, userPermissionsStorageService);
    });

    test("allows bypassing", async () => {
        mockAnnotations({
            disableCometGuards: true,
        });
        expect(await guard.canActivate(mockContext())).toBe(true);
    });

    test("denies if no user is provided", async () => {
        expect(await guard.canActivate(mockContext())).toBe(false);
    });

    testWithAls("allows user with exact permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [] }],
                }),
            ),
        ).toBe(true);
    });

    testWithAls("allows user with at least one permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [
                        { permission: permissions.p2, contentScopes: [] },
                        { permission: permissions.p1, contentScopes: [] },
                    ],
                }),
            ),
        ).toBe(true);
    });

    testWithAls("denies user with a wrong permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p2, contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    testWithAls("denies user with only a partial permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions["p1.write"], contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    testWithAls("denies user with empty permission", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: "" as Permission, contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    testWithAls("denies user without permissions", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
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

    testWithAls("allows user with at least one of the required permissions", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1, permissions.p2], // One of the permissions is required
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [] }],
                }),
            ),
        ).toBe(true);
    });

    testWithAls("denies user without one of the required permissions", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1, permissions.p2], // One of the permissions is required
                options: { skipScopeCheck: true },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p3, contentScopes: [] }],
                }),
            ),
        ).toBe(false);
    });

    testWithAls("allows user with scope", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { scope: { a: "a" } },
                }),
            ),
        ).toBe(true);
    });

    testWithAls("allows user with scope when submitted scope is partial", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a", b: "b" }] }],
                    args: { scope: { a: "a" } },
                }),
            ),
        ).toBe(true); // It is explicitly allowed to have a partial scope (e.g. for operations using ScopeParts). To prevent allowing empty objects, the shape of the content scope object must be checked in another place (e.g. in the Input-Object of a graphql-resolver)
    });

    testWithAls("allows user with scope when submitted scope is empty", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { scope: {} },
                }),
            ),
        ).toBe(true); // It is explicitly allowed to have a partial scope (e.g. for operations using ScopeParts). To prevent allowing empty objects, the shape of the content scope object must be checked in another place (e.g. in the Input-Object of a graphql-resolver)
    });

    testWithAls("denies user with wrong scope", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { scope: { a: "b" } },
                }),
            ),
        ).toBe(false);
    });

    testWithAls("denies user with a partial scope", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
        });
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { scope: { a: "a", b: "b" } },
                }),
            ),
        ).toBe(false);
    });

    testWithAls("allows user by affected entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
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
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(true);
    });

    testWithAls("denies user with wrong scope by affected entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
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
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "b" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    testWithAls("allows user by multiple affected entities", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
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
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }, { a: "b" }] }],
                    args: { id: [1, 2] },
                }),
            ),
        ).toBe(true);
    });

    testWithAls("denies user without all requried scopes by multiple affected entities", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
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
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { id: [1, 2] },
                }),
            ),
        ).toBe(false);
    });

    testWithAls("allows user by scoped entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
            affectedEntities: [{ entity: TestEntity, options: { idArg: "id" } }],
            scopedEntity: (_entity) => ({ a: "a" }),
        });
        mockAffectedEntityValues([{ id: 1 }]);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(true);
    });

    testWithAls("denies user with wrong scope by scoped entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
            affectedEntities: [{ entity: TestEntity, options: { idArg: "id" } }],
            scopedEntity: (_entity) => ({ a: "a" }),
        });
        mockAffectedEntityValues([{ id: 1 }]);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "b" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    testWithAls("allows user by multiple scopes from one scoped entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
            affectedEntities: [{ entity: TestEntity, options: { idArg: "id" } }],
            scopedEntity: (_entity) => [{ a: "a" }, { a: "b" }], // One of the scopes is required
        });
        mockAffectedEntityValues([{ id: 1 }]);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(true);
    });

    testWithAls("denies user with wrong scope by multiple scopes from one scoped entity", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
            affectedEntities: [{ entity: TestEntity, options: { idArg: "id" } }],
            scopedEntity: (_entity) => [{ a: "a" }, { a: "b" }], // One of the scopes is required
        });
        mockAffectedEntityValues([{ id: 1 }]);
        expect(
            await guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "c" }] }],
                    args: { id: 1 },
                }),
            ),
        ).toBe(false);
    });

    testWithAls("fails when RequiredPermission decorator is missing", async () => {
        mockAnnotations({});
        expect(async () =>
            guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [] }],
                }),
            ),
        ).rejects.toThrowError("RequiredPermission decorator is missing");
    });

    testWithAls("fails when RequiredPermission decorator has empty permissions", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [],
                options: { skipScopeCheck: true },
            },
        });
        expect(async () =>
            guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [] }],
                }),
            ),
        ).rejects.toThrowError("RequiredPermission decorator has empty permissions");
    });

    testWithAls("fails when Content Scope cannot be acquired", async () => {
        mockAnnotations({
            requiredPermission: {
                requiredPermission: [permissions.p1],
                options: { skipScopeCheck: false },
            },
        });
        expect(async () =>
            guard.canActivate(
                mockContext({
                    userPermissions: [{ permission: permissions.p1, contentScopes: [{ a: "a" }] }],
                    args: {},
                }),
            ),
        ).rejects.toThrowError("Could not get content scope");
    });
});
