import { BaseEntity, Embeddable, Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { ScopedEntity } from "../user-permissions/decorators/scoped-entity.decorator";
import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
@ScopedEntity<TestEntityWithScopedEntity>((entity) => {
    return { language: entity.language };
})
export class TestEntityWithScopedEntity extends BaseEntity<TestEntityWithScopedEntity, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ columnType: "text" })
    language: string;
}

describe("GenerateCrud with ScopedEntity", () => {
    it("resolver must not have skipScopeCheck", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityWithScopedEntity],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithScopedEntity"));
        const lintedOut = await lintGeneratedFiles(out);

        {
            const file = lintedOut.find((file) => file.name === "test-entity-with-scoped-entity.resolver.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);

            const cls = source.getClassOrThrow("TestEntityWithScopedEntityResolver");
            const requiredPermissionDecorator = cls.getDecorators().find((decorator) => decorator.getName() === "RequiredPermission");
            if (!requiredPermissionDecorator) throw new Error("RequiredPermission decorator not found");
            const args = requiredPermissionDecorator.getArguments();
            expect(args.length).toBe(1); //must not contain a second argument with { skipScopeCheck: true }
        }

        orm.close();
    });
});

@Embeddable()
export class TestEntityScope {
    @Property({ columnType: "text" })
    language: string;
}

@Entity()
export class TestEntityWithScope extends BaseEntity<TestEntityWithScope, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Embedded(() => TestEntityScope)
    scope: TestEntityScope;
}

describe("GenerateCrud with Scope", () => {
    it("resolver must not have skipScopeCheck", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityWithScope],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithScope"));
        const lintedOut = await lintGeneratedFiles(out);

        {
            const file = lintedOut.find((file) => file.name === "test-entity-with-scope.resolver.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);

            const cls = source.getClassOrThrow("TestEntityWithScopeResolver");
            const requiredPermissionDecorator = cls.getDecorators().find((decorator) => decorator.getName() === "RequiredPermission");
            if (!requiredPermissionDecorator) throw new Error("RequiredPermission decorator not found");
            const args = requiredPermissionDecorator.getArguments();
            expect(args.length).toBe(1); //must not contain a second argument with { skipScopeCheck: true }
        }

        orm.close();
    });
});
