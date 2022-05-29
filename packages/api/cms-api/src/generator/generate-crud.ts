/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityMetadata } from "@mikro-orm/core";
import { promises as fs } from "fs";
import * as path from "path";
import * as prettier from "prettier";

import { EntityGeneratorOptions } from "./entity-generator.decorator";

export async function generateCrud(entityMetadata: EntityMetadata<any>): Promise<void> {
    const generatorOptions = Reflect.getMetadata(`data:entityGeneratorOptions`, entityMetadata.class) as EntityGeneratorOptions;
    if (!generatorOptions) return; //no decorator used -> skip

    await writeInput(generatorOptions, entityMetadata);
    await writeCrudResolver(generatorOptions, entityMetadata);
}

async function writePettier(path: string, contents: string): Promise<void> {
    const prettierConfig = await prettier.resolveConfig(process.cwd());
    await fs.writeFile(path, prettier.format(contents, { ...prettierConfig, parser: "typescript" }));
    console.log(`generated ${path}`);
}

async function writeInput(generatorOptions: EntityGeneratorOptions, metadata: EntityMetadata<any>): Promise<void> {
    let fieldsOut = "";
    const classValidatorImports = new Set<string>();
    const cometCmsImports = new Set<string>();
    for (const prop of metadata.props) {
        const decorators = [] as Array<string>;
        if (!prop.nullable) {
            decorators.push("@IsNotEmpty()");
            classValidatorImports.add("IsNotEmpty");
        }
        if (prop.name === "id" || prop.name == "createdAt" || prop.name == "updatedAt") {
            //skip those (TODO find a non-magic solution?)
            continue;
        } else if (prop.type === "string") {
            decorators.push("@IsString()");
            classValidatorImports.add("IsString");
            if (prop.name === "slug") {
                //TODO find a non-magic solution
                decorators.push("@IsSlug()");
                cometCmsImports.add("IsSlug");
            }
        } else {
            //unsupported type TODO support more
            continue;
        }
        fieldsOut += `@Field()
        ${decorators.join("\n")}
        ${prop.name}: ${prop.type};
        
        `;
    }
    const inputOut = `import { Field, InputType } from "@nestjs/graphql";
    import { ${Array.from(classValidatorImports.values()).join(", ")} } from "class-validator";
    import { ${Array.from(cometCmsImports.values()).join(", ")} } from "@comet/cms-api";
    
    @InputType()
    export class ${metadata.className}Input {
        ${fieldsOut}
    }
    `;

    await fs.mkdir(`${generatorOptions.targetDirectory}/dto`, { recursive: true });
    await writePettier(`${generatorOptions.targetDirectory}/dto/${generatorOptions.singular}.input.ts`, inputOut);
}

