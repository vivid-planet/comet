import { BaseEntity, Entity, Enum, PrimaryKey } from "@mikro-orm/core";
import { MikroORM } from "@mikro-orm/postgresql";
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

    @Field(() => TestEnum, { nullable: true })
    @Enum({ items: () => TestEnum, nullable: true })
    foo?: TestEnum;
}

describe("GenerateCrudEnumOptional", () => {
    it("should correctly determine enum import path", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init({
            type: "postgresql",
            dbName: "test-db",
            entities: [TestEntity],
        });

        const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntity"));
        const lintedOut = await lintGeneratedFiles(out);
        const file = lintedOut.find((file) => file.name === "dto/test-entity.input.ts");
        if (!file) throw new Error("File not found");
        const source = parseSource(file.content);

        const classes = source.getClasses();
        expect(classes.length).toBe(2);

        const cls = classes[0];
        const structure = cls.getStructure();
        expect(structure.properties?.length).toBe(1);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const prop = structure.properties![0];
        expect(prop.name).toBe("foo");
        expect(prop.type).toBe("TestEnum");
        const decorators = prop.decorators?.map((i) => i.name);
        expect(decorators).toContain("Field");
        expect(decorators).toContain("IsEnum");
        expect(decorators).toContain("IsNullable");

        orm.close();
    });
});
