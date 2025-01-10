import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Ref } from "@mikro-orm/core";
import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntitiyProduct extends BaseEntity<TestEntitiyProduct, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => TestEntityCategory, (filters) => filters.product1)
    categories1 = new Collection<TestEntityCategory>(this);

    @OneToMany(() => TestEntityCategory, (filters) => filters.product2)
    categories2 = new Collection<TestEntityCategory>(this);
}

@Entity()
class TestEntityCategory extends BaseEntity<TestEntityCategory, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => TestEntitiyProduct, { nullable: true, ref: true })
    product1?: Ref<TestEntitiyProduct>;

    @ManyToOne(() => TestEntitiyProduct, { nullable: true, ref: true })
    product2?: Ref<TestEntitiyProduct>;
}

const isArrayUnique = (arr: unknown[]) => Array.isArray(arr) && new Set(arr).size === arr.length;

describe("GenerateCrudRelationsMultiUse", () => {
    it("should import a relation reference only once if used multiple times", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntityCategory, TestEntitiyProduct],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntitiyProduct"));
        const lintedOut = await lintGeneratedFiles(out);
        const file = lintedOut.find((file) => file.name === "test-entitiy-product.resolver.ts");
        if (!file) throw new Error("File not found");

        const source = parseSource(file.content);

        const imports: string[] = [];
        for (const importDeclaration of source.getImportDeclarations()) {
            for (const namedImport of importDeclaration.getNamedImports()) {
                imports.push(namedImport.getName());
            }
        }
        expect(isArrayUnique(imports)).toBe(true);

        orm.close();
    });
});
