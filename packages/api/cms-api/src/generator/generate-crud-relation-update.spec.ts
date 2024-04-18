import { BaseEntity, Collection, Entity, ManyToOne, MikroORM, OneToMany, PrimaryKey, Property, Ref, types } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
export class Product extends BaseEntity<Product, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => ProductCategory, (productCategory) => productCategory.product, { orphanRemoval: true })
    productCategories = new Collection<ProductCategory>(this);
}

@Entity()
export class ProductCategory extends BaseEntity<ProductCategory, "id"> {
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
export class Category extends BaseEntity<ProductCategory, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => ProductCategory, (productCategory) => productCategory.category, { orphanRemoval: true })
    productCategories = new Collection<ProductCategory>(this);
}

describe("GenerateCrudRelationUpdate", () => {
    it("should be a valid generated ts file", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [Product, ProductCategory, Category],
        });

        const out = await generateCrud(
            { targetDirectory: __dirname, create: false, update: true, delete: false },
            orm.em.getMetadata().get("Product"),
        );
        const lintedOut = await lintGeneratedFiles(out);
        const file = lintedOut.find((file) => file.name === "product.resolver.ts");
        if (!file) throw new Error("File not found");

        const source = parseSource(file.content);
        const classes = source.getClasses();
        expect(classes.length).toBe(1);

        const cls = source.getClassOrThrow("ProductResolver");
        const productConstructor = cls.getConstructors()[0];
        const productConstructorBodyText = productConstructor.getBodyText();
        expect(productConstructorBodyText).toContain("@InjectRepository(Category) private readonly categoryRepository: EntityRepository<Category>,");

        const updateProductMutation = cls.getInstanceMethodOrThrow("updateProduct");
        const updateProductMutationBodyText = updateProductMutation.getBodyText();

        expect(updateProductMutationBodyText).toContain(`await product.productCategories.init();
        product.productCategories.removeAll();
        product.productCategories.set(
            await Promise.all(
                productCategoriesInput.map(async (productCategoryInput) => {
                    const { category: categoryInput, ...assignInput } = productCategoryInput;
                    return this.categoryRepository.assign(new ProductCategory(), {
                        ...assignInput,
                        
                        category: Reference.create(await this.vehicleRepository.findOneOrFail(categoryInput)),
                    });
                }),
            ),
        );`);

        orm.close();
    });
});
