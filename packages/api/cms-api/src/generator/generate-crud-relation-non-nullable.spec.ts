import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityProductVariant extends BaseEntity<TestEntityProductVariant, "id"> {
    @PrimaryKey({ columnType: "text", type: "string" })
    id: string;

    @Property()
    name: string;

    @ManyToOne(() => TestEntityProduct, { ref: true })
    product: Ref<TestEntityProduct>;
}

@Entity()
class TestEntityProduct extends BaseEntity<TestEntityProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    name: string;

    @OneToMany(() => TestEntityProductVariant, (variants) => variants.product)
    variants = new Collection<TestEntityProductVariant>(this);
}

describe("GenerateCrudRelationsNonNullable", () => {
    describe("resolver class", () => {
        it("input type must not include product relation", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityProduct, TestEntityProductVariant],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProductVariant"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-product-variant.input.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);
            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            const cls = classes[0];
            const structure = cls.getStructure();
            expect(structure.properties?.length).toBe(1);
            expect(structure.properties?.[0].name).toBe("name");

            orm.close();
        });
        it("query list must include product arg", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityProduct, TestEntityProductVariant],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProductVariant"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-product-variants.args.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(1);
            const cls = classes[0];

            const structure = cls.getStructure();
            const params = structure?.properties?.map((prop) => prop.name);
            expect(params).toContain("product");

            orm.close();
        });
        it("create mutation must include product arg", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityProduct, TestEntityProductVariant],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProductVariant"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "test-entity-product-variant.resolver.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const classes = source.getClasses();
            expect(classes.length).toBe(1);
            const cls = classes[0];

            const structure = cls.getStructure();
            const createMethod = structure.methods?.find((method) => method.name === "createTestEntityProductVariant");
            const params = createMethod?.parameters?.map((param) => param.name);
            expect(params).toContain("product");

            orm.close();
        });
    });
});
