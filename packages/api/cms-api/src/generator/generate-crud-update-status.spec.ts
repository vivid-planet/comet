import { BaseEntity, Entity, Enum, PrimaryKey, Property } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { Field, registerEnumType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";
import { GeneratedFile } from "./utils/write-generated-files";

export enum TestEntitiy1Status {
    Active = "Active",
    Archived = "Archived",
    Deleted = "Deleted",
}

registerEnumType(TestEntitiy1Status, { name: "TestEntitiyStatus" });

@Entity()
class TestEntity1 extends BaseEntity<TestEntity1, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @Enum({ items: () => TestEntitiy1Status })
    @Field(() => TestEntitiy1Status)
    status: TestEntitiy1Status = TestEntitiy1Status.Active;
}

describe("GenerateCrud Status with active", () => {
    let lintedOut: GeneratedFile[];
    let orm: MikroORM;
    beforeAll(async () => {
        LazyMetadataStorage.load();
        orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [TestEntity1],
        });
        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity1"));
        lintedOut = await lintGeneratedFiles(out);
    });
    afterAll(async () => {
        orm.close();
    });

    it("input should contain status", async () => {
        const file = lintedOut.find((file) => file.name === "dto/test-entity1.input.ts");
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
        const file = lintedOut.find((file) => file.name === "test-entity1.resolver.ts");
        if (!file) throw new Error("File not found");

        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity1Resolver");
        const structure = cls.getStructure();

        const mathodNames = (structure.methods || []).map((method) => method.name);

        expect(mathodNames).not.toContain("updateTestEntity1Status");
    });

    it("args should use status enum as defined for enitity", async () => {
        const file = lintedOut.find((file) => file.name === "dto/test-entity1s.args.ts");
        if (!file) throw new Error("File not found");
        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity1sArgs");
        const structure = cls.getStructure();

        const statusProp = (structure.properties || []).find((prop) => prop.name == "status");
        expect(statusProp).toBeTruthy();
        expect(statusProp?.type).toBe("TestEntitiy1Status");
    });
});

export enum TestEntitiy2Status {
    Published = "Published",
    Unpublished = "Unpublished",
    Archived = "Archived",
    Deleted = "Deleted",
}

registerEnumType(TestEntitiy2Status, { name: "TestEntitiy2Status" });

@Entity()
class TestEntity2 extends BaseEntity<TestEntity2, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @Enum({ items: () => TestEntitiy2Status })
    @Field(() => TestEntitiy2Status)
    status: TestEntitiy2Status = TestEntitiy2Status.Unpublished;
}

describe("GenerateCrud Status with published/unpublished", () => {
    let lintedOut: GeneratedFile[];
    let orm: MikroORM;
    beforeAll(async () => {
        LazyMetadataStorage.load();
        orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [TestEntity2],
        });
        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity2"));
        lintedOut = await lintGeneratedFiles(out);
    });
    afterAll(async () => {
        orm.close();
    });

    it("args should include own status enum that doesn't include published/unpublished", async () => {
        const file = lintedOut.find((file) => file.name === "dto/test-entity2s.args.ts");
        if (!file) throw new Error("File not found");

        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = classes[0];
        expect(cls.getName()).toBe("TestEntity2sArgs");
        const structure = cls.getStructure();

        const statusProp = (structure.properties || []).find((prop) => prop.name == "status");
        expect(statusProp).toBeTruthy();
        expect(statusProp?.type).toBe("TestEntity2StatusFilter");

        const enums = source.getEnums();
        expect(enums.length).toBe(1);

        const enumm = enums[0];
        expect(enumm.getName()).toBe("TestEntity2StatusFilter");
        const enumNames = enumm.getMembers().map((member) => member.getName());
        expect(enumNames).toContain("Active");
        expect(enumNames).toContain("Deleted");
        expect(enumNames).not.toContain("Published");
        expect(enumNames).not.toContain("Unpublished");
    });
});

export enum TestEntitiy3Status {
    Published = "Published",
    Unpublished = "Unpublished",
}

registerEnumType(TestEntitiy3Status, { name: "TestEntitiy3Status" });

@Entity()
class TestEntity3 extends BaseEntity<TestEntity3, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @Enum({ items: () => TestEntitiy3Status })
    @Field(() => TestEntitiy3Status)
    status: TestEntitiy3Status = TestEntitiy3Status.Unpublished;
}

describe("GenerateCrud Status with published/unpublished", () => {
    let lintedOut: GeneratedFile[];
    let orm: MikroORM;
    beforeAll(async () => {
        LazyMetadataStorage.load();
        orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [TestEntity3],
        });
        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity3"));
        lintedOut = await lintGeneratedFiles(out);
    });
    afterAll(async () => {
        orm.close();
    });

    it("args should not include status filter as all are active ones", async () => {
        const file = lintedOut.find((file) => file.name === "dto/test-entity3s.args.ts");
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
