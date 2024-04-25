import { BaseEntity, Embeddable, Embedded, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, InputType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrudInput } from "./generate-crud-input";
import { lintSource, parseSource } from "./utils/test-helper";

@Entity()
export class TestEntityWithJsonLiteralArray extends BaseEntity<TestEntityWithJsonLiteralArray, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: string[] = [];

    @Property({ type: "json", nullable: true })
    bar?: number[] = [];
}

@InputType()
export class NestedObject {
    test: string;
}

@Entity()
export class TestEntityWithJsonObject extends BaseEntity<TestEntityWithJsonObject, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: NestedObject;

    @Property({ type: "json" })
    bar: NestedObject[];
}

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

    @Embedded(() => TestEmbedded)
    foo: TestEmbedded;
}

@Entity()
export class TestEntityWithRecord extends BaseEntity<TestEntityWithRecord, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: Record<string, string>;
}
describe("GenerateCrudInputJson", () => {
    describe("input class literal array", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithJsonLiteralArray],
            });

            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithJsonLiteralArray"));
            const lintedOutput = await lintSource(out[0].content);
            //console.log(lintedOutput);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(2);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].hasQuestionToken).toBe(false);
                expect(structure.properties?.[0].type).toBe("string[]");
                expect(structure.properties?.[1].name).toBe("bar");
                expect(structure.properties?.[1].type).toBe("number[]");
                expect(structure.properties?.[1].hasQuestionToken).toBe(true);
            }
            {
                const cls = classes[1]; //update dto
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(0);
            }

            orm.close();
        });
    });
    describe("input class json object", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithJsonObject],
            });

            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithJsonObject"));
            const lintedOutput = await lintSource(out[0].content);
            //console.log(lintedOutput);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(2);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].type).toBe("NestedObject");
                expect(structure.properties?.[1].name).toBe("bar");
                expect(structure.properties?.[1].type).toBe("NestedObject[]");
            }
            {
                const cls = classes[1]; //update dto
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(0);
            }

            orm.close();
        });
    });
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
            //console.log(lintedOutput);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(1);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].type).toBe("TestEmbedded");
            }
            {
                const cls = classes[1]; //update dto
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(0);
            }

            orm.close();
        });
    });

    describe("input class record", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithRecord],
            });

            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithRecord"));
            const lintedOutput = await lintSource(out[0].content);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(1);
                expect(structure.properties?.[0].name).toBe("foo");
                expect(structure.properties?.[0].type).toBe("Record<string, string>");
                expect(structure.properties?.[0].decorators?.[0].name).toBe("IsNotEmpty");
                expect(structure.properties?.[0].decorators?.[1].name).toBe("Field");
                expect(structure.properties?.[0].decorators?.[1].arguments).toStrictEqual(["() => GraphQLJSONObject"]);
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
