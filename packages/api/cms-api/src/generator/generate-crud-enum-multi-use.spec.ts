import { BaseEntity, Entity, Enum, PrimaryKey } from "@mikro-orm/core";
import { defineConfig, MikroORM } from "@mikro-orm/postgresql";
import { Field, registerEnumType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

export enum TestEnum {
    AND = "AND",
    OR = "OR",
}
registerEnumType(TestEnum, {
    name: "TestEnumOperator",
});

@Entity()
class TestEntity extends BaseEntity<TestEntity, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Field(() => TestEnum)
    @Enum(() => TestEnum)
    foo: TestEnum;

    @Field(() => TestEnum)
    @Enum(() => TestEnum)
    bar: TestEnum;
}

const isArrayUnique = (arr: unknown[]) => Array.isArray(arr) && new Set(arr).size === arr.length;

describe("GenerateCrudEnumMultiUse", () => {
    it("should import a enum reference only once if used multiple times", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                entities: [TestEntity],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity"));
        const lintedOut = await lintGeneratedFiles(out);
        const file = lintedOut.find((file) => file.name === "dto/test-entity.input.ts");
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
