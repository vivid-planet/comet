import { EntityMetadata } from "@mikro-orm/core";

import { hasFieldFeature } from "./crud-generator.decorator";
import { buildNameVariants } from "./utils/build-name-variants";
import { integerTypes } from "./utils/constants";
import { generateImportsCode, Imports } from "./utils/generate-imports-code";
import {
    findBlockImportPath,
    findBlockName,
    findEnumImportPath,
    findEnumName,
    findInputClassImportPath,
    morphTsProperty,
} from "./utils/ts-morph-helper";
import { GeneratedFile, writeGeneratedFiles } from "./utils/write-generated-files";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function writeCrudInput(generatorOptions: { targetDirectory: string }, metadata: EntityMetadata<any>): Promise<void> {
    const files = await generateCrudInput(generatorOptions, metadata);
    await writeGeneratedFiles(files, generatorOptions);
}

function tsCodeRecordToString(object: Record<string, string | undefined>) {
    const filteredEntries = Object.entries(object).filter(([key, value]) => value !== undefined);
    if (filteredEntries.length == 0) return "";
    return `{${filteredEntries.map(([key, value]) => `${key}: ${value},`).join("\n")}}`;
}

function findReferenceTargetType(
    targetMeta: EntityMetadata<unknown> | undefined,
    referencedColumnName: string,
): "uuid" | "string" | "integer" | null {
    const referencedColumnProp = targetMeta?.props.find((p) => p.name == referencedColumnName);
    if (!referencedColumnProp) throw new Error("referencedColumnProp not found");
    if (referencedColumnProp.type == "uuid") {
        return "uuid";
    } else if (referencedColumnProp.type == "string") {
        return "string";
    } else if (referencedColumnProp.type == "integer") {
        return "integer";
    } else {
        return null;
    }
}

