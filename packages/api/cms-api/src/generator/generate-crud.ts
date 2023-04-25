/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityMetadata } from "@mikro-orm/core";
import * as path from "path";

import { CrudGeneratorOptions, hasFieldFeature } from "./crud-generator.decorator";
import { generateCrudInput } from "./generate-crud-input";
import { findEnumName } from "./utils/find-enum-name";
import { GeneratedFiles } from "./utils/write-generated-files";

function buildNameVariants(metadata: EntityMetadata<any>): {
    classNameSingular: string;
    classNamePlural: string;
    instanceNameSingular: string;
    instanceNamePlural: string;
    fileNameSingular: string;
    fileNamePlural: string;
} {
    const classNameSingular = metadata.className;
    const classNamePlural = !metadata.className.endsWith("s") ? `${metadata.className}s` : metadata.className;
    const instanceNameSingular = classNameSingular[0].toLocaleLowerCase() + classNameSingular.slice(1);
    const instanceNamePlural = classNamePlural[0].toLocaleLowerCase() + classNamePlural.slice(1);
    const fileNameSingular = instanceNameSingular.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);
    const fileNamePlural = instanceNamePlural.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);
    return {
        classNameSingular,
        classNamePlural,
        instanceNameSingular,
        instanceNamePlural,
        fileNameSingular,
        fileNamePlural,
    };
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function buildOptions(metadata: EntityMetadata<any>) {
    const { classNameSingular, classNamePlural, fileNameSingular, fileNamePlural } = buildNameVariants(metadata);

    const crudSearchProps = metadata.props.filter(
        (prop) => prop.type === "string" && hasFieldFeature(metadata.class, prop.name, "search") && !prop.name.startsWith("scope_"),
    );
    const hasSearchArg = crudSearchProps.length > 0;

    const crudFilterProps = metadata.props.filter(
        (prop) =>
            hasFieldFeature(metadata.class, prop.name, "filter") &&
            !prop.name.startsWith("scope_") &&
            (prop.enum ||
                prop.type === "string" ||
                prop.type === "DecimalType" ||
                prop.type === "BooleanType" ||
                prop.type === "boolean" ||
                prop.type === "DateType" ||
                prop.type === "Date"),
    );
    const hasFilterArg = crudFilterProps.length > 0;
    const crudSortProps = metadata.props.filter(
        (prop) =>
            hasFieldFeature(metadata.class, prop.name, "sort") &&
            !prop.name.startsWith("scope_") &&
            (prop.type === "string" ||
                prop.type === "DecimalType" ||
                prop.type === "BooleanType" ||
                prop.type === "boolean" ||
                prop.type === "DateType" ||
                prop.type === "Date"),
    );
    const hasSortArg = crudSortProps.length > 0;

    const hasSlugProp = metadata.props.some((prop) => prop.name == "slug");
    const hasVisibleProp = metadata.props.some((prop) => prop.name == "visible");
    const scopeProp = metadata.props.find((prop) => prop.name == "scope");
    if (scopeProp && !scopeProp.targetMeta) throw new Error("Scope prop has no targetMeta");
    const hasUpdatedAt = metadata.props.some((prop) => prop.name == "updatedAt");
    const argsClassName = `${classNameSingular != classNamePlural ? classNamePlural : `${classNamePlural}List`}Args`;
    const argsFileName = `${fileNameSingular != fileNamePlural ? fileNamePlural : `${fileNameSingular}-list`}.args`;

    const blockProps = metadata.props.filter((prop) => {
        return hasFieldFeature(metadata.class, prop.name, "input") && prop.type === "RootBlockType";
    });

    return {
        crudSearchProps,
        hasSearchArg,
        crudFilterProps,
        hasFilterArg,
        crudSortProps,
        hasSortArg,
        hasSlugProp,
        hasVisibleProp,
        scopeProp,
        hasUpdatedAt,
        argsClassName,
        argsFileName,
        blockProps,
    };
}

