import { BaseEntity, Entity, MikroORM, PrimaryKey, Property } from "@mikro-orm/core";
import { LazyMetadataStorage } from "@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage";
import {
    IsEmail,
    IsISO8601,
    IsString,
    Length,
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";
import { v4 as uuid } from "uuid";

import { IsValidRedirectSource } from "../redirects/validators/isValidRedirectSource";
import { generateCrud } from "./generate-crud";
import { lintGeneratedFiles, parseSource } from "./utils/test-helper";

export const IsTrueAsString = (validationOptions?: ValidationOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (object: Record<string, any>, propertyName: string): void => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsSlugConstraint,
        });
    };
};

@ValidatorConstraint({ name: "IsTrueAsString", async: true })
class IsSlugConstraint implements ValidatorConstraintInterface {
    async validate(value: string): Promise<boolean> {
        return value === "true";
    }

    defaultMessage(): string {
        return "string is not 'true'";
    }
}

@Entity()
export class TestEntityWithEmail extends BaseEntity<TestEntityWithEmail, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @IsEmail()
    @IsString()
    @Property({ columnType: "text" })
    email: string;
}

@Entity()
export class TestEntityWithCaseSensitiveConstraintName extends BaseEntity<TestEntityWithCaseSensitiveConstraintName, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @IsISO8601()
    @Property({ columnType: "text" })
    dateAsString: string;
}

@Entity()
export class TestEntityWithShortenedDecoratorName extends BaseEntity<TestEntityWithShortenedDecoratorName, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @Length(2, 5)
    @Property({ columnType: "text" })
    dateAsString: string;
}

@Entity()
export class TestEntityWithRelativeImportDecorator extends BaseEntity<TestEntityWithRelativeImportDecorator, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @IsValidRedirectSource()
    @Property({ columnType: "text" })
    source: string;
}

@Entity()
export class TestEntityWithValidatorDefinedInFile extends BaseEntity<TestEntityWithValidatorDefinedInFile, "id"> {
    @PrimaryKey({ type: "uuid" })
    id: string = uuid();

    @IsTrueAsString()
    @Property({ columnType: "text" })
    trueString: string;
}

