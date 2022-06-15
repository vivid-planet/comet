/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityMetadata } from "@mikro-orm/core";
import { promises as fs } from "fs";
import * as path from "path";
import * as prettier from "prettier";

import { EntityGeneratorOptions } from "./entity-generator.decorator";

export async function generateCrud(metadata: EntityMetadata<any>): Promise<void> {
    const generatorOptions = Reflect.getMetadata(`data:entityGeneratorOptions`, metadata.class) as EntityGeneratorOptions;
    if (!generatorOptions) return; //no decorator used -> skip

    const classNameSingular = metadata.className;
    const classNamePlural = !metadata.className.endsWith("s") ? `${metadata.className}s` : metadata.className;
    const instanceNameSingular = classNameSingular[0].toLocaleLowerCase() + classNameSingular.slice(1);
    const instanceNamePlural = classNamePlural[0].toLocaleLowerCase() + classNamePlural.slice(1);
    const fileNameSingular = instanceNameSingular.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);
    const fileNamePlural = instanceNamePlural.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);

    async function writePettier(path: string, contents: string): Promise<void> {
        const prettierConfig = await prettier.resolveConfig(process.cwd());
        await fs.writeFile(path, prettier.format(contents, { ...prettierConfig, parser: "typescript" }));
        console.log(`generated ${path}`);
    }

    async function writeInput(): Promise<void> {
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
            } else if (prop.enum) {
                //TODO add support for enum
                continue;
            } else if (prop.type === "string") {
                decorators.push("@IsString()");
                classValidatorImports.add("IsString");
                if (prop.name.startsWith("scope_")) {
                    //TODO add support for scope
                    continue;
                } else if (prop.name === "slug") {
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
        await writePettier(`${generatorOptions.targetDirectory}/dto/${fileNameSingular}.input.ts`, inputOut);
    }

    async function writeCrudResolver(): Promise<void> {
        const crudQueryProps = metadata.props.filter((prop) => Reflect.hasMetadata(`data:crudQuery`, metadata.class, prop.name));
        const hasQueryArg = crudQueryProps.length > 0;
        const hasSlugProp = metadata.props.some((prop) => prop.name == "slug");
        const hasVisibleProp = metadata.props.some((prop) => prop.name == "visible");
        const argsClassName = `${classNameSingular != classNamePlural ? classNamePlural : `${classNamePlural}List`}Args`;
        const argsFileName = `${fileNameSingular != fileNamePlural ? fileNamePlural : `${fileNameSingular}-list`}.args`;

        const paginatedOut = `import { ObjectType } from "@nestjs/graphql";
    import { PaginatedResponseFactory } from "@comet/cms-api";
    
    import { ${metadata.className} } from "${path.relative(`${generatorOptions.targetDirectory}/dto`, metadata.path).replace(/\.ts$/, "")}";
    
    @ObjectType()
    export class Paginated${classNamePlural} extends PaginatedResponseFactory.create(${metadata.className}) {}
    `;
        await fs.mkdir(`${generatorOptions.targetDirectory}/dto`, { recursive: true });
        await writePettier(`${generatorOptions.targetDirectory}/dto/paginated-${fileNamePlural}.ts`, paginatedOut);

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
        await writePettier(`${generatorOptions.targetDirectory}/dto/${argsFileName}.ts`, argsOut);

        const serviceOut = `import { FilterQuery } from "@mikro-orm/core";
    import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { Injectable } from "@nestjs/common";
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    
    @Injectable()
    export class ${classNamePlural}Service {
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
        await writePettier(`${generatorOptions.targetDirectory}/${fileNamePlural}.service.ts`, serviceOut);

        const resolverOut = `import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { FindOptions } from "@mikro-orm/core";
    import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
    import { SortDirection } from "@comet/cms-api";
    
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
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
        async ${instanceNameSingular != instanceNamePlural ? instanceNamePlural : `${instanceNamePlural}List`}(@Args() { ${
            hasQueryArg ? `query, ` : ""
        }offset, limit, sortColumnName, sortDirection }: ${argsClassName}): Promise<Paginated${classNamePlural}> {
            const where = ${hasQueryArg ? `this.${instanceNamePlural}Service.getFindCondition(query);` : "{}"}
            const options: FindOptions<${metadata.className}> = { offset, limit };
    
            if (sortColumnName) {
                options.orderBy = { [sortColumnName]: sortDirection };
            }
            const [entities, totalCount] = await this.repository.findAndCount(where, options);
            return new Paginated${classNamePlural}(entities, totalCount);
    
        }
    
        @Mutation(() => ${metadata.className})
        async create${classNameSingular}(@Args("input", { type: () => ${classNameSingular}Input }) input: ${classNameSingular}Input): Promise<${
            metadata.className
        }> {
            const ${instanceNameSingular} = new ${metadata.className}();
            ${instanceNameSingular}.assign({
                ...input,
            });
    
            await this.repository.persistAndFlush(${instanceNameSingular});
            return ${instanceNameSingular};
        }
    
        @Mutation(() => ${metadata.className})
        async update${classNameSingular}(@Args("id", { type: () => ID }) id: string, @Args("input", { type: () => ${classNameSingular}Input }) input: ${classNameSingular}Input): Promise<${
            metadata.className
        }> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);
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

        await fs.mkdir(generatorOptions.targetDirectory, { recursive: true });
        await writePettier(`${generatorOptions.targetDirectory}/${fileNameSingular}.crud.resolver.ts`, resolverOut);
    }

    await writeInput();
    await writeCrudResolver();
}
