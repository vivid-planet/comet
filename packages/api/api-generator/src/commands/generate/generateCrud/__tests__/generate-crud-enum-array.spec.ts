import { BaseEntity, defineConfig, Entity, Enum, MikroORM, PrimaryKey } from "@mikro-orm/postgresql";
import { Field, registerEnumType } from "@nestjs/graphql";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { v4 as uuid } from "uuid";

import { formatGeneratedFiles, parseSource, testPermission } from "../../utils/test-helper";
import { generateCrud } from "../generate-crud";

export enum TestEnum {
    ONE = "ONE",
    TWO = "TWO",
}
registerEnumType(TestEnum, {
    name: "TestEnum",
});

@Entity()
class TestEntity extends BaseEntity {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Field(() => [TestEnum])
    @Enum({ items: () => TestEnum, array: true })
    foo?: TestEnum[];
}

describe("GenerateCrudEnumArray", () => {
    it("should correctly add EnumArrayType in input type", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname, requiredPermission: testPermission }, orm.em.getMetadata().get("TestEntity"));
        const formattedOut = await formatGeneratedFiles(out);
        const file = formattedOut.find((file) => file.name === "dto/test-entity.input.ts");
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
        expect(prop.type).toBe("TestEnum[]");
        const decorators = prop.decorators?.map((i) => i.name);
        expect(decorators).toContain("Field");
        expect(decorators).toContain("IsEnum");

        await orm.close();
    });
    it("should correctly add EnumArrayType in filter type", async () => {
        LazyMetadataStorage.load();
        const orm = await MikroORM.init(
            defineConfig({
                dbName: "test-db",
                connect: false,
                entities: [TestEntity],
            }),
        );

        const out = await generateCrud({ targetDirectory: __dirname, requiredPermission: testPermission }, orm.em.getMetadata().get("TestEntity"));
        const formattedOut = await formatGeneratedFiles(out);
        const file = formattedOut.find((file) => file.name === "dto/test-entity.filter.ts");
        if (!file) throw new Error("File not found");
        const source = parseSource(file.content);
        const classes = source.getClasses();
        expect(classes.length).toBe(2);

        {
            const cls = classes[0];
            const structure = cls.getStructure();
            expect(structure.name).toBe("TestEnumEnumsFilter");
        }

        {
            const cls = classes[1];
            const structure = cls.getStructure();
            expect(structure.name).toBe("TestEntityFilter");
            expect(structure.properties?.length).toBe(4);

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const prop = structure.properties![1];
            expect(prop.name).toBe("foo");
            expect(prop.type).toBe("TestEnumEnumsFilter");
        }

        await orm.close();
    });
});
