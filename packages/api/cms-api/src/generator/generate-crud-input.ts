import { Block } from "@comet/blocks-api";
import { EntityMetadata } from "@mikro-orm/core";
import * as path from "path";
import { RootBlockType } from "src/blocks/root-block-type";

import { hasFieldFeature } from "./crud-generator.decorator";
import { findEnumName } from "./utils/find-enum-name";
import { writeGeneratedFile } from "./utils/write-generated-file";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function writeCrudInput(generatorOptions: { targetDirectory: string }, metadata: EntityMetadata<any>): Promise<void> {
    const classNameSingular = metadata.className;
    const instanceNameSingular = classNameSingular[0].toLocaleLowerCase() + classNameSingular.slice(1);
    const fileNameSingular = instanceNameSingular.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);

    const inputOut = await generateCrudInput(generatorOptions, metadata);
    await writeGeneratedFile(`${generatorOptions.targetDirectory}/dto/${fileNameSingular}.input.ts`, inputOut);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateCrudInput(generatorOptions: { targetDirectory: string }, metadata: EntityMetadata<any>): Promise<string> {
    const props = metadata.props.filter((prop) => {
        return hasFieldFeature(metadata.class, prop.name, "input");
    });

    let fieldsOut = "";
    let importsOut = "";
    for (const prop of props) {
        let type = prop.type;
        const fieldName = prop.name;
        const decorators = [] as Array<string>;
        if (!prop.nullable) {
            decorators.push("@IsNotEmpty()");
        } else {
            decorators.push("@IsNullable()");
        }
        if (["id", "createdAt", "updatedAt", "visible"].includes(prop.name)) {
            //skip those (TODO find a non-magic solution?)
            continue;
        } else if (prop.enum) {
            const enumName = findEnumName(metadata, prop.name);
            decorators.push(`@IsEnum(${enumName})`);
            decorators.push(`@Field(() => ${enumName}${prop.nullable ? ", { nullable: true }" : ""})`);
            type = enumName;
            // entity MUST export the enum (as enumName)
            importsOut += `import { ${enumName} } from "${path
                .relative(`${generatorOptions.targetDirectory}/dto`, metadata.path)
                .replace(/\.ts$/, "")}";`;
        } else if (prop.type === "string") {
            decorators.push("@IsString()");
            if (prop.name.startsWith("scope_")) {
                continue;
            } else if (prop.name === "slug") {
                //TODO find a non-magic solution
                decorators.push("@IsSlug()");
            }
            decorators.push(`@Field(${prop.nullable ? "{ nullable: true }" : ""})`);
        } else if (prop.type === "DecimalType") {
            decorators.push("@IsNumber()");
            decorators.push(`@Field(${prop.nullable ? "{ nullable: true }" : ""})`);
            type = "number";
        } else if (prop.type === "DateType" || prop.type === "Date") {
            decorators.push("@IsDate()");
            decorators.push(`@Field(${prop.nullable ? "{ nullable: true }" : ""})`);
            type = "Date";
        } else if (prop.type === "BooleanType" || prop.type === "boolean") {
            decorators.push("@IsBoolean()");
            decorators.push(`@Field(${prop.nullable ? "{ nullable: true }" : ""})`);
            type = "boolean";
        } else if (prop.type === "RootBlockType") {
            const rootBlockType = prop.customType as RootBlockType | undefined;
            let blockExportName: string;
            if (rootBlockType?.block.name == "DamImage") {
                // TODO (detect that is block is defined in library (or use completely other technique))
                importsOut += `import { DamImageBlock } from "@comet/cms-api";`;
                blockExportName = "DamImageBlock";
            } else {
                if (!rootBlockType) throw new Error("Custom type not set");
                if (!rootBlockType.block.path) throw new Error(`No path found for block ${rootBlockType.block.name}`);
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const exports = require(rootBlockType.block.path);
                const blockExport = Object.entries(exports).find((i) => {
                    const b = i[1] as Block | undefined;
                    return b && b.blockDataFactory == rootBlockType.block.blockDataFactory;
                });
                if (!blockExport) {
                    throw new Error(`Can't find block export ${rootBlockType.block.name} in ${rootBlockType.block.path}`);
                }
                blockExportName = blockExport[0];
                importsOut += `import { ${blockExportName} } from "${path
                    .relative(`${generatorOptions.targetDirectory}/dto`, rootBlockType.block.path)
                    .replace(/\.ts$/, "")}";`;
            }

            decorators.push(`@Field(() => RootBlockInputScalar(${blockExportName})${prop.nullable ? ", { nullable: true }" : ""})`);
            decorators.push(
                `@Transform(({ value }) => (isBlockInputInterface(value) ? value : ${blockExportName}.blockInputFactory(value)), { toClassOnly: true })`,
            );
            decorators.push("@ValidateNested()");
            type = "BlockInputInterface";
        } else if (prop.reference == "m:1") {
            decorators.push(`@Field(() => [ID]${prop.nullable ? ", { nullable: true }" : ""})`);
            decorators.push("@IsUUID()");
            type = "string";
        } else if (prop.reference == "1:m") {
            decorators.length = 0;
            decorators.push(`@Field(() => [ID])`);
            decorators.push(`@IsArray()`);
            decorators.push(`@IsUUID(undefined, { each: true })`);
            type = "string[]";
        } else if (prop.reference == "m:n") {
            decorators.length = 0;
            decorators.push(`@Field(() => [ID])`);
            decorators.push(`@IsArray()`);
            decorators.push(`@IsUUID(undefined, { each: true })`);
            type = "string[]";
        } else {
            //unsupported type TODO support more
            continue;
        }
        fieldsOut += `${decorators.join("\n")}
    ${fieldName}${prop.nullable ? "?" : ""}: ${type};
    
    `;
    }
    const inputOut = `import { Field, InputType, ID } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsBoolean, IsDate, IsOptional, IsEnum, IsUUID, IsArray } from "class-validator";
import { IsSlug, RootBlockInputScalar, IsNullable, PartialType} from "@comet/cms-api";
import { GraphQLJSONObject } from "graphql-type-json";
import { BlockInputInterface, isBlockInputInterface } from "@comet/blocks-api";
${importsOut}

@InputType()
export class ${metadata.className}Input {
    ${fieldsOut}
}

@InputType()
export class ${metadata.className}UpdateInput extends PartialType(${metadata.className}Input) {}
`;

    return inputOut;
}
