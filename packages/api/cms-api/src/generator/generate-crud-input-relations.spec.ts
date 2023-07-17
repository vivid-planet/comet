import { BaseEntity, Collection, Entity, ManyToOne, MikroORM, OneToMany, PrimaryKey, Ref } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrudInput } from "./generate-crud-input";
import { lintSource, parseSource } from "./utils/test-helper";

@Entity()
export class ProductCategory extends BaseEntity<ProductCategory, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => Product, (products) => products.category)
    products = new Collection<Product>(this);
}

@Entity()
export class Product extends BaseEntity<Product, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => ProductCategory, { nullable: true, ref: true })
    category?: Ref<ProductCategory>;
}

describe("GenerateCrudInputRelations", () => {
    it("n:1 input dto should contain relation id", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [Product, ProductCategory],
        });

        const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("Product"));
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
            expect(prop.name).toBe("category");
            expect(prop.type).toBe("string");
            const decorators = prop.decorators?.map((i) => i.name);
            expect(decorators).toContain("Field");
            expect(decorators).toContain("IsUUID");
            expect(decorators).toContain("IsNullable");
        }
        orm.close();
    });

    it("1:n input dto should contain relation id", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [Product, ProductCategory],
        });

        const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("ProductCategory"));
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
            expect(prop.name).toBe("products");
            expect(prop.type).toBe("string[]");
            const decorators = prop.decorators?.map((i) => i.name);
            expect(decorators).toContain("Field");
            expect(decorators).toContain("IsUUID");
            expect(decorators).toContain("IsArray");
        }
        orm.close();
    });
});
