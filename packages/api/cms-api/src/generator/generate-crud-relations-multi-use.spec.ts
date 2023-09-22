import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Ref } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
class TestEntityFunction extends BaseEntity<TestEntityFunction, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @OneToMany(() => TestEntityFilter, (filters) => filters.advisorFunction)
    advisorFunctions = new Collection<TestEntityFilter>(this);

    @OneToMany(() => TestEntityFilter, (filters) => filters.teamFunction)
    teamFunctions = new Collection<TestEntityFilter>(this);
}

@Entity()
class TestEntityFilter extends BaseEntity<TestEntityFilter, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @ManyToOne(() => TestEntityFunction, { nullable: true, ref: true })
    advisorFunction?: Ref<TestEntityFunction>;

    @ManyToOne(() => TestEntityFunction, { nullable: true, ref: true })
    teamFunction?: Ref<TestEntityFunction>;
}

describe("GenerateCrudRelationsMultiUse", () => {
    describe("resolver class", () => {
        it("should be a valid generated ts file", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityFilter, TestEntityFunction],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityFilter"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "test-entity-filter.resolver.ts");
            if (!file) throw new Error("File not found");

            const source = parseSource(file.content);

            const imports: string[] = [];
            for (const importDeclaration of source.getImportDeclarations()) {
                for (const namedImport of importDeclaration.getNamedImports()) {
                    // Check if TestEntityFunction has been imported already. Each import can only exist once.
                    expect(imports.includes("TestEntityFunction")).toBe(false);
                    imports.push(namedImport.getName());
                }
            }

            orm.close();
        });
    });
});
