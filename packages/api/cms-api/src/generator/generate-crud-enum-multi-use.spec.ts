import { BaseEntity, Entity, Enum, PrimaryKey } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { Field, registerEnumType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

export enum TestEnumOperator {
    AND = "AND",
    OR = "OR",
}
registerEnumType(TestEnumOperator, {
    name: "TestEnumOperator",
});

@Entity()
class TestEntityFilter extends BaseEntity<TestEntityFilter, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Field(() => TestEnumOperator)
    @Enum(() => TestEnumOperator)
    companyOperator: TestEnumOperator;

    @Field(() => TestEnumOperator)
    @Enum(() => TestEnumOperator)
    personOperator: TestEnumOperator;
}

describe("GenerateCrudEnumMultiUse", () => {
    describe("resolver class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityFilter],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityFilter"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-filter.input.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const imports: string[] = [];
            for (const importDeclaration of source.getImportDeclarations()) {
                for (const namedImport of importDeclaration.getNamedImports()) {
                    // Check if TestEnumOperator has been imported already. Each import can only exist once.
                    expect(imports.includes("TestEnumOperator")).toBe(false);
                    imports.push(namedImport.getName());
                }
            }

            orm.close();
        });
    });
});