function generateFilterDto({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }): string {
    const { classNameSingular } = buildNameVariants(metadata);
    const { crudFilterProps } = buildOptions(metadata);

    let importsOut = "";
    let enumFiltersOut = "";

    const generatedEnumNames = new Set<string>();
    crudFilterProps.map((prop) => {
        if (prop.enum) {
            const enumName = findEnumName(metadata, prop.name);
            if (!generatedEnumNames.has(enumName)) {
                generatedEnumNames.add(enumName);
                enumFiltersOut += `@InputType()
                class ${enumName}EnumFilter extends createEnumFilter(${enumName}) {}
            `;
                // entity MUST export the enum (as enumName)
                importsOut += `import { ${enumName} } from "${path
                    .relative(`${generatorOptions.targetDirectory}/dto`, metadata.path)
                    .replace(/\.ts$/, "")}";`;
            }
        }
    });

    const filterOut = `import { StringFilter, NumberFilter, BooleanFilter, DateFilter, createEnumFilter } from "@comet/cms-api";
    import { Field, InputType } from "@nestjs/graphql";
    import { Type } from "class-transformer";
    import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
    ${importsOut}

    ${enumFiltersOut}

    @InputType()
    export class ${classNameSingular}Filter {
        ${crudFilterProps
            .map((prop) => {
                if (prop.enum) {
                    const enumName = findEnumName(metadata, prop.name);
                    return `@Field(() => ${enumName}EnumFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => ${enumName}EnumFilter)
                    ${prop.name}?: ${enumName}EnumFilter;
                    `;
                } else if (prop.type === "string") {
                    return `@Field(() => StringFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => StringFilter)
                    ${prop.name}?: StringFilter;
                    `;
                } else if (prop.type === "DecimalType") {
                    return `@Field(() => NumberFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => NumberFilter)
                    ${prop.name}?: NumberFilter;
                    `;
                } else if (prop.type === "boolean" || prop.type === "BooleanType") {
                    return `@Field(() => BooleanFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => BooleanFilter)
                    ${prop.name}?: BooleanFilter;
                    `;
                } else if (prop.type === "DateType" || prop.type === "Date") {
                    return `@Field(() => DateFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => DateFilter)
                    ${prop.name}?: DateFilter;
                    `;
                } else {
                    //unsupported type TODO support more
                }
                return "";
            })
            .join("\n")}

        @Field(() => [${classNameSingular}Filter], { nullable: true })
        @Type(() => ${classNameSingular}Filter)
        @ValidateNested({ each: true })
        @IsOptional()
        and?: ${classNameSingular}Filter[];

        @Field(() => [${classNameSingular}Filter], { nullable: true })
        @Type(() => ${classNameSingular}Filter)
        @ValidateNested({ each: true })
        @IsOptional()
        or?: ${classNameSingular}Filter[];
    }
    `;

    return filterOut;
}

function generateSortDto({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }): string {
    const { classNameSingular } = buildNameVariants(metadata);
    const { crudSortProps } = buildOptions(metadata);

    const sortOut = `import { SortDirection } from "@comet/cms-api";
    import { Field, InputType, registerEnumType } from "@nestjs/graphql";
    import { Type } from "class-transformer";
    import { IsEnum } from "class-validator";

    export enum ${classNameSingular}SortField {
        ${crudSortProps
            .map((prop) => {
                return `${prop.name} = "${prop.name}",`;
            })
            .join("\n")}
    }
    registerEnumType(${classNameSingular}SortField, {
        name: "${classNameSingular}SortField",
    });
    
    @InputType()
    export class ${classNameSingular}Sort {
        @Field(() => ${classNameSingular}SortField)
        @IsEnum(${classNameSingular}SortField)
        field: ${classNameSingular}SortField;
    
        @Field(() => SortDirection, { defaultValue: SortDirection.ASC })
        @IsEnum(SortDirection)
        direction: SortDirection = SortDirection.ASC;
    }
    `;

    return sortOut;
}
function generatePaginatedDto({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }): string {
    const { classNamePlural } = buildNameVariants(metadata);

    const paginatedOut = `import { ObjectType } from "@nestjs/graphql";
    import { PaginatedResponseFactory } from "@comet/cms-api";

    import { ${metadata.className} } from "${path.relative(`${generatorOptions.targetDirectory}/dto`, metadata.path).replace(/\.ts$/, "")}";

    @ObjectType()
    export class Paginated${classNamePlural} extends PaginatedResponseFactory.create(${metadata.className}) {}
    `;

    return paginatedOut;
}

