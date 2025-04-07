import { BaseEntity, Embeddable, Embedded, Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
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

    @Embedded(() => TestEntityScope)
    scope: TestEntityScope;
}

describe("GenerateCrud without find condition", () => {
    it("where should be typed as ObjectQuery as it is when findCondition is used", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntity, TestEntityScope],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity"));
        const lintedOut = await lintGeneratedFiles(out);

        {
            const file = lintedOut.find((file) => file.name === "test-entity.resolver.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);

            expect(source.getImportDeclarationOrThrow("@mikro-orm/core").getText()).toContain("ObjectQuery");

            const cls = source.getClassOrThrow("TestEntityResolver");
            const testEntitiesQuery = cls.getInstanceMethodOrThrow("testEntities");
            const bodyText = testEntitiesQuery.getBodyText();
            expect(bodyText).toContain("const where: ObjectQuery<TestEntity> = {};");
        }

        orm.close();
    });
});
