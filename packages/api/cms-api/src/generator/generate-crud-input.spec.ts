import { BaseEntity, DateType, Entity, Enum, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
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

@Entity()
export class TestEntityWithUuid extends BaseEntity<TestEntityWithUuid, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "uuid" })
    fooId: string;
}

@Entity()
export class TestEntityWithTextRuntimeType extends BaseEntity<TestEntityWithTextRuntimeType, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "text" })
    title: string;
}

@Entity()
export class TestEntityWithNullablePropWithInitializer extends BaseEntity<TestEntityWithNullablePropWithInitializer, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "text", nullable: true })
    title?: string = undefined;
}

@Entity()
export class TestEntityWithNullablePropWithoutInitializer extends BaseEntity<TestEntityWithNullablePropWithoutInitializer, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "text", nullable: true })
    title?: string;
}

describe("GenerateCrudInput", () => {
    describe("string input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithString],
                }),
            );

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
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithDate],
                }),
            );
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
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithBoolean],
                }),
            );
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
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithEnum],
                }),
            );
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

    describe("uuid input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithUuid],
                }),
            );
            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithUuid"));
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
                expect(prop.name).toBe("fooId");
                expect(prop.type).toBe("string");
                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("Field");
                expect(decorators).toContain("IsUUID");
                expect(decorators).toContain("IsNotEmpty");
            }

            orm.close();
        });
    });

    describe("text type input class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithTextRuntimeType],
                }),
            );
            const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithTextRuntimeType"));
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
                expect(prop.name).toBe("title");
                expect(prop.type).toBe("string");
                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("Field");
                expect(decorators).toContain("IsString");
                expect(decorators).toContain("IsNotEmpty");
            }

            orm.close();
        });
    });

    describe("nullable props input class with initializer", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithNullablePropWithInitializer],
                }),
            );
            const out = await generateCrudInput(
                { targetDirectory: __dirname },
                orm.em.getMetadata().get("TestEntityWithNullablePropWithInitializer"),
            );
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
                expect(prop.name).toBe("title");
                expect(prop.type).toBe("string");

                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("Field");
                expect(decorators).toContain("IsString");
                expect(decorators).toContain("IsNullable");

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const fieldDecorator = prop.decorators!.find((i) => i.name === "Field")!;
                const fieldDecoratorArguments = fieldDecorator.arguments as string[];
                expect(fieldDecoratorArguments[0]).toContain("nullable: true");
                expect(fieldDecoratorArguments[0]).toContain("defaultValue: null");
            }

            orm.close();
        });
    });

    describe("nullable props input class without initializer", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityWithNullablePropWithoutInitializer],
                }),
            );
            const out = await generateCrudInput(
                { targetDirectory: __dirname },
                orm.em.getMetadata().get("TestEntityWithNullablePropWithoutInitializer"),
            );
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
                expect(prop.name).toBe("title");
                expect(prop.type).toBe("string");

                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("Field");
                expect(decorators).toContain("IsString");
                expect(decorators).toContain("IsNullable");

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const fieldDecorator = prop.decorators!.find((i) => i.name === "Field")!;
                const fieldDecoratorArguments = fieldDecorator.arguments as string[];
                expect(fieldDecoratorArguments[0]).toContain("nullable: true");
                expect(fieldDecoratorArguments[0]).toContain("defaultValue: null");
            }

            orm.close();
        });
    });
});
