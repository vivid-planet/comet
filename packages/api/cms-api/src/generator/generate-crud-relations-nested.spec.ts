import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Ref } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityVariant extends BaseEntity<TestEntityVariant, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @ManyToOne(() => TestEntityProduct, { ref: true })
    product: Ref<TestEntityProduct>;
}

@Entity()
class TestEntityProduct extends BaseEntity<TestEntityProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @OneToMany(() => TestEntityVariant, (variant) => variant.product, { orphanRemoval: true })
    variants = new Collection<TestEntityVariant>(this);
}

describe("GenerateCrudRelations", () => {
    describe("resolver class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityProduct, TestEntityVariant],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProduct"));
            const lintedOut = await lintGeneratedFiles(out);

            {
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
            }

            {
                const file = lintedOut.find((file) => file.name === "dto/test-entity-product.input.ts");
                if (!file) throw new Error("File not found");
                const source = parseSource(file.content);

                const classes = source.getClasses();
                expect(classes.length).toBe(2);

                expect(classes[0].getName()).toBe("TestEntityProductInput");
                expect(classes[1].getName()).toBe("TestEntityProductUpdateInput");

                const structure = classes[0].getStructure();

                expect(structure.properties?.length).toBe(2);
                expect(structure.properties?.[1].type).toBe("TestEntityVariantInput[]");
            }

            {
                const file = lintedOut.find((file) => file.name === "dto/test-entity-variant.nested.input.ts");
                if (!file) throw new Error("File not found");
                const source = parseSource(file.content);

                const classes = source.getClasses();
                expect(classes.length).toBe(1);

                expect(classes[0].getName()).toBe("TestEntityVariantInput");

                const structure = classes[0].getStructure();

                expect(structure.properties?.length).toBe(1);
            }

            orm.close();
        });
    });
});
