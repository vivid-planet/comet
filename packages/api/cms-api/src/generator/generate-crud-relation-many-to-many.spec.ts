import { BaseEntity, Collection, Entity, ManyToOne, MikroORM, OneToMany, PrimaryKey, Property, Ref, types } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";
import { GeneratedFile } from "./utils/write-generated-files";

@Entity()
export class Product extends BaseEntity<Product, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => ProductToCategory, (productCategory) => productCategory.product, { orphanRemoval: true })
    productCategories = new Collection<ProductToCategory>(this);
}

@Entity()
export class ProductToCategory extends BaseEntity<ProductToCategory, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => Product, { onDelete: "cascade", ref: true })
    product: Ref<Product>;

    @ManyToOne(() => Category, { onDelete: "cascade", ref: true })
    category: Ref<Category>;

    @Property({ type: types.boolean })
    status: boolean = true;
}

@Entity()
export class Category extends BaseEntity<ProductToCategory, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => ProductToCategory, (productCategory) => productCategory.category, { orphanRemoval: true })
    productCategories = new Collection<ProductToCategory>(this);
}

describe("GenerateCrud Relation n:m with additional column", () => {
    let file: GeneratedFile;
    let orm: MikroORM;
    beforeEach(async () => {
        LazyMetadataStorage.load();
        orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [Product, ProductToCategory, Category],
            }),
        );

        const out = await generateCrud(
            { targetDirectory: __dirname, create: false, update: true, delete: false },
            orm.em.getMetadata().get("Product"),
        );
        const lintedOut = await lintGeneratedFiles(out);
        const foundFile = lintedOut.find((file) => file.name === "product.resolver.ts");
        if (!foundFile) throw new Error("File not found");

        file = foundFile;
    });

    afterEach(async () => {
        orm.close();
    });

    it("should inject 2 nested deep repository", async () => {
        const source = parseSource(file.content);
        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = source.getClassOrThrow("ProductResolver");
        const structure = cls.getStructure();
        if (!structure.ctors) throw new Error("Constructor not found");

        const ctor = structure.ctors[0];
        const params = ctor.parameters?.map((param) => {
            return param.name;
        });
        expect(params).toContain("categoryRepository");
    });

    it("should call loadItems on collection", async () => {
        const source = parseSource(file.content);
        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = source.getClassOrThrow("ProductResolver");
        const updateProductMutation = cls.getInstanceMethodOrThrow("updateProduct");
        const updateProductMutationBodyText = updateProductMutation.getBodyText();
        expect(updateProductMutationBodyText).toContain(`product.productCategories.loadItems()`);
    });
});
