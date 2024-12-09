import { BaseEntity, Entity, MikroORM, PrimaryKey } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";

import { generateCrudInput } from "./generate-crud-input";
import { lintSource } from "./utils/test-helper";

@Entity()
class TestEntity extends BaseEntity<TestEntity, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string;
}

describe("GenerateCrudInput", () => {
    it("shouldn't generate an update input", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntity],
            }),
        );

        const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity"), {
            nested: false,
            excludeFields: [],
            generateUpdateInput: false,
        });

        const lintedOutput = await lintSource(out[0].content);

        expect(lintedOutput).not.toContain("TestEntityUpdateInput");

        orm.close();
    });
});