function generateArgsDto({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }): string {
    const { classNameSingular, fileNameSingular } = buildNameVariants(metadata);
    const { scopeProp, argsClassName, hasSearchArg, hasSortArg, hasFilterArg } = buildOptions(metadata);

    const argsOut = `import { ArgsType, Field, IntersectionType } from "@nestjs/graphql";
    import { Type } from "class-transformer";
    import { IsOptional, IsString, ValidateNested } from "class-validator";
    import { OffsetBasedPaginationArgs } from "@comet/cms-api";
    import { ${classNameSingular}Filter } from "./${fileNameSingular}.filter";
    import { ${classNameSingular}Sort } from "./${fileNameSingular}.sort";
    ${
        scopeProp && scopeProp.targetMeta
            ? `import { ${scopeProp.targetMeta.className} } from "../${path
                  .relative(generatorOptions.targetDirectory, scopeProp.targetMeta.path)
                  .replace(/\.ts$/, "")}";`
            : ""
    }

    @ArgsType()
    export class ${argsClassName} extends OffsetBasedPaginationArgs {
        ${
            scopeProp
                ? `
        @Field(() => ${scopeProp.type})
        @ValidateNested()
        @Type(() => ${scopeProp.type})
        scope: ${scopeProp.type};
        `
                : ""
        }

        ${
            hasSearchArg
                ? `
        @Field({ nullable: true })
        @IsOptional()
        @IsString()
        search?: string;
        `
                : ""
        }

        ${
            hasFilterArg
                ? `
        @Field(() => ${classNameSingular}Filter, { nullable: true })
        @ValidateNested()
        @Type(() => ${classNameSingular}Filter)
        @IsOptional()
        filter?: ${classNameSingular}Filter;
        `
                : ""
        }

        ${
            hasSortArg
                ? `
        @Field(() => [${classNameSingular}Sort], { nullable: true })
        @ValidateNested({ each: true })
        @Type(() => ${classNameSingular}Sort)
        @IsOptional()
        sort?: ${classNameSingular}Sort[];
        `
                : ""
        }
    }
    `;
    return argsOut;
}

function generateService({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }): string {
    const { classNameSingular, fileNameSingular, classNamePlural } = buildNameVariants(metadata);
    const { hasSearchArg, hasFilterArg, crudSearchProps } = buildOptions(metadata);

    const serviceOut = `import { filtersToMikroOrmQuery, searchToMikroOrmQuery } from "@comet/cms-api";
    import { FilterQuery, ObjectQuery } from "@mikro-orm/core";
    import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { Injectable } from "@nestjs/common";
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    import { ${classNameSingular}Filter } from "./dto/${fileNameSingular}.filter";

    @Injectable()
    export class ${classNamePlural}Service {    
        ${
            hasSearchArg || hasFilterArg
                ? `
        getFindCondition(options: { ${hasSearchArg ? "search?: string, " : ""}${
                      hasFilterArg ? `filter?: ${classNameSingular}Filter, ` : ""
                  } }): ObjectQuery<${metadata.className}> {
            const andFilters = [];
            ${
                hasSearchArg
                    ? `
            if (options.search) {
                andFilters.push(searchToMikroOrmQuery(options.search, [${crudSearchProps.map((prop) => `"${prop.name}", `).join("")}]));
            }
            `
                    : ""
            }
            ${
                hasFilterArg
                    ? `
            if (options.filter) {
                andFilters.push(filtersToMikroOrmQuery(options.filter));
            }
            `
                    : ""
            }

            return andFilters.length > 0 ? { $and: andFilters } : {};
        }
        `
                : ""
        }
    }
    `;
    return serviceOut;
}

function generateResolver({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }): string {
    const { classNameSingular, fileNameSingular, instanceNameSingular, classNamePlural, fileNamePlural, instanceNamePlural } =
        buildNameVariants(metadata);
    const { scopeProp, argsClassName, argsFileName, hasSlugProp, hasSearchArg, hasSortArg, hasFilterArg, hasVisibleProp, blockProps, hasUpdatedAt } =
        buildOptions(metadata);

    const resolverOut = `import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { FindOptions } from "@mikro-orm/core";
    import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
    import { SortDirection, SubjectEntity, validateNotModified } from "@comet/cms-api";

    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    ${
        scopeProp && scopeProp.targetMeta
            ? `import { ${scopeProp.targetMeta.className} } from "${path
                  .relative(generatorOptions.targetDirectory, scopeProp.targetMeta.path)
                  .replace(/\.ts$/, "")}";`
            : ""
    }
    import { ${classNamePlural}Service } from "./${fileNamePlural}.service";
    import { ${classNameSingular}Input } from "./dto/${fileNameSingular}.input";
    import { Paginated${classNamePlural} } from "./dto/paginated-${fileNamePlural}";
    import { ${argsClassName} } from "./dto/${argsFileName}";

    @Resolver(() => ${metadata.className})
    export class ${classNameSingular}CrudResolver {
        constructor(
            private readonly ${instanceNamePlural}Service: ${classNamePlural}Service,
            @InjectRepository(${metadata.className}) private readonly repository: EntityRepository<${metadata.className}>
        ) {}

        @Query(() => ${metadata.className})
        @SubjectEntity(${metadata.className})
        async ${instanceNameSingular}(@Args("id", { type: () => ID }) id: string): Promise<${metadata.className}> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);
            return ${instanceNameSingular};
        }

        ${
            hasSlugProp
                ? `
        @Query(() => ${metadata.className}, { nullable: true })
        async ${instanceNameSingular}BySlug(@Args("slug") slug: string): Promise<${metadata.className} | null> {
            const ${instanceNameSingular} = await this.repository.findOne({ slug });

            return ${instanceNameSingular} ?? null;
        }
        `
                : ""
        }

        @Query(() => Paginated${classNamePlural})
        async ${instanceNameSingular != instanceNamePlural ? instanceNamePlural : `${instanceNamePlural}List`}(
            @Args() { ${scopeProp ? `scope, ` : ""}${hasSearchArg ? `search, ` : ""}${hasFilterArg ? `filter, ` : ""}${
        hasSortArg ? `sort, ` : ""
    }offset, limit }: ${argsClassName}
        ): Promise<Paginated${classNamePlural}> {
            const where = ${
                hasSearchArg || hasFilterArg
                    ? `this.${instanceNamePlural}Service.getFindCondition({ ${hasSearchArg ? `search, ` : ""}${hasFilterArg ? `filter, ` : ""} });`
                    : "{}"
            }
            ${scopeProp ? `where.scope = scope;` : ""}
            const options: FindOptions<${metadata.className}> = { offset, limit };

            ${
                hasSortArg
                    ? `if (sort) {
                options.orderBy = sort.map((sortItem) => {
                    return {
                        [sortItem.field]: sortItem.direction,
                    };
                });
            }`
                    : ""
            }

            const [entities, totalCount] = await this.repository.findAndCount(where, options);
            return new Paginated${classNamePlural}(entities, totalCount);

        }

        @Mutation(() => ${metadata.className})
        async create${classNameSingular}(
            ${scopeProp ? `@Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type},` : ""}
            @Args("input", { type: () => ${classNameSingular}Input }) input: ${classNameSingular}Input
        ): Promise<${metadata.className}> {
            const ${instanceNameSingular} = this.repository.create({
                ...input,
                ${blockProps.length ? `${blockProps.map((prop) => `${prop.name}: input.${prop.name}.transformToBlockData()`).join(", ")}, ` : ""}
                ${hasVisibleProp ? `visible: false,` : ""}
                ${scopeProp ? `scope,` : ""}
            });

            await this.repository.persistAndFlush(${instanceNameSingular});
            return ${instanceNameSingular};
        }

        @Mutation(() => ${metadata.className})
        @SubjectEntity(${metadata.className})
        async update${classNameSingular}(
            @Args("id", { type: () => ID }) id: string,
            @Args("input", { type: () => ${classNameSingular}Input }) input: ${classNameSingular}Input,
            ${hasUpdatedAt ? `@Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,` : ""}
        ): Promise<${metadata.className}> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);
            ${
                hasUpdatedAt
                    ? `if (lastUpdatedAt) {
                validateNotModified(${instanceNameSingular}, lastUpdatedAt);
            }`
                    : ""
            }
            ${instanceNameSingular}.assign({
                ...input,
                ${blockProps.length ? `${blockProps.map((prop) => `${prop.name}: input.${prop.name}.transformToBlockData()`).join(", ")}, ` : ""}
            });

            await this.repository.persistAndFlush(${instanceNameSingular});

            return ${instanceNameSingular};
        }

        @Mutation(() => Boolean)
        @SubjectEntity(${metadata.className})
        async delete${metadata.className}(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);
            await this.repository.removeAndFlush(${instanceNameSingular});

            return true;
        }

        ${
            hasVisibleProp
                ? `
        @Mutation(() => ${metadata.className})
        @SubjectEntity(${metadata.className})
        async update${classNameSingular}Visibility(
            @Args("id", { type: () => ID }) id: string,
            @Args("visible", { type: () => Boolean }) visible: boolean,
        ): Promise<${metadata.className}> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);

            ${instanceNameSingular}.assign({
                visible,
            });
            await this.repository.flush();

            return ${instanceNameSingular};
        }
        `
                : ""
        }
    }
    `;
    return resolverOut;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateCrud(generatorOptions: CrudGeneratorOptions, metadata: EntityMetadata<any>): Promise<GeneratedFiles> {
    const generatedFiles: GeneratedFiles = {};

    const { fileNameSingular, fileNamePlural } = buildNameVariants(metadata);
    const { hasFilterArg, hasSortArg, argsFileName } = buildOptions(metadata);

    async function generateCrudResolver(): Promise<GeneratedFiles> {
        if (hasFilterArg) {
            generatedFiles[`dto/${fileNameSingular}.filter.ts`] = generateFilterDto({ generatorOptions, metadata });
        }
        if (hasSortArg) {
            generatedFiles[`dto/${fileNameSingular}.sort.ts`] = generateSortDto({ generatorOptions, metadata });
        }
        generatedFiles[`dto/paginated-${fileNamePlural}.ts`] = generatePaginatedDto({ generatorOptions, metadata });
        generatedFiles[`dto/${argsFileName}.ts`] = generateArgsDto({ generatorOptions, metadata });
        generatedFiles[`${fileNamePlural}.service.ts`] = generateService({ generatorOptions, metadata });
        generatedFiles[`${fileNameSingular}.crud.resolver.ts`] = generateResolver({ generatorOptions, metadata });

        return generatedFiles;
    }

    return {
        [`dto/${fileNameSingular}.input.ts`]: await generateCrudInput(generatorOptions, metadata),
        ...(await generateCrudResolver()),
    };
}
