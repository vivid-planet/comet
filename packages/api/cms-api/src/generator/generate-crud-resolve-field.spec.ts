import { BaseEntity, Collection, Entity, ManyToMany, PrimaryKey } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { CrudField } from "./crud-generator.decorator";
import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityCategory extends BaseEntity<TestEntityCategory, "id"> {
    @PrimaryKey({ columnType: "int", type: "integer" })
    id: number;

    @ManyToMany(() => TestEntityProduct, (product) => product.categories)
    products = new Collection<TestEntityProduct>(this);
}

@Entity()
class TestEntityProduct extends BaseEntity<TestEntityProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @CrudField({
        resolveField: false,
        search: false,
        filter: false,
        sort: false,
        input: false,
    })
    @ManyToMany(() => TestEntityCategory, (category) => category.products, { owner: true })
    categories = new Collection<TestEntityCategory>(this);
}

describe("GenerateCrudResolveField", () => {
    describe("Resolve field", () => {
        it("should not include categories in resolver", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityProduct, TestEntityCategory],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProduct"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "test-entity-product.resolver.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);
            const classes = source.getClasses();
            expect(classes.length).toBe(1);
            const cls = classes[0];

            const structure = cls.getStructure();
            const resolveFieldCategoriesMethod = structure.methods?.find((method) => method.name === "categories");
            expect(resolveFieldCategoriesMethod).toBeUndefined();

            const paginatedQuery = structure.methods?.find((method) => method.name === "testEntityProducts");
            expect(paginatedQuery?.statements?.toString().includes(`populate.push("categories");`)).toBe(false);

            orm.close();
        });
    });
});
