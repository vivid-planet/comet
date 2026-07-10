import { CrudField, CrudGenerator } from "@comet/cms-api";
import { BaseEntity, defineConfig, Entity, ManyToOne, MikroORM, PrimaryKey, Property, Ref } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage.js";
import { v4 as uuid } from "uuid";
import { describe, expect, it } from "vitest";

import { formatGeneratedFiles, parseSource, testPermission } from "../../utils/test-helper";
import { generateCrud } from "../generate-crud";

@Entity()
@CrudGenerator({ requiredPermission: testPermission })
class TestNestedFilterCategory extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;
}

@Entity()
@CrudGenerator({ requiredPermission: testPermission })
class TestNestedFilterProduct extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Property()
    title: string;

    @ManyToOne(() => TestNestedFilterCategory, { nullable: true, ref: true })
    @CrudField({ filter: { nested: true } })
    category?: Ref<TestNestedFilterCategory>;

    @ManyToOne(() => TestNestedFilterCategory, { nullable: true, ref: true })
    idFilterCategory?: Ref<TestNestedFilterCategory>;
}

describe("generate-crud nested filter", () => {
    it("generates a nested relation filter for opted-in ManyToOne relations", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestNestedFilterProduct, TestNestedFilterCategory],
            }),
        );

        const out = await generateCrud({ requiredPermission: testPermission }, orm.em.getMetadata().get("TestNestedFilterProduct"));
        const formattedOut = await formatGeneratedFiles(out);

        const file = formattedOut.find((file) => file.name === "dto/test-nested-filter-product.filter.ts");
        if (!file) {
            throw new Error("File not found");
        }
        const source = parseSource(file.content);

        const filterClass = source.getClassOrThrow("TestNestedFilterProductFilter");
        const properties = filterClass.getStructure().properties ?? [];

        // opted-in relation uses the related entity's filter (nested)
        const category = properties.find((property) => property.name === "category");
        expect(category?.type).toBe("TestNestedFilterCategoryFilter");

        // relation without opt-in keeps the id-based ManyToOneFilter
        const idFilterCategory = properties.find((property) => property.name === "idFilterCategory");
        expect(idFilterCategory?.type).toBe("ManyToOneFilter");

        const imports: Record<string, string> = {};
        for (const tsImport of source.getImportDeclarations()) {
            for (const namedImport of tsImport.getNamedImports()) {
                imports[namedImport.getNameNode().getText()] = tsImport.getModuleSpecifierValue();
            }
        }
        expect(imports["TestNestedFilterCategoryFilter"]).toBe("./test-nested-filter-category.filter");

        await orm.close();
    });
});
