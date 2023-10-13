import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Ref } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityCategoryWithIntegerId extends BaseEntity<TestEntityCategoryWithIntegerId, "id"> {
    @PrimaryKey({ columnType: "int", type: "integer" })
    id: number;

    @OneToMany(() => TestEntityProduct, (products) => products.category)
    products = new Collection<TestEntityProduct>(this);
}

@Entity()
class TestEntityProduct extends BaseEntity<TestEntityProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => TestEntityCategoryWithIntegerId, { nullable: true, ref: true })
    category?: Ref<TestEntityCategoryWithIntegerId>;
}

describe("GenerateCrudRelationsIdString", () => {
    describe("resolver class", () => {
        it("input type to category relation should be number with integer validator", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityProduct, TestEntityCategoryWithIntegerId],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityProduct"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-product.input.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);
            const classes = source.getClasses();
            expect(classes.length).toBe(2);

            const cls = classes[0];
            const structure = cls.getStructure();
            expect(structure.properties?.length).toBe(1);
            expect(structure.properties?.[0].name).toBe("category");
            expect(structure.properties?.[0].type).toBe("number");
            expect(structure.properties?.[0].decorators?.length).toBe(4);
            const decorators = structure.properties?.[0].decorators?.map((dec) => dec.name);
            expect(decorators).toContain("Transform");
            expect(decorators).toContain("IsInt");
            expect(decorators).not.toContain("IsUUID");
            expect(decorators).not.toContain("IsString");
            orm.close();
        });
    });
});
