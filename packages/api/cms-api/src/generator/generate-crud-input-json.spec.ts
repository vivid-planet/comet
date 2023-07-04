import { BaseEntity, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrudInput } from "./generate-crud-input";
import { lintSource, parseSource } from "./utils/test-helper";

@Entity()
export class TestEntityWithJson extends BaseEntity<TestEntityWithJson, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: string[] = [];

    @Property({ type: "json" })
    bar?: number[] = [];
}

describe("GenerateCrudInputJson", () => {
    describe("string input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "sqlite",
                dbName: "test-db",
                entities: [TestEntityWithJson],
            });

            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithJson"));
            //console.log(out);
            const lintedOutput = await lintSource(out[0].content);
            console.log(lintedOutput);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(2);
            }
            {
                const cls = classes[1]; //update dto
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(0);
            }

            orm.close();
        });
    });
});
