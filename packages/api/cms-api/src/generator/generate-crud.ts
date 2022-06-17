import { EntityMetadata } from "@mikro-orm/core";
import * as path from "path";

import { CrudGeneratorOptions } from "./crud-generator.decorator";
import { writeCrudInput as writeCrudInput } from "./generate-crud-input";
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
        const crudQueryProps = metadata.props.filter((prop) => Reflect.hasMetadata(`data:crudQuery`, metadata.class, prop.name));
        const hasQueryArg = crudQueryProps.length > 0;
        const hasSlugProp = metadata.props.some((prop) => prop.name == "slug");
        const hasVisibleProp = metadata.props.some((prop) => prop.name == "visible");
        const scopeProp = metadata.props.find((prop) => prop.name == "scope");
        if (scopeProp && !scopeProp.targetMeta) throw new Error("Scope prop has no targetMeta");
        const hasUpdatedAt = metadata.props.some((prop) => prop.name == "updatedAt");
        const argsClassName = `${classNameSingular != classNamePlural ? classNamePlural : `${classNamePlural}List`}Args`;
        const argsFileName = `${fileNameSingular != fileNamePlural ? fileNamePlural : `${fileNameSingular}-list`}.args`;

        const paginatedOut = `import { ObjectType } from "@nestjs/graphql";
    import { PaginatedResponseFactory } from "@comet/cms-api";
    
    import { ${metadata.className} } from "${path.relative(`${generatorOptions.targetDirectory}/dto`, metadata.path).replace(/\.ts$/, "")}";
    
    @ObjectType()
    export class Paginated${classNamePlural} extends PaginatedResponseFactory.create(${metadata.className}) {}
    `;
        await writeGenerated(`${generatorOptions.targetDirectory}/dto/paginated-${fileNamePlural}.ts`, paginatedOut);

        const argsOut = `import { ArgsType, Field, IntersectionType } from "@nestjs/graphql";
    import { IsOptional, IsString } from "class-validator";
    import { OffsetBasedPaginationArgs, SortArgs } from "@comet/cms-api";
    
    @ArgsType()
    export class ${argsClassName} extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {
        ${
            hasQueryArg
                ? `
        @Field({ nullable: true })
        @IsOptional()
        @IsString()
        query?: string;
        `
                : ""
        }
    }    
    `;
        await writeGenerated(`${generatorOptions.targetDirectory}/dto/${argsFileName}.ts`, argsOut);

        const serviceOut = `import { ObjectQuery } from "@mikro-orm/core";
    import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { Injectable } from "@nestjs/common";
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    
    @Injectable()
    export class ${classNamePlural}Service {    
        ${
            hasQueryArg
                ? `
        getFindCondition(query: string | undefined): ObjectQuery<${metadata.className}> {
            if (query) {
                return {
                    $or: [
                        {
                            ${crudQueryProps.map((prop) => `${prop.name}: { $ilike: \`%\${query}%\`, },`).join("\n")}
                        },
                    ],
                };
            }
    
            return {};
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
    import { SortDirection, validateNotModified } from "@comet/cms-api";
    
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    ${
        scopeProp
            ? `import { ${scopeProp.targetMeta!.className} } from "${path
                  .relative(generatorOptions.targetDirectory, scopeProp.targetMeta!.path)
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
    
        @Query(() => ${metadata.className}, { nullable: true })
        async ${instanceNameSingular}(@Args("id", { type: () => ID }) id: string): Promise<${metadata.className} | null> {
            const ${instanceNameSingular} = await this.repository.findOne(id);
    
            return ${instanceNameSingular} ?? null;
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
    
        @Query(() => [${metadata.className}])
        async ${instanceNameSingular != instanceNamePlural ? instanceNamePlural : `${instanceNamePlural}List`}(
            ${scopeProp ? `@Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type},` : ""}
            @Args() { ${hasQueryArg ? `query, ` : ""}offset, limit, sortColumnName, sortDirection }: ${argsClassName}
        ): Promise<Paginated${classNamePlural}> {
            const where = ${hasQueryArg ? `this.${instanceNamePlural}Service.getFindCondition(query);` : "{}"}
            ${scopeProp ? `where.scope = scope;` : ""}
            const options: FindOptions<${metadata.className}> = { offset, limit };
    
            if (sortColumnName) {
                options.orderBy = { [sortColumnName]: sortDirection };
            }
            const [entities, totalCount] = await this.repository.findAndCount(where, options);
            return new Paginated${classNamePlural}(entities, totalCount);
    
        }
    
        @Mutation(() => ${metadata.className})
        async create${classNameSingular}(
            ${scopeProp ? `@Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type},` : ""}
            @Args("input", { type: () => ${classNameSingular}Input }) input: ${classNameSingular}Input
        ): Promise<${metadata.className}> {
            const ${instanceNameSingular} = new ${metadata.className}();
            ${instanceNameSingular}.assign({
                ...input,
                ${hasVisibleProp ? `visible: false,` : ""}
                ${scopeProp ? `scope,` : ""}
            });
    
            await this.repository.persistAndFlush(${instanceNameSingular});
            return ${instanceNameSingular};
        }
    
        @Mutation(() => ${metadata.className})
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
            });
    
            await this.repository.persistAndFlush(${instanceNameSingular});
    
            return ${instanceNameSingular};
        }
    
        @Mutation(() => Boolean)
        async delete${metadata.className}(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            await this.repository.removeAndFlush({ id });
    
            return true;
        }

        ${
            hasVisibleProp
                ? `
        @Mutation(() => ${metadata.className})
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
