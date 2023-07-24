import { BaseEntity, DateType, Entity, Enum, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrudInput } from "./generate-crud-input";
import { lintSource, parseSource } from "./utils/test-helper";

@Entity()
export class TestEntityWithString extends BaseEntity<TestEntityWithString, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;
}
@Entity()
export class TestEntityWithDate extends BaseEntity<TestEntityWithDate, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: DateType })
    foo: Date;
}
@Entity()
export class TestEntityWithBoolean extends BaseEntity<TestEntityWithBoolean, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    foo: boolean;
}

export enum TestEnumType {
    Foo = "Foo",
    Bar = "Bar",
    Baz = "Baz",
}
registerEnumType(TestEnumType, {
    name: "TestEnumType",
});
@Entity()
@ObjectType()
export class TestEntityWithEnum extends BaseEntity<TestEntityWithEnum, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Enum({ items: () => TestEnumType })
    @Field(() => TestEnumType)
    type: TestEnumType;
}
describe("GenerateCrudInput", () => {
    describe("string input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithString],
            });

            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithString"));
            //console.log(out);
            const lintedOutput = await lintSource(out[0].content);
            //console.log(lintedOutput);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            {
                const cls = classes[0];
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(1);
            }
            {
                const cls = classes[1]; //update dto
                const structure = cls.getStructure();

                expect(structure.properties?.length).toBe(0);
            }

            orm.close();
        });
    });
    describe("date input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithDate],
            });
            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithDate"));
            //console.log(out);
            const lintedOutput = await lintSource(out[0].content);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            const cls = classes[0];
            const structure = cls.getStructure();

            expect(structure.properties?.length).toBe(1);
            {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prop = structure.properties![0];
                expect(prop.name).toBe("foo");
                expect(prop.type).toBe("Date");
                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("Field");
                expect(decorators).toContain("IsDate");
                expect(decorators).toContain("IsNotEmpty");
            }

            orm.close();
        });
    });
    describe("boolean input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithBoolean],
            });
            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithBoolean"));
            //console.log(out);
            const lintedOutput = await lintSource(out[0].content);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            const cls = classes[0];
            const structure = cls.getStructure();

            expect(structure.properties?.length).toBe(1);
            {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prop = structure.properties![0];
                expect(prop.name).toBe("foo");
                expect(prop.type).toBe("boolean");
                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("Field");
                expect(decorators).toContain("IsBoolean");
                expect(decorators).toContain("IsNotEmpty");
            }

            orm.close();
        });
    });

    describe("enum input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithEnum],
            });
            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithEnum"));
            const lintedOutput = await lintSource(out[0].content);
            //console.log(lintedOutput);
            const source = parseSource(lintedOutput);

            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            const cls = classes[0];
            const structure = cls.getStructure();

            expect(structure.properties?.length).toBe(1);
            {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prop = structure.properties![0];
                expect(prop.name).toBe("type");
                expect(prop.type).toBe("TestEnumType");
                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("Field");
                expect(decorators).toContain("IsEnum");
                expect(decorators).toContain("IsNotEmpty");
            }

            orm.close();
        });
    });
});
