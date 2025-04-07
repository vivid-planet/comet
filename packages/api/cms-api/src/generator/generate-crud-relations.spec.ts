import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityCategory extends BaseEntity<TestEntityCategory, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @OneToMany(() => TestEntityProduct, (products) => products.category)
    /*
    @CrudRelationField({
        paging: true,
        filter: true,
        sort: true,
        mutations: true
    })
    */
    products = new Collection<TestEntityProduct>(this);
}

@Entity()
class TestEntityProduct extends BaseEntity<TestEntityProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @ManyToOne(() => TestEntityCategory, { nullable: true, ref: true })
    /*
    @CrudField({
        search: true,
        filter: true,
        sort: true,
        input: true,
    })
    */
    category?: Ref<TestEntityCategory>;
}

describe("GenerateCrudRelations", () => {
    describe("resolver class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityProduct, TestEntityCategory],
                }),
            );

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProduct"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "test-entity-product.resolver.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(1);

            const cls = classes[0];
            expect(cls.getName()).toBe("TestEntityProductResolver");
            const structure = cls.getStructure();

            expect(structure.properties?.length).toBe(0);
            expect(structure.methods?.length).toBe(6);

            orm.close();
        });

        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityProduct, TestEntityCategory],
                }),
            );

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityCategory"));
            const lintedOut = await lintGeneratedFiles(out);

            const file = lintedOut.find((file) => file.name === "test-entity-category.resolver.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);
            const classes = source.getClasses();
            expect(classes.length).toBe(1);

            const cls = classes[0];
            expect(cls.getName()).toBe("TestEntityCategoryResolver");
            const structure = cls.getStructure();

            expect(structure.properties?.length).toBe(0);
            expect(structure.methods?.length).toBe(6);

            orm.close();
        });

        it("input type to category relation should be string with uuid validator", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init(
                defineConfig({
                    dbName: "test-db",
                    entities: [TestEntityProduct, TestEntityCategory],
                }),
            );

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProduct"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-product.input.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);
            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            const cls = classes[0];
            const structure = cls.getStructure();
            expect(structure.properties?.length).toBe(2);
            expect(structure.properties?.[1].name).toBe("category");
            expect(structure.properties?.[1].type).toBe("string");
            expect(structure.properties?.[1].decorators?.length).toBe(3);
            const decorators = structure.properties?.[1].decorators?.map((dec) => dec.name);
            expect(decorators).toContain("IsUUID");
            expect(decorators).not.toContain("IsInt");
            expect(decorators).not.toContain("IsString");

            orm.close();
        });
    });
});
