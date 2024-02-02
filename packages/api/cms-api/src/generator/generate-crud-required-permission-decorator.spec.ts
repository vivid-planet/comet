import { BaseEntity, Embeddable, Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { Field } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { SyntaxKind } from "ts-morph";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Embeddable()
export class TestEntityScope {
    @Property({ columnType: "text" })
    language: string;
}

@Entity()
export class TestEntity extends BaseEntity<TestEntity, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    @Field()
    slug: string;

    @Embedded(() => TestEntityScope)
    scope: TestEntityScope;
}

@Entity()
export class TestEntityWithoutScope extends BaseEntity<TestEntityWithoutScope, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    @Field()
    slug: string;
}

const DECORATOR_NAME = "RequiredPermission";

describe("GenerateCrudRequiredPermissionDecorator", () => {
    describe("on entity with scope", () => {
        describe("without permission config", () => {
            it("should add a default decorator to resolver", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntity, TestEntityScope],
                });

                const out = await generateCrud(
                    {
                        targetDirectory: __dirname,
                    },
                    orm.em.getMetadata().get("TestEntity"),
                );
                const lintedOut = await lintGeneratedFiles(out);

                {
                    const file = lintedOut.find((file) => file.name === "test-entity.resolver.ts");
                    if (!file) throw new Error("File not found");
                    const source = parseSource(file.content);

                    const cls = source.getClassOrThrow("TestEntityResolver");
                    const decorator = cls.getDecorators().find((decorator) => decorator.getName() === DECORATOR_NAME);
                    if (!decorator) {
                        expect(decorator).not.toBeUndefined();
                    } else {
                        const firstParam = decorator.getArguments()[0].asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                        const params = firstParam.getElements().map((element) => element.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue());
                        expect(params.sort()).toEqual(["testEntities"].sort());
                    }
                }

                orm.close();
            });
        });

        describe("with string config", () => {
            it("should add a decorator to resolver", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntity, TestEntityScope],
                });

                const out = await generateCrud(
                    {
                        targetDirectory: __dirname,
                        requiredPermission: ["myTestEntityPermission"],
                    },
                    orm.em.getMetadata().get("TestEntity"),
                );
                const lintedOut = await lintGeneratedFiles(out);

                {
                    const file = lintedOut.find((file) => file.name === "test-entity.resolver.ts");
                    if (!file) throw new Error("File not found");
                    const source = parseSource(file.content);

                    const cls = source.getClassOrThrow("TestEntityResolver");
                    const decorator = cls.getDecorators().find((decorator) => decorator.getName() === DECORATOR_NAME);
                    if (!decorator) {
                        expect(decorator).not.toBeUndefined();
                    } else {
                        const firstParam = decorator.getArguments()[0].asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                        const params = firstParam.getElements().map((element) => element.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue());
                        expect(params.sort()).toEqual(["myTestEntityPermission"].sort());
                    }
                }

                orm.close();
            });
        });

        describe("with permission config", () => {
            it("should add correct decorators to all query and mutation functions", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntity, TestEntityScope],
                });

                const out = await generateCrud(
                    {
                        targetDirectory: __dirname,
                        requiredPermission: {
                            list: "testEntities",
                            create: "createTestEntity",
                            update: "updateTestEntity",
                            delete: "deleteTestEntity",
                        },
                    },
                    orm.em.getMetadata().get("TestEntity"),
                );
                const lintedOut = await lintGeneratedFiles(out);

                {
                    const file = lintedOut.find((file) => file.name === "test-entity.resolver.ts");
                    if (!file) throw new Error("File not found");
                    const source = parseSource(file.content);

                    const cls = source.getClassOrThrow("TestEntityResolver");
                    const methods = cls.getMethods();

                    // TODO testEntityBySlug
                    const checklist = [
                        { methodName: "testEntity", params: ["testEntities", "createTestEntity", "updateTestEntity", "deleteTestEntity"] },
                        { methodName: "testEntities", params: ["testEntities"] },
                        { methodName: "createTestEntity", params: ["createTestEntity"] },
                        { methodName: "updateTestEntity", params: ["updateTestEntity"] },
                        { methodName: "deleteTestEntity", params: ["deleteTestEntity"] },
                    ];
                    for (const checklistItem of checklist) {
                        const method = methods.find((method) => method.getName() === checklistItem.methodName);
                        if (!method) {
                            expect(method).not.toBeUndefined();
                        } else {
                            const decorator = method.getDecorators().find((decorator) => decorator.getName() === DECORATOR_NAME);
                            if (!decorator) {
                                expect(decorator).not.toBeUndefined();
                            } else {
                                const firstParam = decorator.getArguments()[0].asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                                const params = firstParam
                                    .getElements()
                                    .map((element) => element.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue());
                                expect(params.sort()).toEqual(checklistItem.params.sort());
                            }
                        }
                    }
                }

                orm.close();
            });
        });
    });

    describe("on entity without scope", () => {
        describe("without permission config", () => {
            it("should add a default decorator to resolver", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntityWithoutScope],
                });

                const out = await generateCrud(
                    {
                        targetDirectory: __dirname,
                    },
                    orm.em.getMetadata().get("TestEntityWithoutScope"),
                );
                const lintedOut = await lintGeneratedFiles(out);

                {
                    const file = lintedOut.find((file) => file.name === "test-entity-without-scope.resolver.ts");
                    if (!file) throw new Error("File not found");
                    const source = parseSource(file.content);

                    const cls = source.getClassOrThrow("TestEntityWithoutScopeResolver");
                    const decorator = cls.getDecorators().find((decorator) => decorator.getName() === DECORATOR_NAME);
                    if (!decorator) {
                        expect(decorator).not.toBeUndefined();
                    } else {
                        const firstParam = decorator.getArguments()[0].asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                        const params = firstParam.getElements().map((element) => element.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue());
                        expect(params.sort()).toEqual(["testEntityWithoutScopes"].sort());

                        const secondParameter = decorator.getArguments()[1].asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
                        secondParameter.getPropertyOrThrow("skipScopeCheck");
                    }
                }

                orm.close();
            });
        });

        describe("with string config", () => {
            it("should add a decorator to resolver", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntityWithoutScope],
                });

                const out = await generateCrud(
                    {
                        targetDirectory: __dirname,
                        requiredPermission: ["myTestEntityPermission"],
                    },
                    orm.em.getMetadata().get("TestEntityWithoutScope"),
                );
                const lintedOut = await lintGeneratedFiles(out);

                {
                    const file = lintedOut.find((file) => file.name === "test-entity-without-scope.resolver.ts");
                    if (!file) throw new Error("File not found");
                    const source = parseSource(file.content);

                    const cls = source.getClassOrThrow("TestEntityWithoutScopeResolver");
                    const decorator = cls.getDecorators().find((decorator) => decorator.getName() === DECORATOR_NAME);
                    if (!decorator) {
                        expect(decorator).not.toBeUndefined();
                    } else {
                        const firstParam = decorator.getArguments()[0].asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                        const params = firstParam.getElements().map((element) => element.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue());
                        expect(params.sort()).toEqual(["myTestEntityPermission"].sort());

                        const secondParameter = decorator.getArguments()[1].asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
                        secondParameter.getPropertyOrThrow("skipScopeCheck");
                    }
                }

                orm.close();
            });
        });

        describe("with permission config", () => {
            it("should add correct decorators to all query and mutation functions", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntityWithoutScope],
                });

                const out = await generateCrud(
                    {
                        targetDirectory: __dirname,
                        requiredPermission: {
                            list: "testEntities",
                            create: "createTestEntity",
                            update: "updateTestEntity",
                            delete: "deleteTestEntity",
                        },
                    },
                    orm.em.getMetadata().get("TestEntityWithoutScope"),
                );
                const lintedOut = await lintGeneratedFiles(out);

                {
                    const file = lintedOut.find((file) => file.name === "test-entity-without-scope.resolver.ts");
                    if (!file) throw new Error("File not found");
                    const source = parseSource(file.content);

                    const cls = source.getClassOrThrow("TestEntityWithoutScopeResolver");
                    const methods = cls.getMethods();

                    // TODO testEntityBySlug
                    const checklist = [
                        {
                            methodName: "testEntityWithoutScope",
                            params: ["testEntities", "createTestEntity", "updateTestEntity", "deleteTestEntity"],
                        },
                        { methodName: "testEntityWithoutScopes", params: ["testEntities"] },
                        { methodName: "createTestEntityWithoutScope", params: ["createTestEntity"] },
                        { methodName: "updateTestEntityWithoutScope", params: ["updateTestEntity"] },
                        { methodName: "deleteTestEntityWithoutScope", params: ["deleteTestEntity"] },
                    ];
                    for (const checklistItem of checklist) {
                        const method = methods.find((method) => method.getName() === checklistItem.methodName);
                        if (!method) {
                            expect(method).not.toBeUndefined();
                        } else {
                            const decorator = method.getDecorators().find((decorator) => decorator.getName() === DECORATOR_NAME);
                            if (!decorator) {
                                expect(decorator).not.toBeUndefined();
                            } else {
                                const firstParam = decorator.getArguments()[0].asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
                                const params = firstParam
                                    .getElements()
                                    .map((element) => element.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue());
                                expect(params.sort()).toEqual(checklistItem.params.sort());

                                const secondParameter = decorator.getArguments()[1].asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
                                secondParameter.getPropertyOrThrow("skipScopeCheck");
                            }
                        }
                    }
                }

                orm.close();
            });
        });
    });
});
