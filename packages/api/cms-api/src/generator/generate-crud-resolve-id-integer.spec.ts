import { BaseEntity, Entity, PrimaryKey } from "@mikro-orm/core";
import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityWithIntegerId extends BaseEntity<TestEntityWithIntegerId, "id"> {
    @PrimaryKey({ columnType: "int", type: "integer" })
    id: number;
}

describe("GenerateCrudResolveIdInteger", () => {
    it("should generate item resolver with correctly typed id parameter", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityWithIntegerId],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithIntegerId"));
        const lintedOut = await lintGeneratedFiles(out);
        const file = lintedOut.find((file) => file.name === "test-entity-with-integer-id.resolver.ts");
        if (!file) throw new Error("File not found");
        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);
        const cls = classes[0];
        const structure = cls.getStructure();

        const singleItemMethod = structure.methods?.find((method) => method.name === "testEntityWithIntegerId");
        expect(!!singleItemMethod).toBe(true);
        expect(singleItemMethod?.parameters?.length).toBe(1);
        expect(singleItemMethod?.parameters?.[0].name).toBe("id");
        expect(singleItemMethod?.parameters?.[0].type).toBe("number");

        const updateMethod = structure.methods?.find((method) => method.name === "updateTestEntityWithIntegerId");
        expect(!!updateMethod).toBe(true);
        expect(updateMethod?.parameters?.length).toBe(2);
        expect(updateMethod?.parameters?.[0].name).toBe("id");
        expect(updateMethod?.parameters?.[0].type).toBe("number");

        const deleteMethod = structure.methods?.find((method) => method.name === "deleteTestEntityWithIntegerId");
        expect(!!deleteMethod).toBe(true);
        expect(deleteMethod?.parameters?.length).toBe(1);
        expect(deleteMethod?.parameters?.[0].name).toBe("id");
        expect(deleteMethod?.parameters?.[0].type).toBe("number");

        orm.close();
    });
});