describe("GenerateDefinedValidatorDecorators", () => {
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

            const decorators = prop.decorators?.map((decorator) => decorator.name);
            expect(decorators).toContain("IsEmail");

            const importDeclarations = source.getImportDeclarations();
            const isEmailImport = importDeclarations.find((getImportDeclaration) =>
                getImportDeclaration.getNamedImports().some((namedImport) => namedImport.getName() === "IsEmail"),
            );
            expect(isEmailImport).toBeDefined();
            expect(isEmailImport?.getModuleSpecifierValue()).toBe("class-validator");

            orm.close();
        });

        describe("case sensitive validator", () => {
            it("should set IsISO8601 decorator", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntityWithCaseSensitiveConstraintName],
                });

                const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithCaseSensitiveConstraintName"));
                const lintedOut = await lintGeneratedFiles(out);
                const file = lintedOut.find((file) => file.name === "dto/test-entity-with-case-sensitive-constraint-name.input.ts");
                if (!file) throw new Error("File not found");
                const source = parseSource(file.content);
                const classes = source.getClasses();
                const cls = classes[0];
                const structure = cls.getStructure();

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prop = structure.properties![0];
                expect(prop.name).toBe("dateAsString");
                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("IsISO8601");

                const importDeclarations = source.getImportDeclarations();
                const isIsoImport = importDeclarations.find((getImportDeclaration) =>
                    getImportDeclaration.getNamedImports().some((namedImport) => namedImport.getName() === "IsISO8601"),
                );
                expect(isIsoImport).toBeDefined();
                expect(isIsoImport?.getModuleSpecifierValue()).toBe("class-validator");

                orm.close();
            });
        });

        describe("shortened decorator name", () => {
            it("should set Length decorator", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntityWithShortenedDecoratorName],
                });

                const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithShortenedDecoratorName"));
                const lintedOut = await lintGeneratedFiles(out);
                const file = lintedOut.find((file) => file.name === "dto/test-entity-with-shortened-decorator-name.input.ts");
                if (!file) throw new Error("File not found");
                const source = parseSource(file.content);
                const classes = source.getClasses();
                const cls = classes[0];
                const structure = cls.getStructure();

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prop = structure.properties![0];
                expect(prop.name).toBe("dateAsString");
                const decorators = prop.decorators?.map((decorator) => decorator.name);
                expect(decorators).toContain("Length");

                const importDeclarations = source.getImportDeclarations();
                const lengthImport = importDeclarations.find((getImportDeclaration) =>
                    getImportDeclaration.getNamedImports().some((namedImport) => namedImport.getName() === "Length"),
                );
                expect(lengthImport).toBeDefined();
                expect(lengthImport?.getModuleSpecifierValue()).toBe("class-validator");

                orm.close();
            });
        });

        describe("decorator with arguments", () => {
            it("should set defined arguments", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntityWithShortenedDecoratorName],
                });

                const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithShortenedDecoratorName"));
                const lintedOut = await lintGeneratedFiles(out);
                const file = lintedOut.find((file) => file.name === "dto/test-entity-with-shortened-decorator-name.input.ts");
                if (!file) throw new Error("File not found");
                const source = parseSource(file.content);
                const classes = source.getClasses();
                const cls = classes[0];
                const structure = cls.getStructure();

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prop = structure.properties![0];
                expect(prop.name).toBe("dateAsString");
                const lengthDecorator = prop.decorators?.find((decorator) => decorator.name === "Length");
                expect(lengthDecorator).toBeDefined();
                expect(lengthDecorator?.arguments).toEqual(["2", "5"]);

                const importDeclarations = source.getImportDeclarations();
                const lengthImport = importDeclarations.find((getImportDeclaration) =>
                    getImportDeclaration.getNamedImports().some((namedImport) => namedImport.getName() === "Length"),
                );
                expect(lengthImport).toBeDefined();
                expect(lengthImport?.getModuleSpecifierValue()).toBe("class-validator");

                orm.close();
            });
        });

        describe("relative path", () => {
            it("should set IsValidRedirectSource decorator", async () => {
                LazyMetadataStorage.load();
                const orm = await MikroORM.init({
                    type: "postgresql",
                    dbName: "test-db",
                    entities: [TestEntityWithRelativeImportDecorator],
                });

                const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithRelativeImportDecorator"));
                const lintedOut = await lintGeneratedFiles(out);
                const file = lintedOut.find((file) => file.name === "dto/test-entity-with-relative-import-decorator.input.ts");
                if (!file) throw new Error("File not found");
                const source = parseSource(file.content);
                const classes = source.getClasses();
                const cls = classes[0];
                const structure = cls.getStructure();

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prop = structure.properties![0];
                expect(prop.name).toBe("source");
                const decorators = prop.decorators?.map((i) => i.name);
                expect(decorators).toContain("IsValidRedirectSource");

                const importDeclarations = source.getImportDeclarations();
                const isSlugImport = importDeclarations.find((getImportDeclaration) =>
                    getImportDeclaration.getNamedImports().some((namedImport) => namedImport.getName() === "IsValidRedirectSource"),
                );
                expect(isSlugImport).toBeDefined();
                expect(isSlugImport?.getModuleSpecifierValue()).toBe("../redirects/validators/isValidRedirectSource");

                orm.close();
            });
        });
    });

    describe("validator defined in file", () => {
        it("should set IsTrueAsString decorator", async () => {
            LazyMetadataStorage.load();
            const orm = await MikroORM.init({
                type: "postgresql",
                dbName: "test-db",
                entities: [TestEntityWithValidatorDefinedInFile],
            });

            const out = await generateCrud({ targetDirectory: __dirname }, orm.em.getMetadata().get("TestEntityWithValidatorDefinedInFile"));
            const lintedOut = await lintGeneratedFiles(out);
            const file = lintedOut.find((file) => file.name === "dto/test-entity-with-validator-defined-in-file.input.ts");
            if (!file) throw new Error("File not found");
            const source = parseSource(file.content);
            const classes = source.getClasses();
            const cls = classes[0];
            const structure = cls.getStructure();

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const prop = structure.properties![0];
            expect(prop.name).toBe("trueString");
            const decorators = prop.decorators?.map((i) => i.name);
            expect(decorators).toContain("IsTrueAsString");

            const importDeclarations = source.getImportDeclarations();
            const isTrueAsStringImport = importDeclarations.find((getImportDeclaration) =>
                getImportDeclaration.getNamedImports().some((namedImport) => namedImport.getName() === "IsTrueAsString"),
            );
            expect(isTrueAsStringImport).toBeDefined();
            expect(isTrueAsStringImport?.getModuleSpecifierValue()).toBe("../generate-crud-input-validators.spec");

            orm.close();
        });
    });
});
