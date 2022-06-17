import { EntityMetadata } from "@mikro-orm/core";
import * as path from "path";

import { CrudSingleGeneratorOptions } from "./crud-generator.decorator";
import { writeCrudInput } from "./generate-crud-input";
import { writeGenerated } from "./utils/write-generated";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateCrudSingle(generatorOptions: CrudSingleGeneratorOptions, metadata: EntityMetadata<any>): Promise<void> {
    const classNameSingular = metadata.className;
    const classNamePlural = !metadata.className.endsWith("s") ? `${metadata.className}s` : metadata.className;
    const instanceNameSingular = classNameSingular[0].toLocaleLowerCase() + classNameSingular.slice(1);
    const instanceNamePlural = classNamePlural[0].toLocaleLowerCase() + classNamePlural.slice(1);
    const fileNameSingular = instanceNameSingular.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);
    const fileNamePlural = instanceNamePlural.replace(/[A-Z]/g, (i) => `-${i.toLocaleLowerCase()}`);

    async function writeCrudResolver(): Promise<void> {
        const scopeProp = metadata.props.find((prop) => prop.name == "scope");
        if (scopeProp && !scopeProp.targetMeta) throw new Error("Scope prop has no targetMeta");
        const hasUpdatedAt = metadata.props.some((prop) => prop.name == "updatedAt");
        const argsClassName = `${classNameSingular != classNamePlural ? classNamePlural : `${classNamePlural}List`}Args`;
        const argsFileName = `${fileNameSingular != fileNamePlural ? fileNamePlural : `${fileNameSingular}-list`}.args`;

        const serviceOut = `import { ObjectQuery } from "@mikro-orm/core";
    import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { Injectable } from "@nestjs/common";
    import { ${metadata.className} } from "${path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, "")}";
    
    @Injectable()
    export class ${classNamePlural}Service {    
        
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
        async ${instanceNameSingular}(
                ${scopeProp ? `@Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type},` : ""}
            ): Promise<${metadata.className} | null> {
            const ${instanceNamePlural} = await this.repository.find({${scopeProp ? `scope` : ""}});
            if (${instanceNamePlural}.length > 1) {
                throw new Error("There must be only one ${instanceNameSingular}");
            }
    
            return ${instanceNamePlural}.length > 0 ? ${instanceNamePlural}[0] : null;
        }
    
        @Mutation(() => ${metadata.className})
        async save${classNameSingular}(
            ${scopeProp ? `@Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type},` : ""}
            @Args("input", { type: () => ${classNameSingular}Input }) input: ${classNameSingular}Input,
            ${hasUpdatedAt ? `@Args("lastUpdatedAt", { type: () => Date, nullable: true }) lastUpdatedAt?: Date,` : ""}
        ): Promise<${metadata.className}> {
            let ${instanceNameSingular} = await this.repository.findOne({${scopeProp ? `scope` : ""}});

            if (!${instanceNameSingular}) {
                ${instanceNameSingular} = this.repository.create({ 
                    ...input,
                    ${scopeProp ? `scope,` : ""} 
                });
            } else if (lastUpdatedAt) {
                if (lastUpdatedAt) {
                    validateNotModified(${instanceNameSingular}, lastUpdatedAt);
                }
    
                ${instanceNameSingular}.assign({ ...input });
            }
    
            await this.repository.persistAndFlush(${instanceNameSingular});
    
            return ${instanceNameSingular};
        }
    }
    `;

        await writeGenerated(`${generatorOptions.targetDirectory}/${fileNameSingular}.crud.resolver.ts`, resolverOut);
    }

    await writeCrudInput(generatorOptions, metadata);
    await writeCrudResolver();
}
