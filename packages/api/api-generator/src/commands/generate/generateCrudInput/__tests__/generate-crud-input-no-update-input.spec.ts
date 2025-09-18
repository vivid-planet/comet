import { BaseEntity, defineConfig, Entity, MikroORM, PrimaryKey } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage.js";

import { formatSource, testPermission } from "../../utils/test-helper.js";
import { generateCrudInput } from "../generate-crud-input.js";

@Entity()
class TestEntity extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string;
}

describe("GenerateCrudInput", () => {
    it("shouldn't generate an update input", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity],
            }),
        );

        const out = await generateCrudInput(
            { targetDirectory: __dirname, requiredPermission: testPermission },
            orm.em.getMetadata().get("TestEntity"),
            {
                nested: false,
                excludeFields: [],
                generateUpdateInput: false,
            },
        );

        const formattedOut = await formatSource(out[0].content);

        expect(formattedOut).not.toContain("TestEntityUpdateInput");

        orm.close();
    });
});
