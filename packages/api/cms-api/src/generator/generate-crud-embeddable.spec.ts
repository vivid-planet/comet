import { BaseEntity, defineConfig, Embeddable, Embedded, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, InputType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { CrudField } from "./crud-generator.decorator";
import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";
import { GeneratedFile } from "./utils/write-generated-files";

@Embeddable()
@InputType("TestEmbeddedInput")
export class TestEmbedded {
    @Property()
    @Field()
    test: string;
}

@Entity()
export class TestEntityWithEmbedded extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    foo: string;

    @Embedded(() => TestEmbedded)
    embedded: TestEmbedded;
}

@Embeddable()
@InputType("TestWithoutEmbeddedInput")
export class TestWithoutEmbedded {
    @Property()
    @Field()
    test: string;
}

@Entity()
export class TestEntityWithoutEmbedded extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    foo: string;

    @Embedded(() => TestWithoutEmbedded)
    @CrudField({ sort: false, filter: false, input: false })
    embedded: TestWithoutEmbedded;
}

describe("GenerateCrudInputEmbedded", () => {
    describe("crud classes with sort, filter, input enabled for embedded object", () => {
        let lintedOut: GeneratedFile[];
        let orm: MikroORM;
        beforeEach(async () => {
            LazyMetadataStorage.load();
            orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    connect: false,
                    entities: [TestEntityWithEmbedded, TestEmbedded],
                }),
            );

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithEmbedded"));
            lintedOut = await lintGeneratedFiles(out);
            const foundFile = lintedOut.find((file) => file.name === "test-entity-with-embedded.resolver.ts");
            if (!foundFile) throw new Error("File not found");
        });

        it("filter for embedded field should exist", async () => {
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-embedded.filter.ts");
            if (!file) throw new Error("File not found");

            // console.log(file.content);
            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(1);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(4);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].type).toBe("StringFilter");
                expect(structure.properties?.[1].name).toBe("embedded_test");
                expect(structure.properties?.[1].type).toBe("StringFilter");
                expect(structure.properties?.[2].name).toBe("and");
                expect(structure.properties?.[2].type).toBe("TestEntityWithEmbeddedFilter[]");
                expect(structure.properties?.[3].name).toBe("or");
                expect(structure.properties?.[3].type).toBe("TestEntityWithEmbeddedFilter[]");
            }

            orm.close();
        });

        it("input for embedded field should exist", async () => {
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-embedded.input.ts");
            if (!file) throw new Error("File not found");

            // console.log(file.content);
            const source = parseSource(file.content);

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

        it("sort for embedded field should exist", async () => {
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-embedded.sort.ts");
            if (!file) throw new Error("File not found");

            // console.log(file.content);
            const source = parseSource(file.content);

            const enums = source.getEnums();
            expect(enums.length).toBe(1);

            {
                const structure = enums[0].getStructure();
                expect(structure.members?.length).toBe(2);
                expect(structure.members?.[0].name).toBe("foo");
                expect(structure.members?.[1].name).toBe("embedded_test");
            }

            orm.close();
        });
    });

    describe("crud classes with sort, filter, input disabled for embedded object", () => {
        let lintedOut: GeneratedFile[];
        let orm: MikroORM;
        beforeEach(async () => {
            LazyMetadataStorage.load();
            orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    connect: false,
                    entities: [TestEntityWithoutEmbedded, TestWithoutEmbedded],
                }),
            );

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithoutEmbedded"));
            lintedOut = await lintGeneratedFiles(out);
            const foundFile = lintedOut.find((file) => file.name === "test-entity-without-embedded.resolver.ts");
            if (!foundFile) throw new Error("File not found");
        });

        it("filter for embedded field should not exist", async () => {
            const file = lintedOut.find((file) => file.name === "dto/test-entity-without-embedded.filter.ts");
            if (!file) throw new Error("File not found");

            // console.log(file.content);
            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(1);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(3);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].type).toBe("StringFilter");
                expect(structure.properties?.[1].name).toBe("and");
                expect(structure.properties?.[1].type).toBe("TestEntityWithoutEmbeddedFilter[]");
                expect(structure.properties?.[2].name).toBe("or");
                expect(structure.properties?.[2].type).toBe("TestEntityWithoutEmbeddedFilter[]");
            }

            orm.close();
        });

        it("input for embedded field should not exist", async () => {
            const file = lintedOut.find((file) => file.name === "dto/test-entity-without-embedded.input.ts");
            if (!file) throw new Error("File not found");

            // console.log(file.content);
            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(1);
                expect(structure.properties?.length).toBe(1);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].type).toBe("string");
            }
            {
                const cls = classes[1]; //update dto
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(0);
            }

            orm.close();
        });

        it("sort for embedded field should not exist", async () => {
            const file = lintedOut.find((file) => file.name === "dto/test-entity-without-embedded.sort.ts");
            if (!file) throw new Error("File not found");

            // console.log(file.content);
            const source = parseSource(file.content);

            const enums = source.getEnums();
            expect(enums.length).toBe(1);

            {
                const structure = enums[0].getStructure();
                expect(structure.members?.length).toBe(1);
                expect(structure.members?.[0].name).toBe("foo");
            }

            orm.close();
        });
    });
});
