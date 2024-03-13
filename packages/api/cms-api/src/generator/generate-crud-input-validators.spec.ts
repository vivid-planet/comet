import { BaseEntity, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import { IsBooleanString, IsDateString, IsEmail, Length, Max, Min } from "class-validator";
import { v4 as uuid } from "uuid";

import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

@Entity()
export class TestEntityWithEmail extends BaseEntity<TestEntityWithEmail, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @IsEmail()
    @Property({ columnType: "text" })
    email: string;
}

@Entity()
export class TestEntityWithBooleanString extends BaseEntity<TestEntityWithBooleanString, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Length(4, 5)
    @IsBooleanString()
    @Property({ columnType: "text" })
    isBooleanString: string;
}

@Entity()
export class TestEntityWithMax extends BaseEntity<TestEntityWithMax, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Max(10)
    @Property({ columnType: "number" })
    rating: number;
}

@Entity()
export class TestEntityWithMultipleProperties extends BaseEntity<TestEntityWithMultipleProperties, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @IsEmail()
    @Property({ columnType: "text" })
    email: string;

    @Min(2)
    @Max(10)
    @Property({ columnType: "number" })
    rating: number;

    @Length(4, 5)
    @IsBooleanString()
    @Property({ columnType: "text" })
    isBooleanString: string;

    @IsDateString()
    @Property({ columnType: "text" })
    date: string;
}

describe("GenerateDefinedValidators", () => {
    describe("simple validator", () => {
        it("should set IsEmail decorator", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithEmail],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithEmail"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-email.input.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);
            const classes = source.getClasses();
            const cls = classes[0];
            const structure = cls.getStructure();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const prop = structure.properties![0];
            expect(prop.name).toBe("email");
            const decorators = prop.decorators?.map((i) => i.name);
            expect(decorators).toContain("IsEmail");

            orm.close();
        });
    });

    describe("multiple validators", () => {
        it("should set Length, IsBooleanString decorator", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithBooleanString],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithBooleanString"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-boolean-string.input.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);
            const classes = source.getClasses();
            const cls = classes[0];
            const structure = cls.getStructure();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const prop = structure.properties![0];

            expect(prop.name).toBe("isBooleanString");
            expect(prop.decorators?.[0].name).toBe("Length");
            expect(prop.decorators?.[1].name).toBe("IsBooleanString");

            orm.close();
        });
    });

    describe("validators with arguments", () => {
        it("should set Max decorator with correct arguments", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithMax],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithMax"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-max.input.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);
            const classes = source.getClasses();
            const cls = classes[0];
            const structure = cls.getStructure();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const prop = structure.properties![0];

            expect(prop.name).toBe("rating");
            expect(prop.decorators?.[0].name).toBe("Max");
            expect(prop.decorators?.[0].arguments).toContain("10");

            orm.close();
        });
    });

    describe("imports", () => {
        it("should set all imports", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithMultipleProperties],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithMultipleProperties"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-multiple-properties.input.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);

            const imports: string[] = [];
            for (const importDeclaration of source.getImportDeclarations()) {
                for (const namedImport of importDeclaration.getNamedImports()) {
                    imports.push(namedImport.getName());
                }
            }
            expect(imports).toContain("IsEmail");
            expect(imports).toContain("Min");
            expect(imports).toContain("Max");
            expect(imports).toContain("Length");
            expect(imports).toContain("IsBooleanString");
            expect(imports).toContain("IsDateString");

            orm.close();
        });
    });
});
