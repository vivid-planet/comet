import { BaseEntity, defineConfig, Entity, Enum, MikroORM, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { Field, registerEnumType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { formatGeneratedFiles, parseSource } from "../../utils/test-helper";
import { GeneratedFile } from "../../utils/write-generated-files";
import { generateCrud } from "../generate-crud";

export enum TestEntity1Status {
    Active = "Active",
    Archived = "Archived",
    Deleted = "Deleted",
}

registerEnumType(TestEntity1Status, { name: "TestEntity1Status" });

@Entity()
class TestEntity1 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @Enum({ items: () => TestEntity1Status })
    @Field(() => TestEntity1Status)
    status: TestEntity1Status = TestEntity1Status.Active;
}

describe("GenerateCrud Status with active", () => {
    let formattedOut: GeneratedFile[];
    let orm: MikroORM;
    beforeAll(async () => {
        LazyMetadataStorage.load();
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity1],
            }),
        );
        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity1"));
        formattedOut = await formatGeneratedFiles(out);
    });
    afterAll(async () => {
        orm.close();
    });

    it("input should contain status", async () => {
        const file = formattedOut.find((file) => file.name === "dto/test-entity1.input.ts");
        if (!file) throw new Error("File not found");
        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(2); //update + create

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity1Input");
        const structure = cls.getStructure();

        const propNames = (structure.properties || []).map((prop) => prop.name);

        expect(propNames).toEqual(["title", "status"]);
    });

    it("resolver should not include update status mutation", async () => {
        const file = formattedOut.find((file) => file.name === "test-entity1.resolver.ts");
        if (!file) throw new Error("File not found");

        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity1Resolver");
        const structure = cls.getStructure();

        const methodNames = (structure.methods || []).map((method) => method.name);

        expect(methodNames).not.toContain("updateTestEntity1Status");
    });

    it("args should use status enum as defined for enitity", async () => {
        const file = formattedOut.find((file) => file.name === "dto/test-entity1s.args.ts");
        if (!file) throw new Error("File not found");
        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity1sArgs");
        const structure = cls.getStructure();

        const statusProp = (structure.properties || []).find((prop) => prop.name == "status");
        expect(statusProp).toBeTruthy();
        expect(statusProp?.type).toBe("TestEntity1Status[]");
    });
});

export enum TestEntity2Status {
    Published = "Published",
    Unpublished = "Unpublished",
    Archived = "Archived",
    Deleted = "Deleted",
}

registerEnumType(TestEntity2Status, { name: "TestEntity2Status" });

@Entity()
class TestEntity2 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @Enum({ items: () => TestEntity2Status })
    @Field(() => TestEntity2Status)
    status: TestEntity2Status = TestEntity2Status.Unpublished;
}

describe("GenerateCrud Status with published/unpublished", () => {
    let formattedOut: GeneratedFile[];
    let orm: MikroORM;
    beforeAll(async () => {
        LazyMetadataStorage.load();
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity2],
            }),
        );
        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity2"));
        formattedOut = await formatGeneratedFiles(out);
    });
    afterAll(async () => {
        orm.close();
    });

    it("args should include default value", async () => {
        const file = formattedOut.find((file) => file.name === "dto/test-entity2s.args.ts");
        if (!file) throw new Error("File not found");

        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity2sArgs");
        const structure = cls.getStructure();

        const statusProp = (structure.properties || []).find((prop) => prop.name == "status");
        expect(statusProp).toBeTruthy();
        expect(statusProp?.type).toBe("TestEntity2Status[]");
        const decorators = statusProp?.decorators;
        if (!decorators) throw new Error("No decorators found");
        const fieldDecorator = decorators.find((dec) => dec.name == "Field");
        if (!fieldDecorator) throw new Error("No fieldDecorator found");
        if (!fieldDecorator.arguments) throw new Error("No fieldDecorator arguments found");
        if (!Array.isArray(fieldDecorator.arguments)) throw new Error("No fieldDecorator arguments found");
        expect(fieldDecorator.arguments?.[1]).toBe("{ defaultValue: [TestEntity2Status.Published, TestEntity2Status.Unpublished] }");
    });
});

export enum TestEntity3Status {
    Published = "Published",
    Unpublished = "Unpublished",
}

registerEnumType(TestEntity3Status, { name: "TestEntity3Status" });

@Entity()
class TestEntity3 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @Enum({ items: () => TestEntity3Status })
    @Field(() => TestEntity3Status)
    status: TestEntity3Status = TestEntity3Status.Unpublished;
}

describe("GenerateCrud Status with published/unpublished", () => {
    let formattedOut: GeneratedFile[];
    let orm: MikroORM;
    beforeAll(async () => {
        LazyMetadataStorage.load();
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity3],
            }),
        );
        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity3"));
        formattedOut = await formatGeneratedFiles(out);
    });
    afterAll(async () => {
        orm.close();
    });

    it("args should not include status filter as all are active ones", async () => {
        const file = formattedOut.find((file) => file.name === "dto/test-entity3s.args.ts");
        if (!file) throw new Error("File not found");

        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity3sArgs");
        const structure = cls.getStructure();

        const propNames = (structure.properties || []).map((prop) => prop.name);

        expect(propNames).not.toContain("status");
    });
});
