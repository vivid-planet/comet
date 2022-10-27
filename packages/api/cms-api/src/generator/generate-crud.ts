import { EntityMetadata } from "@mikro-orm/core";
import * as path from "path";

import { CrudGeneratorOptions, hasFieldFeature } from "./crud-generator.decorator";
import { writeCrudInput } from "./generate-crud-input";
import { writeGenerated } from "./utils/write-generated";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateCrud(generatorOptions: CrudGeneratorOptions, metadata: EntityMetadata<any>): Promise<void> {
    const classNameSingular = metadata.className;
    const classNamePlural = !metadata.className.endsWith("s") ? `${metadata.className}s` : metadata.className;
    const instanceNameSingular = classNameSingular[0].toLocaleLowerCase() + classNameSingular.slice(1);
    const instanceNamePlural = classNamePlural[0].toLocaleLowerCase() + classNamePlural.slice(1);
    const fileNameSingular = instanceNameSingular.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);
    const fileNamePlural = instanceNamePlural.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);

    async function writeCrudResolver(): Promise<void> {
        const crudSearchProps = metadata.props.filter(
            (prop) => prop.type === "string" && hasFieldFeature(metadata.class, prop.name, "search") && !prop.name.startsWith("scope_"),
        );
        const hasSearchArg = crudSearchProps.length > 0;
        const crudFilterProps = metadata.props.filter(
            (prop) =>
                hasFieldFeature(metadata.class, prop.name, "filter") &&
                !prop.name.startsWith("scope_") &&
                (prop.type === "string" ||
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

        if (hasFilterArg) {
            const filterOut = `import { StringFilter, NumberFilter, BooleanFilter, DateFilter } from "@comet/cms-api";
            import { Field, InputType } from "@nestjs/graphql";
            import { Type } from "class-transformer";
            import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

            @InputType()
            export class ${classNameSingular}Filter {
                ${crudFilterProps
                    .map((prop) => {
                        if (prop.enum) {
                            //TODO add support for enum
                        } else if (prop.type === "string") {
                            return `@Field(() => StringFilter, { nullable: true })
                            @ValidateNested()
                            @Type(() => StringFilter)
                            ${prop.name}?: StringFilter;
                            `;
                        } else if (prop.type === "DecimalType") {
                            return `@Field(() => NumberFilter, { nullable: true })
                            @ValidateNested()
                            @Type(() => NumberFilter)
                            ${prop.name}?: NumberFilter;
                            `;
                        } else if (prop.type === "boolean" || prop.type === "BooleanType") {
                            return `@Field(() => BooleanFilter, { nullable: true })
                            @ValidateNested()
                            @Type(() => BooleanFilter)
                            ${prop.name}?: BooleanFilter;
                            `;
                        } else if (prop.type === "DateType" || prop.type === "Date") {
                            return `@Field(() => DateFilter, { nullable: true })
                            @ValidateNested()
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
                and?: ${classNameSingular}Filter[];

                @Field(() => [${classNameSingular}Filter], { nullable: true })
                @Type(() => ${classNameSingular}Filter)
                @ValidateNested({ each: true })
                or?: ${classNameSingular}Filter[];
            }
            `;
            await writeGenerated(`${generatorOptions.targetDirectory}/dto/${fileNameSingular}.filter.ts`, filterOut);
        }
        if (hasSortArg) {
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
            await writeGenerated(`${generatorOptions.targetDirectory}/dto/${fileNameSingular}.sort.ts`, sortOut);
        }
        const paginatedOut = `import { ObjectType } from "@nestjs/graphql";
    import { PaginatedResponseFactory } from "@comet/cms-api";
    
    import { ${metadata.className} } from "${path.relative(`${generatorOptions.targetDirectory}/dto`, metadata.path).replace(/\.ts$/, "")}";
    
    @ObjectType()
    export class Paginated${classNamePlural} extends PaginatedResponseFactory.create(${metadata.className}) {}
    `;
        await writeGenerated(`${generatorOptions.targetDirectory}/dto/paginated-${fileNamePlural}.ts`, paginatedOut);

        const argsOut = `import { ArgsType, Field, IntersectionType } from "@nestjs/graphql";
    import { Type } from "class-transformer";
    import { IsOptional, IsString, ValidateNested } from "class-validator";
    import { OffsetBasedPaginationArgs } from "@comet/cms-api";
    import { ${classNameSingular}Filter } from "./${fileNameSingular}.filter";
    import { ${classNameSingular}Sort } from "./${fileNameSingular}.sort";
    
    @ArgsType()
    export class ${argsClassName} extends OffsetBasedPaginationArgs {
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
        sort?: ${classNameSingular}Sort[];
        `
                : ""
        }
    }
    `;
        await writeGenerated(`${generatorOptions.targetDirectory}/dto/${argsFileName}.ts`, argsOut);

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
        await writeGenerated(`${generatorOptions.targetDirectory}/${fileNamePlural}.service.ts`, serviceOut);

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
            ${scopeProp ? `@Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type},` : ""}
            @Args() { ${hasSearchArg ? `search, ` : ""}${hasFilterArg ? `filter, ` : ""}${hasSortArg ? `sort, ` : ""}offset, limit }: ${argsClassName}
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

        await writeGenerated(`${generatorOptions.targetDirectory}/${fileNameSingular}.crud.resolver.ts`, resolverOut);
    }

    await writeCrudInput(generatorOptions, metadata);
    await writeCrudResolver();
}
