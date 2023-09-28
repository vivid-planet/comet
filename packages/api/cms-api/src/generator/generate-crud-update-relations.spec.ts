import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Ref } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { StatementStructures, WriterFunction } from "ts-morph";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityCategory extends BaseEntity<TestEntityCategory, "id"> {
    @PrimaryKey({ columnType: "int", type: "integer" })
    id: number;

    @OneToMany(() => TestEntityProduct, (products) => products.category)
    products = new Collection<TestEntityProduct>(this);
}

@Entity()
class TestEntityProduct extends BaseEntity<TestEntityProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => TestEntityCategory, { ref: true })
    category: Ref<TestEntityCategory>;
}

describe("GenerateCrudUpdateRelations", () => {
    describe("resolver class", () => {
        it("updated relations should all have an empty check, regardless of their definition in the entity", async () => {
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
            const updateMethod = structure.methods?.find((method) => method.name === "updateTestEntityProduct");
            expect(Array.isArray(updateMethod?.statements)).toBe(true);
            const updateStatements = updateMethod?.statements as Array<string | WriterFunction | StatementStructures>;

            expect(!!updateStatements[2]).toBe(true); // output of generateInputHandling()

            // all relations need to be checked for null values regardless of their declaration in the entity
            // because findOneOrFail() requires a value other than undefined but
            // "class TestEntityProductUpdateInput extends PartialType(TestEntityProductInput)"
            // makes all relations optional
            expect(
                updateStatements[2]
                    .toString()
                    .includes(
                        "category: categoryInput ? Reference.create(await this.testEntityCategoryRepository.findOneOrFail(categoryInput)) : undefined",
                    ),
            ).toBe(true);

            orm.close();
        });
    });
});
