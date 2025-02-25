import { BaseEntity, defineConfig, Embeddable, Embedded, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { formatGeneratedFiles, parseSource } from "./utils/test-helper";

@Embeddable()
export class TestEntityScope {
    @Property({ columnType: "text" })
    language: string;
}

@Entity()
export class TestEntity extends BaseEntity {
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
                connect: false,
                entities: [TestEntity, TestEntityScope],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity"));
        const formattedOut = await formatGeneratedFiles(out);

        {
            const file = formattedOut.find((file) => file.name === "test-entity.resolver.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);

            expect(
                source
                    .getImportDeclarations()
                    .filter((imp) => imp.getModuleSpecifierValue() === "@mikro-orm/postgresql")
                    .map((imp) => imp.getNamedImports().map((namedImp) => namedImp.getText()))
                    .flat(),
            ).toContain("ObjectQuery");

            const cls = source.getClassOrThrow("TestEntityResolver");
            const testEntitiesQuery = cls.getInstanceMethodOrThrow("testEntities");
            const bodyText = testEntitiesQuery.getBodyText();
            expect(bodyText).toContain("const where: ObjectQuery<TestEntity> = {};");
        }

        orm.close();
    });
});
