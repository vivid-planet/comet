import { BaseEntity, defineConfig, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { formatSource, testPermission } from "../../utils/test-helper";
import { generateCrudInput } from "../generate-crud-input";
import { NestedObject, type NestedType } from "./.generate-crud-input-json-import-nested-object";

@Entity()
export class TestEntityWithJsonObject1 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: NestedObject;
}

@Entity()
export class TestEntityWithJsonObject2 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: NestedObject[];
}

@Entity()
export class TestEntityWithJsonType1 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: NestedType;
}

@Entity()
export class TestEntityWithJsonType2 extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property({ type: "json" })
    foo: NestedType[];
}
describe("GenerateCrudInputJsonImport", () => {
    it("should generate import for class property", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntityWithJsonObject1],
            }),
        );

        const out = await generateCrudInput({ requiredPermission: testPermission }, orm.em.getMetadata().get("TestEntityWithJsonObject1"));
        const formattedOut = await formatSource(out[0].content);

        expect(formattedOut).toMatchSnapshot();

        await orm.close();
    });
    it("should generate import for array class property", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntityWithJsonObject1],
            }),
        );

        const out = await generateCrudInput({ requiredPermission: testPermission }, orm.em.getMetadata().get("TestEntityWithJsonObject1"));
        const formattedOut = await formatSource(out[0].content);

        expect(formattedOut).toMatchSnapshot();

        await orm.close();
    });

    it("should generate import for type property", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntityWithJsonType1],
            }),
        );

        const out = await generateCrudInput({ requiredPermission: testPermission }, orm.em.getMetadata().get("TestEntityWithJsonType1"));
        const formattedOut = await formatSource(out[0].content);

        expect(formattedOut).toMatchSnapshot();

        await orm.close();
    });

    it("should generate import for array type property", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntityWithJsonType2],
            }),
        );

        const out = await generateCrudInput({ requiredPermission: testPermission }, orm.em.getMetadata().get("TestEntityWithJsonType2"));
        const formattedOut = await formatSource(out[0].content);

        expect(formattedOut).toMatchSnapshot();

        await orm.close();
    });
});
