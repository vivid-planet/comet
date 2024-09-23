import { BaseEntity, Embeddable, Embedded, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, InputType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrudInput } from "./generate-crud-input";
import { lintSource, parseSource } from "./utils/test-helper";

@Embeddable()
@InputType("TestEmbeddedInput")
export class TestEmbedded {
    @Property()
    @Field()
    test: string;
}

@Entity()
export class TestEntityWithEmbedded extends BaseEntity<TestEntityWithEmbedded, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    foo: string;

    @Embedded(() => TestEmbedded)
    embedded: TestEmbedded;
}

describe("GenerateCrudInputEmbedded", () => {
    describe("input class embedded object", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithEmbedded, TestEmbedded],
            });

            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithEmbedded"));
            const lintedOutput = await lintSource(out[0].content);
            // console.log(lintedOutput);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(2);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].type).toBe("string");
                expect(structure.properties?.[1].name).toBe("embedded");
                expect(structure.properties?.[1].type).toBe("TestEmbedded");
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