async function writeCrudResolver(generatorOptions: EntityGeneratorOptions, metadata: EntityMetadata<any>): Promise<void> {
    const crudQueryProps = metadata.props.filter((prop) => Reflect.hasMetadata(`data:crudQuery`, metadata.class, prop.name));
    const hasQueryArg = crudQueryProps.length > 0;
    const hasSlugProp = metadata.props.some((prop) => prop.name == "slug");

    const paginatedOut = `import { ObjectType } from "@nestjs/graphql";
    import { PaginatedResponseFactory } from "@comet/cms-api";
    
    import { ${metadata.className} } from "${path.relative(`${generatorOptions.targetDirectory}/dto`, metadata.path).replace(/\.ts$/, "")}";
    
    @ObjectType()
    export class Paginated${metadata.className}s extends PaginatedResponseFactory.create(${metadata.className}) {}
    `;
    await fs.mkdir(`${generatorOptions.targetDirectory}/dto`, { recursive: true });
    await writePettier(`${generatorOptions.targetDirectory}/dto/paginated-${generatorOptions.singular}s.ts`, paginatedOut);

    const argsOut = `import { ArgsType, Field, IntersectionType } from "@nestjs/graphql";
    import { IsOptional, IsString } from "class-validator";
    import { OffsetBasedPaginationArgs, SortArgs } from "@comet/cms-api";
    
    @ArgsType()
    export class ${metadata.className}sArgs extends IntersectionType(OffsetBasedPaginationArgs, SortArgs) {
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
    await writePettier(`${generatorOptions.targetDirectory}/dto/${generatorOptions.singular}s.args.ts`, argsOut);

    const serviceOut = `import { FilterQuery } from "@mikro-orm/core";
    import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { Injectable } from "@nestjs/common";
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    
    @Injectable()
    export class ${metadata.className}sService {
        constructor(@InjectRepository(${metadata.className}) private readonly repository: EntityRepository<${metadata.className}>) {}
    
        ${
            hasQueryArg
                ? `
        getFindCondition(query: string | undefined): FilterQuery<${metadata.className}> {
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
    await writePettier(`${generatorOptions.targetDirectory}/${generatorOptions.singular}s.service.ts`, serviceOut);

    const resolverOut = `import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { FindOptions } from "@mikro-orm/core";
    import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
    import { SortDirection } from "@comet/cms-api";
    
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    import { ${metadata.className}sService } from "./${generatorOptions.singular}s.service";
    import { ${metadata.className}Input } from "./dto/${generatorOptions.singular}.input";
    import { Paginated${metadata.className}s } from "./dto/paginated-${generatorOptions.singular}s";
    import { ${metadata.className}sArgs } from "./dto/${generatorOptions.singular}s.args";

    @Resolver(() => ${metadata.className})
    export class ${metadata.className}CrudResolver {
        constructor(
            private readonly ${generatorOptions.singular}sService: ${metadata.className}sService,
            @InjectRepository(${metadata.className}) private readonly repository: EntityRepository<${metadata.className}>
        ) {}
    
        @Query(() => ${metadata.className}, { nullable: true })
        async ${generatorOptions.singular}(@Args("id", { type: () => ID }) id: string): Promise<${metadata.className} | null> {
            const ${generatorOptions.singular} = await this.repository.findOne(id);
    
            return ${generatorOptions.singular} ?? null;
        }
    
        ${
            hasSlugProp
                ? `
        @Query(() => ${metadata.className}, { nullable: true })
        async ${generatorOptions.singular}BySlug(@Args("slug") slug: string): Promise<${metadata.className} | null> {
            const ${generatorOptions.singular} = await this.repository.findOne({ slug });
    
            return ${generatorOptions.singular} ?? null;
        }
        `
                : ""
        }
    
        @Query(() => [${metadata.className}])
        async ${generatorOptions.plural}(@Args() { ${hasQueryArg ? `query, ` : ""}offset, limit, sortColumnName, sortDirection }: ${
        metadata.className
    }sArgs): Promise<Paginated${metadata.className}s> {
            const where = ${hasQueryArg ? `this.${generatorOptions.singular}sService.getFindCondition(query);` : "{}"}
            const options: FindOptions<${metadata.className}> = { offset, limit };
    
            if (sortColumnName) {
                options.orderBy = { [sortColumnName]: sortDirection };
            }
            const [entities, totalCount] = await this.repository.findAndCount(where, options);
            return new Paginated${metadata.className}s(entities, totalCount);
    
        }
    
        @Mutation(() => ${metadata.className})
        async create${metadata.className}(@Args("input", { type: () => ${metadata.className}Input }) input: ${metadata.className}Input): Promise<${
        metadata.className
    }> {
            const ${generatorOptions.singular} = new ${metadata.className}();
            ${generatorOptions.singular}.assign({
                ...input,
            });
    
            await this.repository.persistAndFlush(${generatorOptions.singular});
            return ${generatorOptions.singular};
        }
    
        @Mutation(() => ${metadata.className})
        async update${metadata.className}(@Args("id", { type: () => ID }) id: string, @Args("input", { type: () => ${
        metadata.className
    }Input }) input: ${metadata.className}Input): Promise<${metadata.className}> {
            const ${generatorOptions.singular} = await this.repository.findOneOrFail(id);
            ${generatorOptions.singular}.assign({
                ...input,
            });
    
            await this.repository.persistAndFlush(${generatorOptions.singular});
    
            return ${generatorOptions.singular};
        }
    
        @Mutation(() => Boolean)
        async delete${metadata.className}(@Args("id", { type: () => ID }) id: string): Promise<boolean> {
            await this.repository.removeAndFlush({ id });
    
            return true;
        }
    }
    `;

    await fs.mkdir(generatorOptions.targetDirectory, { recursive: true });
    await writePettier(`${generatorOptions.targetDirectory}/${generatorOptions.singular}.crud.resolver.ts`, resolverOut);
}