export async function generateCrudInput(
    generatorOptions: { targetDirectory: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: EntityMetadata<any>,
    options: { nested: boolean; excludeFields: string[] } = { nested: false, excludeFields: [] },
): Promise<GeneratedFile[]> {
    const generatedFiles: GeneratedFile[] = [];

    const props = metadata.props
        .filter((prop) => {
            return !prop.embedded;
        })
        .filter((prop) => {
            return hasFieldFeature(metadata.class, prop.name, "input");
        })
        .filter((prop) => !options.excludeFields.includes(prop.name));

    let fieldsOut = "";
    const imports: Imports = [];
    for (const prop of props) {
        let type = prop.type;
        const fieldName = prop.name;
        const decorators = [] as Array<string>;
        if (!prop.nullable) {
            decorators.push("@IsNotEmpty()");
        } else {
            decorators.push("@IsNullable()");
        }
        if (["id", "createdAt", "updatedAt", "visible", "scope"].includes(prop.name)) {
            //skip those (TODO find a non-magic solution?)
            continue;
        } else if (prop.enum) {
            const initializer = morphTsProperty(prop.name, metadata).getInitializer()?.getText();
            const defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null") ? "null" : initializer;
            const fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue });
            const enumName = findEnumName(prop.name, metadata);
            const importPath = findEnumImportPath(enumName, generatorOptions, metadata);
            imports.push({ name: enumName, importPath });
            decorators.push(`@IsEnum(${enumName})`);
            decorators.push(`@Field(() => ${enumName}, ${fieldOptions})`);
            type = enumName;
        } else if (prop.type === "EnumArrayType") {
            if (prop.nullable) {
                console.warn(`${prop.name}: Nullable enum arrays are not supported`);
            }
            decorators.length = 0; //remove @IsNotEmpty
            const initializer = morphTsProperty(prop.name, metadata).getInitializer()?.getText();
            const fieldOptions = tsCodeRecordToString({ defaultValue: initializer });
            const enumName = findEnumName(prop.name, metadata);
            const importPath = findEnumImportPath(enumName, generatorOptions, metadata);
            imports.push({ name: enumName, importPath });
            decorators.push(`@IsEnum(${enumName}, { each: true })`);
            decorators.push(`@Field(() => [${enumName}], ${fieldOptions})`);
            type = `${enumName}[]`;
        } else if (prop.type === "string" || prop.type === "text") {
            const initializer = morphTsProperty(prop.name, metadata).getInitializer()?.getText();
            const defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null") ? "null" : initializer;
            const fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue });
            decorators.push("@IsString()");
            if (prop.name.startsWith("scope_")) {
                continue;
            } else if (prop.name === "slug") {
                //TODO find a non-magic solution
                decorators.push("@IsSlug()");
            }
            decorators.push(`@Field(${fieldOptions})`);
        } else if (prop.type === "DecimalType" || prop.type == "BigIntType" || prop.type === "number") {
            const initializer = morphTsProperty(prop.name, metadata).getInitializer()?.getText();
            const defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null") ? "null" : initializer;
            const fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue });
            if (integerTypes.includes(prop.columnTypes[0])) {
                decorators.push("@IsInt()");
            } else {
                decorators.push("@IsNumber()");
            }
            decorators.push(`@Field(${fieldOptions})`);
            type = "number";
        } else if (prop.type === "DateType" || prop.type === "Date") {
            decorators.push("@IsDate()");
            decorators.push(`@Field(${prop.nullable ? "{ nullable: true }" : ""})`);
            type = "Date";
        } else if (prop.type === "BooleanType" || prop.type === "boolean") {
            const initializer = morphTsProperty(prop.name, metadata).getInitializer()?.getText();
            const defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null") ? "null" : initializer;
            const fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue });
            decorators.push("@IsBoolean()");
            decorators.push(`@Field(${fieldOptions})`);
            type = "boolean";
        } else if (prop.type === "RootBlockType") {
            const blockName = findBlockName(prop.name, metadata);
            const importPath = findBlockImportPath(blockName, generatorOptions, metadata);
            imports.push({ name: blockName, importPath });

            decorators.push(`@Field(() => RootBlockInputScalar(${blockName})${prop.nullable ? ", { nullable: true }" : ""})`);
            decorators.push(
                `@Transform(({ value }) => (isBlockInputInterface(value) ? value : ${blockName}.blockInputFactory(value)), { toClassOnly: true })`,
            );
            decorators.push("@ValidateNested()");
            type = "BlockInputInterface";
        } else if (prop.reference == "m:1") {
            const initializer = morphTsProperty(prop.name, metadata).getInitializer()?.getText();
            const defaultValueNull = prop.nullable && (initializer == "undefined" || initializer == "null");
            const fieldOptions = tsCodeRecordToString({
                nullable: prop.nullable ? "true" : undefined,
                defaultValue: defaultValueNull ? "null" : undefined,
            });
            decorators.push(`@Field(() => ID, ${fieldOptions})`);

            if (prop.referencedColumnNames.length > 1) {
                console.warn(`${prop.name}: Composite keys are not supported`);
                continue;
            }
            const refType = findReferenceTargetType(prop.targetMeta, prop.referencedColumnNames[0]);
            if (refType == "uuid") {
                type = "string";
                decorators.push("@IsUUID()");
            } else if (refType == "string") {
                type = "string";
                decorators.push("@IsString()");
            } else if (refType == "integer") {
                type = "number";
                decorators.push("@Transform(({ value }) => (value ? parseInt(value) : null))");
                decorators.push("@IsInt()");
            } else {
                console.warn(`${prop.name}: Unsupported referenced type`);
            }
        } else if (prop.reference == "1:m") {
            if (prop.orphanRemoval) {
                //if orphanRemoval is enabled, we need to generate a nested input type
                decorators.length = 0;
                {
                    if (!prop.targetMeta) throw new Error("No targetMeta");
                    const excludeFields = prop.targetMeta.props.filter((p) => p.reference == "m:1" && p.targetMeta == metadata).map((p) => p.name);
                    const nestedInputFiles = await generateCrudInput(generatorOptions, prop.targetMeta, { nested: true, excludeFields });
                    generatedFiles.push(...nestedInputFiles);
                    imports.push({
                        name: `${prop.targetMeta.className}Input`,
                        importPath: nestedInputFiles[0].name.replace(/^dto/, ".").replace(/\.ts$/, ""),
                    });
                }
                const inputName = `${prop.targetMeta.className}Input`;
                decorators.push(`@Field(() => [${inputName}], {${prop.nullable ? "nullable: true" : "defaultValue: []"}})`);
                decorators.push(`@IsArray()`);
                decorators.push(`@Type(() => ${inputName})`);
                type = `${inputName}[]`;
            } else {
                //if orphanRemoval is disabled, we reference the id in input
                decorators.length = 0;
                decorators.push(`@Field(() => [ID], {${prop.nullable ? "nullable: true" : "defaultValue: []"}})`);
                decorators.push(`@IsArray()`);

                if (prop.referencedColumnNames.length > 1) {
                    console.warn(`${prop.name}: Composite keys are not supported`);
                    continue;
                }
                const refType = findReferenceTargetType(prop.targetMeta, prop.referencedColumnNames[0]);
                if (refType == "uuid") {
                    type = "string[]";
                    decorators.push("@IsUUID(undefined, { each: true })");
                } else if (refType == "string") {
                    type = "string[]";
                    decorators.push("@IsString({ each: true })");
                } else if (refType == "integer") {
                    type = "number[]";
                    decorators.push("@Transform(({ value }) => value.map((id: string) => parseInt(id)))");
                    decorators.push("@IsInt({ each: true })");
                } else {
                    console.warn(`${prop.name}: Unsupported referenced type`);
                }
            }
        } else if (prop.reference == "m:n") {
            decorators.length = 0;
            decorators.push(`@Field(() => [ID], {${prop.nullable ? "nullable" : "defaultValue: []"}})`);
            decorators.push(`@IsArray()`);

            if (prop.referencedColumnNames.length > 1) {
                console.warn(`${prop.name}: Composite keys are not supported`);
                continue;
            }
            const refType = findReferenceTargetType(prop.targetMeta, prop.referencedColumnNames[0]);
            if (refType == "uuid") {
                type = "string[]";
                decorators.push("@IsUUID(undefined, { each: true })");
            } else if (refType == "string") {
                type = "string[]";
                decorators.push("@IsString({ each: true })");
            } else if (refType == "integer") {
                type = "number[]";
                decorators.push("@Transform(({ value }) => value.map((id: string) => parseInt(id)))");
            } else {
                console.warn(`${prop.name}: Unsupported referenced type`);
            }
        } else if (prop.reference == "1:1") {
            {
                if (!prop.targetMeta) throw new Error("No targetMeta");
                const excludeFields = prop.targetMeta.props.filter((p) => p.reference == "1:1" && p.targetMeta == metadata).map((p) => p.name);
                const nestedInputFiles = await generateCrudInput(generatorOptions, prop.targetMeta, { nested: true, excludeFields });
                generatedFiles.push(...nestedInputFiles);
                imports.push({
                    name: `${prop.targetMeta.className}Input`,
                    importPath: nestedInputFiles[0].name.replace(/^dto/, ".").replace(/\.ts$/, ""),
                });
            }
            const inputName = `${prop.targetMeta.className}Input`;
            decorators.push(`@Field(() => ${inputName}${prop.nullable ? ", { nullable: true }" : ""})`);
            decorators.push(`@Type(() => ${inputName})`);
            decorators.push("@ValidateNested()");
            type = `${inputName}`;
        } else if (prop.type == "JsonType" || prop.embeddable) {
            const tsProp = morphTsProperty(prop.name, metadata);

            let tsType = tsProp.getType();
            if (tsType.isUnion() && tsType.getUnionTypes().length == 2 && tsType.getUnionTypes()[0].getText() == "undefined") {
                // undefinded | type (or prop?: type) -> type
                tsType = tsType.getUnionTypes()[1];
            }
            type = tsType.getText(tsProp);
            if (tsType.isArray()) {
                const initializer = tsProp.getInitializer()?.getText();
                const defaultValue =
                    prop.nullable && (initializer == "undefined" || initializer == "null") ? "null" : initializer == "[]" ? "[]" : undefined;
                const fieldOptions = tsCodeRecordToString({
                    nullable: prop.nullable ? "true" : undefined,
                    defaultValue: defaultValue,
                });

                decorators.push(`@IsArray()`);
                if (type == "string[]") {
                    decorators.push(`@Field(() => [String], ${fieldOptions})`);
                    decorators.push("@IsString({ each: true })");
                } else if (type == "number[]") {
                    decorators.push(`@Field(() => [Number], ${fieldOptions})`);
                    decorators.push("@IsNumber({ each: true })");
                } else if (type == "boolean[]") {
                    decorators.push(`@Field(() => [Boolean], ${fieldOptions})`);
                    decorators.push("@IsBoolean({ each: true })");
                } else {
                    const nestedClassName = tsType.getArrayElementTypeOrThrow().getText(tsProp);
                    const importPath = findInputClassImportPath(nestedClassName, generatorOptions, metadata);
                    imports.push({ name: nestedClassName, importPath });
                    decorators.push(`@ValidateNested()`);
                    decorators.push(`@Type(() => ${nestedClassName})`);
                    decorators.push(`@Field(() => [${nestedClassName}], ${fieldOptions})`);
                }
            } else {
                const nestedClassName = tsType.getText(tsProp);
                const importPath = findInputClassImportPath(nestedClassName, generatorOptions, metadata);
                imports.push({ name: nestedClassName, importPath });
                decorators.push(`@ValidateNested()`);
                decorators.push(`@Type(() => ${nestedClassName})`);
                decorators.push(`@Field(() => ${nestedClassName}${prop.nullable ? ", { nullable: true }" : ""})`);
            }
        } else if (prop.type == "uuid") {
            const initializer = morphTsProperty(prop.name, metadata).getInitializer()?.getText();
            const defaultValueNull = prop.nullable && (initializer == "undefined" || initializer == "null");
            const fieldOptions = tsCodeRecordToString({
                nullable: prop.nullable ? "true" : undefined,
                defaultValue: defaultValueNull ? "null" : undefined,
            });
            decorators.push(`@Field(() => ID, ${fieldOptions})`);
            decorators.push("@IsUUID()");
            type = "string";
        } else {
            console.warn(`${prop.name}: unsupported type ${type}`);
            continue;
        }
        fieldsOut += `${decorators.join("\n")}
    ${fieldName}${prop.nullable ? "?" : ""}: ${type};
    
    `;
    }
    const inputOut = `import { Field, InputType, ID } from "@nestjs/graphql";
import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsBoolean, IsDate, IsOptional, IsEnum, IsUUID, IsArray, IsInt } from "class-validator";
import { IsSlug, RootBlockInputScalar, IsNullable, PartialType} from "@comet/cms-api";
import { GraphQLJSONObject } from "graphql-type-json";
import { BlockInputInterface, isBlockInputInterface } from "@comet/blocks-api";
${generateImportsCode(imports)}

@InputType()
export class ${metadata.className}Input {
    ${fieldsOut}
}

${
    !options.nested
        ? `
@InputType()
export class ${metadata.className}UpdateInput extends PartialType(${metadata.className}Input) {}
`
        : ""
}
`;

    const { fileNameSingular } = buildNameVariants(metadata);
    generatedFiles.push({
        name: !options.nested ? `dto/${fileNameSingular}.input.ts` : `dto/${fileNameSingular}.nested.input.ts`,
        content: inputOut,
        type: "input",
    });
    return generatedFiles;
}
