/* eslint-disable @typescript-eslint/no-explicit-any */
import { EntityMetadata } from "@mikro-orm/core";
import * as path from "path";
import { singular } from "pluralize";

import { CrudGeneratorOptions, hasFieldFeature } from "./crud-generator.decorator";
import { generateCrudInput } from "./generate-crud-input";
import { buildNameVariants, classNameToInstanceName } from "./utils/build-name-variants";
import { integerTypes } from "./utils/constants";
import { generateImportsCode, Imports } from "./utils/generate-imports-code";
import { findEnumImportPath, findEnumName, morphTsProperty } from "./utils/ts-morph-helper";
import { GeneratedFile } from "./utils/write-generated-files";

// TODO move into own file
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function buildOptions(metadata: EntityMetadata<any>) {
    const { classNameSingular, classNamePlural, fileNameSingular, fileNamePlural } = buildNameVariants(metadata);

    const dedicatedResolverArgProps = metadata.props.filter((prop) => {
        if (hasFieldFeature(metadata.class, prop.name, "dedicatedResolverArg")) {
            if (prop.reference == "m:1") {
                return true;
            } else {
                console.warn(`${metadata.className} ${prop.name} can't use dedicatedResolverArg as it's not a m:1 relation`);
                return false;
            }
        }
        return false;
    });

    const crudSearchPropNames = metadata.props
        .filter((prop) => prop.name != "status")
        .filter((prop) => hasFieldFeature(metadata.class, prop.name, "search") && !prop.name.startsWith("scope_"))
        .reduce((acc, prop) => {
            if (prop.type === "string" || prop.type === "text") {
                acc.push(prop.name);
            } else if (prop.reference == "m:1") {
                if (!prop.targetMeta) {
                    throw new Error(`reference ${prop.name} has no targetMeta`);
                }
                prop.targetMeta.props
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .filter((innerProp) => hasFieldFeature(prop.targetMeta!.class, innerProp.name, "search") && !innerProp.name.startsWith("scope_"))
                    .forEach((innerProp) => {
                        if (innerProp.type === "string" || innerProp.type === "text") {
                            acc.push(`${prop.name}.${innerProp.name}`);
                        }
                    });
            }
            return acc;
        }, [] as string[]);
    const hasSearchArg = crudSearchPropNames.length > 0;

    let statusProp = metadata.props.find((prop) => prop.name == "status");
    if (statusProp) {
        if (!statusProp.enum) {
            console.warn(`${metadata.className} status prop must be an enum to be supported by crud generator`);
            statusProp = undefined;
        } else if (statusProp.nullable) {
            console.warn(`${metadata.className} status prop must not be nullable to be supported by crud generator`);
            statusProp = undefined;
        } else if (morphTsProperty(statusProp.name, metadata).getInitializer()?.getText() == "") {
            console.warn(`${metadata.className} status prop must have a default value to be supported by crud generator`);
            statusProp = undefined;
        }
    }
    let statusActiveItems: Array<string | number> | undefined = undefined;
    if (statusProp) {
        if (!statusProp.items) throw new Error("Status enum prop has not items");
        statusActiveItems = statusProp.items.filter((item) => {
            if (typeof item == "number") {
                console.warn(`${metadata.className} status prop must not have numeric items to be supported by crud generator`);
                return false;
            }
            return ["Active", "Visible", "Invisible", "Published", "Unpublished"].includes(item);
        });
    }
    const hasStatusFilter = statusProp && statusActiveItems && statusActiveItems.length != statusProp.items?.length; //if all items are active ones, no need for status filter

    const crudFilterProps = metadata.props.filter(
        (prop) =>
            hasFieldFeature(metadata.class, prop.name, "filter") &&
            !prop.name.startsWith("scope_") &&
            (prop.enum ||
                prop.type === "string" ||
                prop.type === "text" ||
                prop.type === "DecimalType" ||
                prop.type === "number" ||
                integerTypes.includes(prop.type) ||
                prop.type === "BooleanType" ||
                prop.type === "boolean" ||
                prop.type === "DateType" ||
                prop.type === "Date" ||
                prop.reference === "m:1") &&
            !dedicatedResolverArgProps.some((dedicatedResolverArgProp) => dedicatedResolverArgProp.name == prop.name),
    );
    const hasFilterArg = crudFilterProps.length > 0;
    const crudSortProps = metadata.props.filter(
        (prop) =>
            hasFieldFeature(metadata.class, prop.name, "sort") &&
            !prop.name.startsWith("scope_") &&
            (prop.type === "string" ||
                prop.type === "text" ||
                prop.type === "DecimalType" ||
                prop.type === "number" ||
                integerTypes.includes(prop.type) ||
                prop.type === "BooleanType" ||
                prop.type === "boolean" ||
                prop.type === "DateType" ||
                prop.type === "Date" ||
                prop.reference === "m:1"),
    );
    const hasSortArg = crudSortProps.length > 0;

    const hasSlugProp = metadata.props.some((prop) => prop.name == "slug");

    const scopeProp = metadata.props.find((prop) => prop.name == "scope");
    if (scopeProp && !scopeProp.targetMeta) throw new Error("Scope prop has no targetMeta");
    const argsClassName = `${classNameSingular != classNamePlural ? classNamePlural : `${classNamePlural}List`}Args`;
    const argsFileName = `${fileNameSingular != fileNamePlural ? fileNamePlural : `${fileNameSingular}-list`}.args`;

    const blockProps = metadata.props.filter((prop) => {
        return hasFieldFeature(metadata.class, prop.name, "input") && prop.type === "RootBlockType";
    });

    return {
        crudSearchPropNames,
        hasSearchArg,
        crudFilterProps,
        hasFilterArg,
        crudSortProps,
        hasSortArg,
        hasSlugProp,
        statusProp,
        statusActiveItems,
        hasStatusFilter,
        scopeProp,
        argsClassName,
        argsFileName,
        blockProps,
        dedicatedResolverArgProps,
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
            const enumName = findEnumName(prop.name, metadata);
            const importPath = findEnumImportPath(enumName, `${generatorOptions.targetDirectory}/dto`, metadata);
            if (!generatedEnumNames.has(enumName)) {
                generatedEnumNames.add(enumName);
                enumFiltersOut += `@InputType()
                    class ${enumName}EnumFilter extends createEnumFilter(${enumName}) {}
                `;
                importsOut += `import { ${enumName} } from "${importPath}";`;
            }
        }
    });

    const filterOut = `import { StringFilter, NumberFilter, BooleanFilter, DateFilter, ManyToOneFilter, createEnumFilter } from "@comet/cms-api";
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
                    const enumName = findEnumName(prop.name, metadata);
                    return `@Field(() => ${enumName}EnumFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => ${enumName}EnumFilter)
                    ${prop.name}?: ${enumName}EnumFilter;
                    `;
                } else if (prop.type === "string" || prop.type === "text") {
                    return `@Field(() => StringFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => StringFilter)
                    ${prop.name}?: StringFilter;
                    `;
                } else if (prop.type === "DecimalType" || prop.type == "number" || integerTypes.includes(prop.type)) {
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
                } else if (prop.reference === "m:1") {
                    return `@Field(() => ManyToOneFilter, { nullable: true })
                    @ValidateNested()
                    @IsOptional()
                    @Type(() => ManyToOneFilter)
                    ${prop.name}?: ManyToOneFilter;
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

    /* eslint-disable @typescript-eslint/naming-convention */
    // TODO: Replace with PascalCase
    export enum ${classNameSingular}SortField {
        ${crudSortProps
            .map((prop) => {
                return `${prop.name} = "${prop.name}",`;
            })
            .join("\n")}
    }
    /* eslint-enable @typescript-eslint/naming-convention */
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
    const {
        scopeProp,
        argsClassName,
        hasSearchArg,
        hasSortArg,
        hasFilterArg,
        statusProp,
        statusActiveItems,
        hasStatusFilter,
        dedicatedResolverArgProps,
    } = buildOptions(metadata);
    const imports: Imports = [];
    if (scopeProp && scopeProp.targetMeta) {
        imports.push(generateEntityImport(scopeProp.targetMeta, `${generatorOptions.targetDirectory}/dto`));
    }

    let statusFilterClassName: string | undefined = undefined;
    let statusFilterDefaultValue;
    let statusFilterItems: Array<string | number> | undefined = undefined;
    if (hasStatusFilter && statusProp) {
        if (statusActiveItems && statusActiveItems.length > 1) {
            //more than one active status, create enum that compresses them into single "Active"
            statusFilterItems = ["Active", ...(statusProp.items?.filter((item) => !statusActiveItems.includes(item)) ?? [])];
            statusFilterClassName = `${classNameSingular}StatusFilter`;
            statusFilterDefaultValue = `${statusFilterClassName}.Active`;
        } else {
            statusFilterClassName = findEnumName(statusProp.name, metadata);
            statusFilterDefaultValue = morphTsProperty(statusProp.name, metadata).getInitializer()?.getText();
            imports.push({
                name: statusFilterClassName,
                importPath: findEnumImportPath(statusFilterClassName, `${generatorOptions.targetDirectory}/dto`, metadata),
            });
        }
    }

    const argsOut = `import { ArgsType, Field, IntersectionType, registerEnumType, ID } from "@nestjs/graphql";
    import { Type } from "class-transformer";
    import { IsOptional, IsString, ValidateNested, IsEnum, IsUUID } from "class-validator";
    import { OffsetBasedPaginationArgs } from "@comet/cms-api";
    import { ${classNameSingular}Filter } from "./${fileNameSingular}.filter";
    import { ${classNameSingular}Sort } from "./${fileNameSingular}.sort";

    ${generateImportsCode(imports)}

    ${
        statusFilterItems && statusFilterClassName
            ? `
    export enum ${statusFilterClassName} {
        ${statusFilterItems.map((item) => `${item} = "${item}",`).join("\n")}
        }
    registerEnumType(${statusFilterClassName}, { name: "${statusFilterClassName}" });
    `
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

        ${dedicatedResolverArgProps
            .map((dedicatedResolverArgProp) => {
                if (integerTypes.includes(dedicatedResolverArgProp.type)) {
                    return `@Field(() => ID)
                    @Transform(({ value }) => value.map((id: string) => parseInt(id)))
                    @IsInt()
                    ${dedicatedResolverArgProp.name}: number;`;
                } else {
                    return `@Field(() => ID)
                    @IsUUID()
                    ${dedicatedResolverArgProp.name}: string;`;
                }
            })
            .join("")}

        ${
            hasStatusFilter
                ? `
        @Field(() => ${statusFilterClassName}, { defaultValue: ${statusFilterDefaultValue} })
        @IsEnum(${statusFilterClassName})
        status: ${statusFilterClassName};
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
    const { hasSearchArg, hasFilterArg, crudSearchPropNames } = buildOptions(metadata);

    const serviceOut = `import { filtersToMikroOrmQuery, searchToMikroOrmQuery } from "@comet/cms-api";
    import { FilterQuery, ObjectQuery } from "@mikro-orm/core";
    import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository } from "@mikro-orm/postgresql";
    import { Injectable } from "@nestjs/common";

    ${generateImportsCode([generateEntityImport(metadata, generatorOptions.targetDirectory)])}
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
                andFilters.push(searchToMikroOrmQuery(options.search, [${crudSearchPropNames.map((propName) => `"${propName}", `).join("")}]));
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

function generateEntityImport(targetMetadata: EntityMetadata<any>, relativeTo: string): Imports[0] {
    return {
        name: targetMetadata.className,
        importPath: path.relative(relativeTo, targetMetadata.path).replace(/\.ts$/, ""),
    };
}

function generateInputHandling(
    options: { mode: "create" | "update" | "updateNested"; inputName: string; assignEntityCode: string; excludeFields?: string[] },
    metadata: EntityMetadata<any>,
): string {
    const { instanceNameSingular } = buildNameVariants(metadata);
    const { blockProps, scopeProp, dedicatedResolverArgProps } = buildOptions(metadata);

    const props = metadata.props.filter((prop) => !options.excludeFields || !options.excludeFields.includes(prop.name));

    const relationManyToOneProps = props.filter((prop) => prop.reference === "m:1");
    const relationOneToManyProps = props.filter((prop) => prop.reference === "1:m");
    const relationManyToManyProps = props.filter((prop) => prop.reference === "m:n");
    const relationOneToOneProps = props.filter((prop) => prop.reference === "1:1");

    const inputRelationManyToOneProps = relationManyToOneProps
        .filter((prop) => hasFieldFeature(metadata.class, prop.name, "input"))
        .filter((prop) => {
            //filter out props that are dedicatedResolverArgProp
            return !dedicatedResolverArgProps.some((dedicatedResolverArgProp) => dedicatedResolverArgProp.name === prop.name);
        })
        .map((prop) => {
            return {
                name: prop.name,
                singularName: singular(prop.name),
                nullable: prop.nullable,
                type: prop.type,
                repositoryName: `${classNameToInstanceName(prop.type)}Repository`,
            };
        });

    const inputRelationOneToOneProps = relationOneToOneProps
        .filter((prop) => hasFieldFeature(metadata.class, prop.name, "input"))
        .map((prop) => {
            const targetMeta = prop.targetMeta;
            if (!targetMeta) throw new Error("targetMeta is not set for relation");
            return {
                name: prop.name,
                singularName: singular(prop.name),
                nullable: prop.nullable,
                type: prop.type,
                repositoryName: `${classNameToInstanceName(prop.type)}Repository`,
                targetMeta,
            };
        });
    const inputRelationToManyProps = [...relationOneToManyProps, ...relationManyToManyProps]
        .filter((prop) => hasFieldFeature(metadata.class, prop.name, "input"))
        .map((prop) => {
            const targetMeta = prop.targetMeta;
            if (!targetMeta) throw new Error("targetMeta is not set for relation");
            return {
                name: prop.name,
                singularName: singular(prop.name),
                nullable: prop.nullable,
                type: prop.type,
                repositoryName: `${classNameToInstanceName(prop.type)}Repository`,
                orphanRemoval: prop.orphanRemoval,
                targetMeta,
            };
        });

    const noAssignProps = [...inputRelationToManyProps, ...inputRelationManyToOneProps, ...inputRelationOneToOneProps, ...blockProps];
    return `
    ${
        noAssignProps.length
            ? `const { ${noAssignProps.map((prop) => `${prop.name}: ${prop.name}Input`).join(", ")}, ...assignInput } = ${options.inputName};`
            : ""
    }
    ${options.assignEntityCode}
    ...${noAssignProps.length ? `assignInput` : options.inputName},
        ${options.mode == "create" && scopeProp ? `scope,` : ""}
        ${
            options.mode == "create"
                ? dedicatedResolverArgProps
                      .map((dedicatedResolverArgProp) => {
                          return `${dedicatedResolverArgProp.name}: Reference.create(await this.${classNameToInstanceName(
                              dedicatedResolverArgProp.type,
                          )}Repository.findOneOrFail(${dedicatedResolverArgProp.name})), `;
                      })
                      .join("")
                : ""
        }
        ${
            options.mode == "create" || options.mode == "updateNested"
                ? inputRelationManyToOneProps
                      .map(
                          (prop) =>
                              `${prop.name}: ${prop.nullable ? `${prop.name}Input ? ` : ""}Reference.create(await this.${
                                  prop.repositoryName
                              }.findOneOrFail(${prop.name}Input))${prop.nullable ? ` : undefined` : ""}, `,
                      )
                      .join("")
                : ""
        }
        ${
            options.mode == "create" || options.mode == "updateNested"
                ? blockProps.map((prop) => `${prop.name}: ${prop.name}Input.transformToBlockData(),`).join("")
                : ""
        }
});
${inputRelationToManyProps
    .map((prop) => {
        if (prop.orphanRemoval) {
            return `if (${prop.name}Input) {
        ${instanceNameSingular}.${prop.name}.set(
            ${prop.name}Input.map((${prop.singularName}Input) => {
                ${generateInputHandling(
                    {
                        mode: "updateNested",
                        inputName: `${prop.singularName}Input`,

                        // alternative `return this.${prop.repositoryName}.create({` requires back relation to be set
                        assignEntityCode: `return this.${prop.repositoryName}.assign(new ${prop.type}(), {`,

                        excludeFields: prop.targetMeta.props
                            .filter((prop) => prop.reference == "m:1" && prop.targetMeta == metadata) //filter out referencing back to this entity
                            .map((prop) => prop.name),
                    },
                    prop.targetMeta,
                )}
            }),
        );
        }`;
        } else {
            return `
            if (${prop.name}Input) {
                const ${prop.name} = await this.${prop.repositoryName}.find({ id: ${prop.name}Input });
                if (${prop.name}.length != ${prop.name}Input.length) throw new Error("Couldn't find all ${prop.name} that were passed as input");
                await ${instanceNameSingular}.${prop.name}.loadItems();
                ${instanceNameSingular}.${prop.name}.set(${prop.name}.map((${prop.singularName}) => Reference.create(${prop.singularName})));
            }`;
        }
    })
    .join("")}

${inputRelationOneToOneProps
    .map(
        (prop) => `
            ${options.mode != "create" || prop.nullable ? `if (${prop.name}Input) {` : "{"}
                const ${prop.singularName} = ${
            (options.mode == "update" || options.mode == "updateNested") && prop.nullable
                ? `${instanceNameSingular}.${prop.name} ? await ${instanceNameSingular}.${prop.name}.load() : new ${prop.type}();`
                : `new ${prop.type}();`
        }
                ${generateInputHandling(
                    {
                        mode: "updateNested",
                        inputName: `${prop.name}Input`,
                        assignEntityCode: `this.${prop.repositoryName}.assign(${prop.singularName}, {`,
                        excludeFields: prop.targetMeta.props
                            .filter((prop) => prop.reference == "1:1" && prop.targetMeta == metadata) //filter out referencing back to this entity
                            .map((prop) => prop.name),
                    },
                    prop.targetMeta,
                )}
                ${options.mode != "create" || prop.nullable ? `}` : "}"}`,
    )
    .join("")}
${
    options.mode == "update"
        ? inputRelationManyToOneProps
              .map(
                  (prop) => `if (${prop.name}Input !== undefined) {
                        ${instanceNameSingular}.${prop.name} =
                            ${prop.nullable ? `${prop.name}Input ? ` : ""}
                            Reference.create(await this.${prop.repositoryName}.findOneOrFail(${prop.name}Input))
                            ${prop.nullable ? ` : undefined` : ""};
                        }`,
              )
              .join("")
        : ""
}
${
    options.mode == "update"
        ? blockProps
              .map(
                  (prop) => `
                    if (${prop.name}Input) {
                        ${instanceNameSingular}.${prop.name} = ${prop.name}Input.transformToBlockData();
                    }`,
              )
              .join("")
        : ""
}
    `;
}

function generateNestedEntityResolver({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }) {
    const { classNameSingular } = buildNameVariants(metadata);
    const { scopeProp } = buildOptions(metadata);

    const imports: Imports = [];

    const { imports: fieldImports, code, hasOutputRelations } = generateRelationsFieldResolver({ generatorOptions, metadata });
    if (!hasOutputRelations) return null;
    imports.push(...fieldImports);

    imports.push(generateEntityImport(metadata, generatorOptions.targetDirectory));

    return `
    import { RequiredPermission } from "@comet/cms-api";
    import { Args, ID, Info, Mutation, Query, Resolver, ResolveField, Parent } from "@nestjs/graphql";
    ${generateImportsCode(imports)}

    @Resolver(() => ${metadata.className})
    @RequiredPermission(${JSON.stringify(generatorOptions.requiredPermission)}${!scopeProp ? `, { skipScopeCheck: true }` : ""})
    export class ${classNameSingular}Resolver {
        ${code}
    }
    `;
}

function generateRelationsFieldResolver({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }) {
    const { instanceNameSingular } = buildNameVariants(metadata);

    const relationManyToOneProps = metadata.props.filter((prop) => prop.reference === "m:1");
    const relationOneToManyProps = metadata.props.filter((prop) => prop.reference === "1:m");
    const relationManyToManyProps = metadata.props.filter((prop) => prop.reference === "m:n");
    const relationOneToOneProps = metadata.props.filter((prop) => prop.reference === "1:1");
    const outputRelationManyToOneProps = relationManyToOneProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));
    const outputRelationOneToManyProps = relationOneToManyProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));
    const outputRelationManyToManyProps = relationManyToManyProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));
    const outputRelationOneToOneProps = relationOneToOneProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));
    for (const prop of metadata.props) {
        if (
            !hasFieldFeature(metadata.class, prop.name, "resolveField") &&
            !relationManyToOneProps.includes(prop) &&
            !relationOneToManyProps.includes(prop) &&
            !relationManyToManyProps.includes(prop) &&
            !relationOneToOneProps.includes(prop)
        ) {
            throw new Error(
                `${prop.name}: @CrudField resolveField=false is only used for relations, for other props simply remove @Field() to disable its output`,
            );
        }
    }

    const hasOutputRelations =
        outputRelationManyToOneProps.length > 0 ||
        outputRelationOneToManyProps.length > 0 ||
        outputRelationManyToManyProps.length > 0 ||
        outputRelationOneToOneProps.length > 0;

    const imports: Imports = [];

    for (const prop of [...relationManyToOneProps, ...relationOneToManyProps, ...relationManyToManyProps, ...relationOneToOneProps]) {
        if (!prop.targetMeta) throw new Error(`Relation ${prop.name} has targetMeta not set`);
        imports.push(generateEntityImport(prop.targetMeta, generatorOptions.targetDirectory));
    }

    const code = `
    ${outputRelationManyToOneProps
        .map(
            (prop) => `
        @ResolveField(() => ${prop.type}${prop.nullable ? `, { nullable: true }` : ""})
        async ${prop.name}(@Parent() ${instanceNameSingular}: ${metadata.className}): Promise<${prop.type}${prop.nullable ? ` | undefined` : ""}> {
            return ${instanceNameSingular}.${prop.name}${prop.nullable ? `?` : ""}.load();
        }    
    `,
        )
        .join("\n")}

    ${outputRelationOneToManyProps
        .map(
            (prop) => `
        @ResolveField(() => [${prop.type}])
        async ${prop.name}(@Parent() ${instanceNameSingular}: ${metadata.className}): Promise<${prop.type}[]> {
            return ${instanceNameSingular}.${prop.name}.loadItems();
        }   
    `,
        )
        .join("\n")}

    ${outputRelationManyToManyProps
        .map(
            (prop) => `
        @ResolveField(() => [${prop.type}])
        async ${prop.name}(@Parent() ${instanceNameSingular}: ${metadata.className}): Promise<${prop.type}[]> {
            return ${instanceNameSingular}.${prop.name}.loadItems();
        }
    `,
        )
        .join("\n")}

    ${outputRelationOneToOneProps
        .map(
            (prop) => `
        @ResolveField(() => ${prop.type}${prop.nullable ? `, { nullable: true }` : ""})
        async ${prop.name}(@Parent() ${instanceNameSingular}: ${metadata.className}): Promise<${prop.type}${prop.nullable ? ` | undefined` : ""}> {
            return ${instanceNameSingular}.${prop.name}${prop.nullable ? `?` : ""}.load();
        }
    `,
        )
        .join("\n")}

    `.trim();

    return {
        code,
        imports,
        hasOutputRelations,
    };
}

function generateResolver({ generatorOptions, metadata }: { generatorOptions: CrudGeneratorOptions; metadata: EntityMetadata<any> }): string {
    const { classNameSingular, fileNameSingular, instanceNameSingular, classNamePlural, fileNamePlural, instanceNamePlural } =
        buildNameVariants(metadata);
    const {
        scopeProp,
        argsClassName,
        argsFileName,
        hasSlugProp,
        hasSearchArg,
        hasSortArg,
        hasFilterArg,
        statusProp,
        statusActiveItems,
        hasStatusFilter,
        dedicatedResolverArgProps,
    } = buildOptions(metadata);

    const relationManyToOneProps = metadata.props.filter((prop) => prop.reference === "m:1");
    const relationOneToManyProps = metadata.props.filter((prop) => prop.reference === "1:m");
    const relationManyToManyProps = metadata.props.filter((prop) => prop.reference === "m:n");
    const relationOneToOneProps = metadata.props.filter((prop) => prop.reference === "1:1");
    const outputRelationManyToOneProps = relationManyToOneProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));
    const outputRelationOneToManyProps = relationOneToManyProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));
    const outputRelationManyToManyProps = relationManyToManyProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));
    const outputRelationOneToOneProps = relationOneToOneProps.filter((prop) => hasFieldFeature(metadata.class, prop.name, "resolveField"));

    const imports: Imports = [];

    const injectRepositories = new Set<string>();

    [...relationManyToOneProps, ...relationOneToOneProps, ...relationOneToManyProps, ...relationManyToManyProps]
        .filter((prop) => hasFieldFeature(metadata.class, prop.name, "input"))
        .forEach((prop) => {
            injectRepositories.add(prop.type);
        });
    dedicatedResolverArgProps.forEach((prop) => {
        injectRepositories.add(prop.type);
    });

    const {
        imports: relationsFieldResolverImports,
        code: relationsFieldResolverCode,
        hasOutputRelations,
    } = generateRelationsFieldResolver({
        generatorOptions,
        metadata,
    });
    imports.push(...relationsFieldResolverImports);

    imports.push(generateEntityImport(metadata, generatorOptions.targetDirectory));
    if (scopeProp && scopeProp.targetMeta) {
        imports.push(generateEntityImport(scopeProp.targetMeta, generatorOptions.targetDirectory));
    }

    if (statusProp) {
        const enumName = findEnumName(statusProp.name, metadata);
        const importPath = findEnumImportPath(enumName, generatorOptions.targetDirectory, metadata);
        imports.push({
            name: enumName,
            importPath,
        });
    }

    function generateIdArg(name: string, metadata: EntityMetadata<any>): string {
        if (integerTypes.includes(metadata.properties[name].type)) {
            return `@Args("${name}", { type: () => ID }, { transform: (value) => parseInt(value) }) ${name}: number`;
        } else {
            return `@Args("${name}", { type: () => ID }) ${name}: string`;
        }
    }

    const resolverOut = `import { InjectRepository } from "@mikro-orm/nestjs";
    import { EntityRepository, EntityManager } from "@mikro-orm/postgresql";
    import { FindOptions, ObjectQuery, Reference } from "@mikro-orm/core";
    import { Args, ID, Info, Mutation, Query, Resolver, ResolveField, Parent } from "@nestjs/graphql";
    import { extractGraphqlFields, SortDirection, RequiredPermission, AffectedEntity, validateNotModified } from "@comet/cms-api";
    import { GraphQLResolveInfo } from "graphql";

    import { ${classNamePlural}Service } from "./${fileNamePlural}.service";
    import { ${classNameSingular}Input, ${classNameSingular}UpdateInput } from "./dto/${fileNameSingular}.input";
    import { Paginated${classNamePlural} } from "./dto/paginated-${fileNamePlural}";
    import { ${argsClassName} } from "./dto/${argsFileName}";
    ${generateImportsCode(imports)}

    @Resolver(() => ${metadata.className})
    @RequiredPermission(${JSON.stringify(generatorOptions.requiredPermission)}${!scopeProp ? `, { skipScopeCheck: true }` : ""})
    export class ${classNameSingular}Resolver {
        constructor(
            private readonly entityManager: EntityManager,
            private readonly ${instanceNamePlural}Service: ${classNamePlural}Service,
            @InjectRepository(${metadata.className}) private readonly repository: EntityRepository<${metadata.className}>,
            ${[...injectRepositories]
                .map((type) => `@InjectRepository(${type}) private readonly ${classNameToInstanceName(type)}Repository: EntityRepository<${type}>`)
                .join(", ")}
        ) {}

        @Query(() => ${metadata.className})
        @AffectedEntity(${metadata.className})
        async ${instanceNameSingular}(${generateIdArg("id", metadata)}): Promise<${metadata.className}> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);
            return ${instanceNameSingular};
        }

        ${
            hasSlugProp
                ? `
        @Query(() => ${metadata.className}, { nullable: true })
        async ${instanceNameSingular}BySlug(
            @Args("slug") slug: string
            ${scopeProp ? `, @Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type}` : ""}
        ): Promise<${metadata.className} | null> {
            const ${instanceNameSingular} = await this.repository.findOne({ slug${scopeProp ? `, scope` : ""}});

            return ${instanceNameSingular} ?? null;
        }
        `
                : ""
        }

        ${
            generatorOptions.list
                ? `
        @Query(() => Paginated${classNamePlural})
        ${dedicatedResolverArgProps
            .map((dedicatedResolverArgProp) => {
                return `@AffectedEntity(${dedicatedResolverArgProp.targetMeta?.className}, { idArg: "${dedicatedResolverArgProp.name}" })`;
            })
            .join("")}
        async ${instanceNameSingular != instanceNamePlural ? instanceNamePlural : `${instanceNamePlural}List`}(
            @Args() {${Object.entries({
                scope: !!scopeProp,
                ...dedicatedResolverArgProps.reduce((acc, dedicatedResolverArgProp) => {
                    acc[dedicatedResolverArgProp.name] = true;
                    return acc;
                }, {} as Record<string, boolean>),
                status: !!hasStatusFilter,
                search: !!hasSearchArg,
                filter: !!hasFilterArg,
                sort: !!hasSortArg,
                offset: true,
                limit: true,
            })
                .filter(([key, use]) => use)
                .map(([key]) => key)
                .join(", ")}}: ${argsClassName}
            ${hasOutputRelations ? `, @Info() info: GraphQLResolveInfo` : ""}
        ): Promise<Paginated${classNamePlural}> {
            const where${
                hasSearchArg || hasFilterArg
                    ? ` = this.${instanceNamePlural}Service.getFindCondition({ ${hasSearchArg ? `search, ` : ""}${hasFilterArg ? `filter, ` : ""} });`
                    : `: ObjectQuery<${metadata.className}> = {}`
            }
            ${
                hasStatusFilter && statusActiveItems && statusActiveItems.length > 1
                    ? `if (status == "Active") {
                where.status = { $in: [${statusActiveItems.map((item) => `"${item}"`).join(", ")}] };
            } else {
                where.status = status;
            }`
                    : ""
            }
            ${hasStatusFilter && statusActiveItems && statusActiveItems.length <= 1 ? `where.status = status;` : ""}
            ${scopeProp ? `where.scope = scope;` : ""}
            ${dedicatedResolverArgProps
                .map((dedicatedResolverArgProp) => {
                    return `where.${dedicatedResolverArgProp.name} = ${dedicatedResolverArgProp.name};`;
                })
                .join("\n")}

            ${
                hasOutputRelations
                    ? `const fields = extractGraphqlFields(info, { root: "nodes" });
            const populate: string[] = [];`
                    : ""
            }
            ${[...outputRelationManyToOneProps, ...outputRelationOneToManyProps, ...outputRelationManyToManyProps, ...outputRelationOneToOneProps]
                .map(
                    (r) =>
                        `if (fields.includes("${r.name}")) {
                            populate.push("${r.name}");
                        }`,
                )
                .join("\n")}

            ${hasOutputRelations ? `// eslint-disable-next-line @typescript-eslint/no-explicit-any` : ""}
            const options: FindOptions<${metadata.className}${hasOutputRelations ? `, any` : ""}> = { offset, limit${
                      hasOutputRelations ? `, populate` : ""
                  }};

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
        `
                : ""
        }

        ${
            generatorOptions.create
                ? `

        @Mutation(() => ${metadata.className})
        ${dedicatedResolverArgProps
            .map((dedicatedResolverArgProp) => {
                return `@AffectedEntity(${dedicatedResolverArgProp.targetMeta?.className}, { idArg: "${dedicatedResolverArgProp.name}" })`;
            })
            .join("")}
        async create${classNameSingular}(
            ${scopeProp ? `@Args("scope", { type: () => ${scopeProp.type} }) scope: ${scopeProp.type},` : ""}${dedicatedResolverArgProps
                      .map((dedicatedResolverArgProp) => {
                          return `${generateIdArg(dedicatedResolverArgProp.name, metadata)}, `;
                      })
                      .join("")}@Args("input", { type: () => ${classNameSingular}Input }) input: ${classNameSingular}Input
        ): Promise<${metadata.className}> {

            ${generateInputHandling(
                { mode: "create", inputName: "input", assignEntityCode: `const ${instanceNameSingular} = this.repository.create({` },
                metadata,
            )}

            await this.entityManager.flush();

            return ${instanceNameSingular};
        }
        `
                : ""
        }

        ${
            generatorOptions.update
                ? `
        @Mutation(() => ${metadata.className})
        @AffectedEntity(${metadata.className})
        async update${classNameSingular}(
            ${generateIdArg("id", metadata)},
            @Args("input", { type: () => ${classNameSingular}UpdateInput }) input: ${classNameSingular}UpdateInput
        ): Promise<${metadata.className}> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);
            ${generateInputHandling({ mode: "update", inputName: "input", assignEntityCode: `${instanceNameSingular}.assign({` }, metadata)}

            await this.entityManager.flush();

            return ${instanceNameSingular};
        }
        `
                : ""
        }

        ${
            generatorOptions.delete
                ? `
        @Mutation(() => Boolean)
        @AffectedEntity(${metadata.className})
        async delete${metadata.className}(${generateIdArg("id", metadata)}): Promise<boolean> {
            const ${instanceNameSingular} = await this.repository.findOneOrFail(id);
            await this.entityManager.remove(${instanceNameSingular});
            await this.entityManager.flush();
            return true;
        }
        `
                : ""
        }

        ${relationsFieldResolverCode}

    }
    `;
    return resolverOut;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateCrud(generatorOptionsParam: CrudGeneratorOptions, metadata: EntityMetadata<any>): Promise<GeneratedFile[]> {
    const generatorOptions = {
        ...generatorOptionsParam,
        create: generatorOptionsParam.create ?? true,
        update: generatorOptionsParam.update ?? true,
        delete: generatorOptionsParam.delete ?? true,
        list: generatorOptionsParam.list ?? true,
    };

    const generatedFiles: GeneratedFile[] = [];

    const { fileNameSingular, fileNamePlural, instanceNamePlural } = buildNameVariants(metadata);
    const { hasFilterArg, hasSortArg, argsFileName } = buildOptions(metadata);
    if (!generatorOptions.requiredPermission) generatorOptions.requiredPermission = [instanceNamePlural];

    async function generateCrudResolver(): Promise<GeneratedFile[]> {
        if (hasFilterArg) {
            generatedFiles.push({
                name: `dto/${fileNameSingular}.filter.ts`,
                content: generateFilterDto({ generatorOptions, metadata }),
                type: "filter",
            });
        }
        if (hasSortArg) {
            generatedFiles.push({
                name: `dto/${fileNameSingular}.sort.ts`,
                content: generateSortDto({ generatorOptions, metadata }),
                type: "sort",
            });
        }
        generatedFiles.push({
            name: `dto/paginated-${fileNamePlural}.ts`,
            content: generatePaginatedDto({ generatorOptions, metadata }),
            type: "sort",
        });
        generatedFiles.push({
            name: `dto/${argsFileName}.ts`,
            content: generateArgsDto({ generatorOptions, metadata }),
            type: "args",
        });
        generatedFiles.push({
            name: `${fileNamePlural}.service.ts`,
            content: generateService({ generatorOptions, metadata }),
            type: "service",
        });
        generatedFiles.push({
            name: `${fileNameSingular}.resolver.ts`,
            content: generateResolver({ generatorOptions, metadata }),
            type: "resolver",
        });

        metadata.props
            .filter((prop) => {
                if (prop.reference === "1:m" && prop.orphanRemoval) {
                    if (!prop.targetMeta) throw new Error(`Target metadata not set`);
                    const hasOwnCrudGenerator = Reflect.getMetadata(`data:crudGeneratorOptions`, prop.targetMeta.class);
                    if (!hasOwnCrudGenerator) {
                        //generate nested resolver only if target entity has no own crud generator
                        return true;
                    }
                }
            })
            .forEach((prop) => {
                if (!prop.targetMeta) throw new Error(`Target metadata not set`);
                const { fileNameSingular } = buildNameVariants(prop.targetMeta);
                const content = generateNestedEntityResolver({ generatorOptions, metadata: prop.targetMeta });

                //can be null if no relations exist
                if (content) {
                    generatedFiles.push({
                        name: `${fileNameSingular}.resolver.ts`,
                        content,
                        type: "resolver",
                    });
                }
            });

        return generatedFiles;
    }

    const crudInput = await generateCrudInput(generatorOptions, metadata);
    const crudResolver = await generateCrudResolver();

    return generatorOptions.create || generatorOptions.update ? [...crudInput, ...crudResolver] : [...crudResolver];
}
