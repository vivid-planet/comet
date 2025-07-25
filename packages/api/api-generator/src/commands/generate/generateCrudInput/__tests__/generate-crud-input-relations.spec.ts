import { BaseEntity, Collection, defineConfig, Entity, ManyToOne, MikroORM, OneToMany, PrimaryKey, Ref } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { formatSource, parseSource } from "../../utils/test-helper";
import { generateCrudInput } from "../generate-crud-input";

@Entity()
export class ProductCategory extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => Product, (products) => products.category)
    products = new Collection<Product>(this);
}

@Entity()
export class Product extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => ProductCategory, { nullable: true, ref: true })
    category?: Ref<ProductCategory>;
}

describe("GenerateCrudInputRelations", () => {
    it("n:1 input dto should contain relation id", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [Product, ProductCategory],
            }),
        );

        const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("Product"));
        const formattedOut = await formatSource(out[0].content);
        const source = parseSource(formattedOut);

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
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [Product, ProductCategory],
            }),
        );

        const out = await generateCrudInput({ targetDirectory: __dirname }, orm.em.getMetadata().get("ProductCategory"));
        const formattedOut = await formatSource(out[0].content);
        //console.log(formattedOut);
        const source = parseSource(formattedOut);

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
