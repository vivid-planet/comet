"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOptions = buildOptions;
exports.generateCrud = generateCrud;
/* eslint-disable @typescript-eslint/no-explicit-any */
var cms_api_1 = require("@comet/cms-api");
var postgresql_1 = require("@mikro-orm/postgresql");
var path = require("path");
var pluralize_1 = require("pluralize");
var generate_crud_input_1 = require("../generateCrudInput/generate-crud-input");
var build_name_variants_1 = require("../utils/build-name-variants");
var constants_1 = require("../utils/constants");
var generate_imports_code_1 = require("../utils/generate-imports-code");
var ts_morph_helper_1 = require("../utils/ts-morph-helper");
// TODO move into own file
function buildOptions(metadata, generatorOptions) {
    var _a, _b;
    var _c = (0, build_name_variants_1.buildNameVariants)(metadata), classNameSingular = _c.classNameSingular, classNamePlural = _c.classNamePlural, fileNameSingular = _c.fileNameSingular, fileNamePlural = _c.fileNamePlural;
    var dedicatedResolverArgProps = metadata.props.filter(function (prop) {
        if ((0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "dedicatedResolverArg")) {
            if (prop.kind == "m:1") {
                return true;
            }
            else {
                console.warn("".concat(metadata.className, " ").concat(prop.name, " can't use dedicatedResolverArg as it's not a m:1 relation"));
                return false;
            }
        }
        return false;
    });
    var crudSearchPropNames = (0, cms_api_1.getCrudSearchFieldsFromMetadata)(metadata);
    var hasSearchArg = crudSearchPropNames.length > 0;
    var crudFilterProps = metadata.props.filter(function (prop) {
        return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "filter") &&
            !prop.name.startsWith("scope_") &&
            prop.name != "position" &&
            (!prop.embedded || (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.embedded[0], "filter")) && // the whole embeddable has filter disabled
            (prop.enum ||
                prop.type === "string" ||
                prop.type === "text" ||
                prop.type === "DecimalType" ||
                prop.type === "number" ||
                constants_1.integerTypes.includes(prop.type) ||
                prop.type === "BooleanType" ||
                prop.type === "boolean" ||
                prop.type === "DateType" ||
                prop.type === "Date" ||
                prop.kind === "m:1" ||
                prop.kind === "1:m" ||
                prop.kind === "m:n" ||
                prop.type === "EnumArrayType" ||
                prop.type === "uuid") &&
            !dedicatedResolverArgProps.some(function (dedicatedResolverArgProp) { return dedicatedResolverArgProp.name == prop.name; });
    });
    var hasFilterArg = crudFilterProps.length > 0;
    var crudSortProps = metadata.props.filter(function (prop) {
        return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "sort") &&
            !prop.name.startsWith("scope_") &&
            (!prop.embedded || (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.embedded[0], "sort")) && // the whole embeddable has sort disabled
            (prop.type === "string" ||
                prop.type === "text" ||
                prop.type === "DecimalType" ||
                prop.type === "number" ||
                constants_1.integerTypes.includes(prop.type) ||
                prop.type === "BooleanType" ||
                prop.type === "boolean" ||
                prop.type === "DateType" ||
                prop.type === "Date" ||
                prop.kind === "m:1" ||
                prop.type === "EnumArrayType" ||
                prop.enum);
    });
    var hasSortArg = crudSortProps.length > 0;
    var hasSlugProp = metadata.props.some(function (prop) { return prop.name == "slug"; });
    var scopeProp = metadata.props.find(function (prop) { return prop.name == "scope"; });
    if (scopeProp && !scopeProp.targetMeta)
        throw new Error("Scope prop has no targetMeta");
    var hasPositionProp = metadata.props.some(function (prop) { return prop.name == "position"; });
    var positionGroupPropNames = hasPositionProp
        ? ((_b = (_a = generatorOptions.position) === null || _a === void 0 ? void 0 : _a.groupByFields) !== null && _b !== void 0 ? _b : __spreadArray([], (scopeProp ? [scopeProp.name] : []), true))
        : [];
    var positionGroupProps = hasPositionProp ? metadata.props.filter(function (prop) { return positionGroupPropNames.includes(prop.name); }) : [];
    var scopedEntity = Reflect.getMetadata(cms_api_1.SCOPED_ENTITY_METADATA_KEY, metadata.class);
    var skipScopeCheck = !scopeProp && !scopedEntity;
    var argsClassName = "".concat(classNameSingular != classNamePlural ? classNamePlural : "".concat(classNamePlural, "List"), "Args");
    var argsFileName = "".concat(fileNameSingular != fileNamePlural ? fileNamePlural : "".concat(fileNameSingular, "-list"), ".args");
    var blockProps = metadata.props.filter(function (prop) {
        return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "input") && prop.type === "RootBlockType";
    });
    return {
        crudSearchPropNames: crudSearchPropNames,
        hasSearchArg: hasSearchArg,
        crudFilterProps: crudFilterProps,
        hasFilterArg: hasFilterArg,
        crudSortProps: crudSortProps,
        hasSortArg: hasSortArg,
        hasSlugProp: hasSlugProp,
        hasPositionProp: hasPositionProp,
        positionGroupProps: positionGroupProps,
        scopeProp: scopeProp,
        skipScopeCheck: skipScopeCheck,
        argsClassName: argsClassName,
        argsFileName: argsFileName,
        blockProps: blockProps,
        dedicatedResolverArgProps: dedicatedResolverArgProps,
    };
}
function generateFilterDto(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var classNameSingular = (0, build_name_variants_1.buildNameVariants)(metadata).classNameSingular;
    var crudFilterProps = buildOptions(metadata, generatorOptions).crudFilterProps;
    var imports = [];
    var enumFiltersOut = "";
    var generatedEnumNames = new Set();
    var generatedEnumsNames = new Set();
    crudFilterProps.map(function (prop) {
        if (prop.type == "EnumArrayType") {
            var enumName = (0, ts_morph_helper_1.findEnumName)(prop.name, metadata);
            var importPath = (0, ts_morph_helper_1.findEnumImportPath)(enumName, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
            if (!generatedEnumNames.has(enumName)) {
                generatedEnumNames.add(enumName);
                enumFiltersOut += "@InputType()\n                    class ".concat(enumName, "EnumsFilter extends createEnumsFilter(").concat(enumName, ") {}\n                ");
                imports.push({ name: enumName, importPath: importPath });
            }
        }
        else if (prop.enum) {
            var enumName = (0, ts_morph_helper_1.findEnumName)(prop.name, metadata);
            var importPath = (0, ts_morph_helper_1.findEnumImportPath)(enumName, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
            if (!generatedEnumsNames.has(enumName)) {
                generatedEnumsNames.add(enumName);
                enumFiltersOut += "@InputType()\n                    class ".concat(enumName, "EnumFilter extends createEnumFilter(").concat(enumName, ") {}\n                ");
                imports.push({ name: enumName, importPath: importPath });
            }
        }
    });
    var filterOut = "import { StringFilter, NumberFilter, BooleanFilter, DateFilter, DateTimeFilter, ManyToOneFilter, OneToManyFilter, ManyToManyFilter, IdFilter, createEnumFilter, createEnumsFilter } from \"@comet/cms-api\";\n    import { Field, InputType } from \"@nestjs/graphql\";\n    import { Type } from \"class-transformer\";\n    import { IsNumber, IsOptional, IsString, ValidateNested } from \"class-validator\";\n    ".concat((0, generate_imports_code_1.generateImportsCode)(imports), "\n\n    ").concat(enumFiltersOut, "\n\n    @InputType()\n    export class ").concat(classNameSingular, "Filter {\n        ").concat(crudFilterProps
        .map(function (prop) {
        if (prop.type == "EnumArrayType") {
            var enumName = (0, ts_morph_helper_1.findEnumName)(prop.name, metadata);
            return "@Field(() => ".concat(enumName, "EnumsFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => ").concat(enumName, "EnumsFilter)\n                    ").concat(prop.name, "?: ").concat(enumName, "EnumsFilter;\n                    ");
        }
        else if (prop.enum) {
            var enumName = (0, ts_morph_helper_1.findEnumName)(prop.name, metadata);
            return "@Field(() => ".concat(enumName, "EnumFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => ").concat(enumName, "EnumFilter)\n                    ").concat(prop.name, "?: ").concat(enumName, "EnumFilter;\n                    ");
        }
        else if (prop.type === "string" || prop.type === "text") {
            return "@Field(() => StringFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => StringFilter)\n                    ".concat(prop.name, "?: StringFilter;\n                    ");
        }
        else if (prop.type === "DecimalType" || prop.type == "number" || constants_1.integerTypes.includes(prop.type)) {
            return "@Field(() => NumberFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => NumberFilter)\n                    ".concat(prop.name, "?: NumberFilter;\n                    ");
        }
        else if (prop.type === "boolean" || prop.type === "BooleanType") {
            return "@Field(() => BooleanFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => BooleanFilter)\n                    ".concat(prop.name, "?: BooleanFilter;\n                    ");
        }
        else if (prop.type === "DateType") {
            // ISO Date without time
            return "@Field(() => DateFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => DateFilter)\n                    ".concat(prop.name, "?: DateFilter;\n                    ");
        }
        else if (prop.type === "Date") {
            // DateTime
            return "@Field(() => DateTimeFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => DateTimeFilter)\n                    ".concat(prop.name, "?: DateTimeFilter;\n                    ");
        }
        else if (prop.kind === "m:1") {
            return "@Field(() => ManyToOneFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => ManyToOneFilter)\n                    ".concat(prop.name, "?: ManyToOneFilter;\n                    ");
        }
        else if (prop.kind === "1:m") {
            return "@Field(() => OneToManyFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => OneToManyFilter)\n                    ".concat(prop.name, "?: OneToManyFilter;\n                    ");
        }
        else if (prop.kind === "m:n") {
            return "@Field(() => ManyToManyFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => ManyToManyFilter)\n                    ".concat(prop.name, "?: ManyToManyFilter;\n                    ");
        }
        else if (prop.type == "uuid") {
            return "@Field(() => IdFilter, { nullable: true })\n                    @ValidateNested()\n                    @IsOptional()\n                    @Type(() => IdFilter)\n                    ".concat(prop.name, "?: IdFilter;\n                    ");
        }
        else {
            //unsupported type TODO support more
        }
        return "";
    })
        .join("\n"), "\n\n        @Field(() => [").concat(classNameSingular, "Filter], { nullable: true })\n        @Type(() => ").concat(classNameSingular, "Filter)\n        @ValidateNested({ each: true })\n        @IsOptional()\n        and?: ").concat(classNameSingular, "Filter[];\n\n        @Field(() => [").concat(classNameSingular, "Filter], { nullable: true })\n        @Type(() => ").concat(classNameSingular, "Filter)\n        @ValidateNested({ each: true })\n        @IsOptional()\n        or?: ").concat(classNameSingular, "Filter[];\n    }\n    ");
    return filterOut;
}
function generateSortDto(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var classNameSingular = (0, build_name_variants_1.buildNameVariants)(metadata).classNameSingular;
    var crudSortProps = buildOptions(metadata, generatorOptions).crudSortProps;
    var sortOut = "import { SortDirection } from \"@comet/cms-api\";\n    import { Field, InputType, registerEnumType } from \"@nestjs/graphql\";\n    import { Type } from \"class-transformer\";\n    import { IsEnum } from \"class-validator\";\n\n    export enum ".concat(classNameSingular, "SortField {\n        ").concat(crudSortProps
        .map(function (prop) {
        return "".concat(prop.name, " = \"").concat(prop.name, "\",");
    })
        .join("\n"), "\n    }\n    registerEnumType(").concat(classNameSingular, "SortField, {\n        name: \"").concat(classNameSingular, "SortField\",\n    });\n    \n    @InputType()\n    export class ").concat(classNameSingular, "Sort {\n        @Field(() => ").concat(classNameSingular, "SortField)\n        @IsEnum(").concat(classNameSingular, "SortField)\n        field: ").concat(classNameSingular, "SortField;\n    \n        @Field(() => SortDirection, { defaultValue: SortDirection.ASC })\n        @IsEnum(SortDirection)\n        direction: SortDirection = SortDirection.ASC;\n    }\n    ");
    return sortOut;
}
function generatePaginatedDto(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var classNamePlural = (0, build_name_variants_1.buildNameVariants)(metadata).classNamePlural;
    var paginatedOut = "import { ObjectType } from \"@nestjs/graphql\";\n    import { PaginatedResponseFactory } from \"@comet/cms-api\";\n\n    import { ".concat(metadata.className, " } from \"").concat(path.relative("".concat(generatorOptions.targetDirectory, "/dto"), metadata.path).replace(/\.ts$/, ""), "\";\n\n    @ObjectType()\n    export class Paginated").concat(classNamePlural, " extends PaginatedResponseFactory.create(").concat(metadata.className, ") {}\n    ");
    return paginatedOut;
}
function generateArgsDto(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var _b = (0, build_name_variants_1.buildNameVariants)(metadata), classNameSingular = _b.classNameSingular, fileNameSingular = _b.fileNameSingular;
    var _c = buildOptions(metadata, generatorOptions), scopeProp = _c.scopeProp, argsClassName = _c.argsClassName, hasSearchArg = _c.hasSearchArg, hasSortArg = _c.hasSortArg, hasFilterArg = _c.hasFilterArg, dedicatedResolverArgProps = _c.dedicatedResolverArgProps;
    var imports = [];
    if (scopeProp && scopeProp.targetMeta) {
        imports.push(generateEntityImport(scopeProp.targetMeta, "".concat(generatorOptions.targetDirectory, "/dto")));
    }
    var argsOut = "import { ArgsType, Field, IntersectionType, registerEnumType, ID } from \"@nestjs/graphql\";\n    import { Type } from \"class-transformer\";\n    import { IsOptional, IsString, ValidateNested, IsEnum, IsUUID } from \"class-validator\";\n    import { OffsetBasedPaginationArgs } from \"@comet/cms-api\";\n    import { ".concat(classNameSingular, "Filter } from \"./").concat(fileNameSingular, ".filter\";\n    import { ").concat(classNameSingular, "Sort } from \"./").concat(fileNameSingular, ".sort\";\n\n    ").concat((0, generate_imports_code_1.generateImportsCode)(imports), "\n\n    @ArgsType()\n    export class ").concat(argsClassName, " extends OffsetBasedPaginationArgs {\n        ").concat(scopeProp
        ? "\n        @Field(() => ".concat(scopeProp.type, ")\n        @ValidateNested()\n        @Type(() => ").concat(scopeProp.type, ")\n        scope: ").concat(scopeProp.type, ";\n        ")
        : "", "\n\n        ").concat(dedicatedResolverArgProps
        .map(function (dedicatedResolverArgProp) {
        if (constants_1.integerTypes.includes(dedicatedResolverArgProp.type)) {
            return "@Field(() => ID)\n                    @Transform(({ value }) => value.map((id: string) => parseInt(id)))\n                    @IsInt()\n                    ".concat(dedicatedResolverArgProp.name, ": number;");
        }
        else {
            return "@Field(() => ID)\n                    @IsUUID()\n                    ".concat(dedicatedResolverArgProp.name, ": string;");
        }
    })
        .join(""), "\n\n        ").concat(hasSearchArg
        ? "\n        @Field({ nullable: true })\n        @IsOptional()\n        @IsString()\n        search?: string;\n        "
        : "", "\n\n        ").concat(hasFilterArg
        ? "\n        @Field(() => ".concat(classNameSingular, "Filter, { nullable: true })\n        @ValidateNested()\n        @Type(() => ").concat(classNameSingular, "Filter)\n        @IsOptional()\n        filter?: ").concat(classNameSingular, "Filter;\n        ")
        : "", "\n\n        ").concat(hasSortArg
        ? "\n        @Field(() => [".concat(classNameSingular, "Sort], { nullable: true })\n        @ValidateNested({ each: true })\n        @Type(() => ").concat(classNameSingular, "Sort)\n        @IsOptional()\n        sort?: ").concat(classNameSingular, "Sort[];\n        ")
        : "", "\n    }\n    ");
    return argsOut;
}
function generateService(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var _b = (0, build_name_variants_1.buildNameVariants)(metadata), classNameSingular = _b.classNameSingular, fileNameSingular = _b.fileNameSingular, classNamePlural = _b.classNamePlural;
    var _c = buildOptions(metadata, generatorOptions), hasPositionProp = _c.hasPositionProp, positionGroupProps = _c.positionGroupProps;
    var positionGroupType = positionGroupProps.length
        ? "{ ".concat(positionGroupProps
            .map(function (prop) {
            var notSupportedReferenceKinds = [postgresql_1.ReferenceKind.ONE_TO_MANY, postgresql_1.ReferenceKind.MANY_TO_MANY];
            if (notSupportedReferenceKinds.includes(prop.kind)) {
                throw new Error("Not supported reference-type for position-group. ".concat(prop.name));
            }
            return "".concat(prop.name).concat(prop.nullable ? "?" : "", ": ").concat([postgresql_1.ReferenceKind.MANY_TO_ONE, postgresql_1.ReferenceKind.ONE_TO_ONE].includes(prop.kind) ? "string" : prop.type);
        })
            .join(","), " }")
        : false;
    var serviceOut = "import { EntityManager, FilterQuery, raw } from \"@mikro-orm/postgresql\";\n    import { Injectable } from \"@nestjs/common\";\n\n    ".concat((0, generate_imports_code_1.generateImportsCode)([generateEntityImport(metadata, generatorOptions.targetDirectory)]), "\n    ").concat((0, generate_imports_code_1.generateImportsCode)(positionGroupProps.reduce(function (acc, prop) {
        if (prop.targetMeta) {
            acc.push(generateEntityImport(prop.targetMeta, generatorOptions.targetDirectory));
        }
        return acc;
    }, [])), "\n    import { ").concat(classNameSingular, "Filter } from \"./dto/").concat(fileNameSingular, ".filter\";\n\n    @Injectable()\n    export class ").concat(classNamePlural, "Service {    \n        ").concat(hasPositionProp
        ? "constructor(\n                    protected readonly entityManager: EntityManager,\n                ) {}"
        : "", "\n\n        ").concat(hasPositionProp
        ? "\n                async incrementPositions(".concat(positionGroupProps.length ? "group: ".concat(positionGroupType, ",") : "", "lowestPosition: number, highestPosition?: number) {\n                    // Increment positions between newPosition (inclusive) and oldPosition (exclusive)\n                    await this.entityManager.nativeUpdate(").concat(metadata.className, ",\n                    ").concat(positionGroupProps.length
            ? "{\n                            $and: [\n                                { position: { $gte: lowestPosition, ...(highestPosition ? { $lt: highestPosition } : {}) } },\n                                this.getPositionGroupCondition(group),\n                            ],\n                        },"
            : "{ position: { $gte: lowestPosition, ...(highestPosition ? { $lt: highestPosition } : {}) } },", "\n                        { position: raw(\"position + 1\") },\n                    );\n                }\n\n                async decrementPositions(").concat(positionGroupProps.length ? "group: ".concat(positionGroupType, ",") : "", "lowestPosition: number, highestPosition?: number) {\n                    // Decrement positions between oldPosition (exclusive) and newPosition (inclusive)\n                    await this.entityManager.nativeUpdate(").concat(metadata.className, ",\n                    ").concat(positionGroupProps.length
            ? "{\n                            $and: [\n                                { position: { $gt: lowestPosition, ...(highestPosition ? { $lte: highestPosition } : {}) } },\n                                this.getPositionGroupCondition(group),\n                            ],\n                        },"
            : "{ position: { $gt: lowestPosition, ...(highestPosition ? { $lte: highestPosition } : {}) } },", "\n                        { position: raw(\"position - 1\") },\n                    );\n                }\n\n                async getLastPosition(").concat(positionGroupProps.length ? "group: ".concat(positionGroupType) : "", ") {\n                    return this.entityManager.count(").concat(metadata.className, ", ").concat(positionGroupProps.length ? "this.getPositionGroupCondition(group)" : "{}", ");\n                }\n\n                ").concat(positionGroupProps.length
            ? "getPositionGroupCondition(group: ".concat(positionGroupType, "): FilterQuery<").concat(metadata.className, "> {\n                    return {\n                        ").concat(positionGroupProps.map(function (field) { return "".concat(field.name, ": { $eq: group.").concat(field.name, " }"); }).join(","), "\n                    };\n                }")
            : "", "\n                ")
        : "", "\n    }\n    ");
    return serviceOut;
}
function generateEntityImport(targetMetadata, relativeTo) {
    return {
        name: targetMetadata.className,
        importPath: path.relative(relativeTo, targetMetadata.path).replace(/\.ts$/, ""),
    };
}
function generateInputHandling(options, metadata, generatorOptions) {
    var instanceNameSingular = (0, build_name_variants_1.buildNameVariants)(metadata).instanceNameSingular;
    var _a = buildOptions(metadata, generatorOptions), blockProps = _a.blockProps, scopeProp = _a.scopeProp, hasPositionProp = _a.hasPositionProp, dedicatedResolverArgProps = _a.dedicatedResolverArgProps;
    var props = metadata.props.filter(function (prop) { return !options.excludeFields || !options.excludeFields.includes(prop.name); });
    var relationManyToOneProps = props.filter(function (prop) { return prop.kind === "m:1"; });
    var relationOneToManyProps = props.filter(function (prop) { return prop.kind === "1:m"; });
    var relationManyToManyProps = props.filter(function (prop) { return prop.kind === "m:n"; });
    var relationOneToOneProps = props.filter(function (prop) { return prop.kind === "1:1"; });
    var inputRelationManyToOneProps = relationManyToOneProps
        .filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "input"); })
        .filter(function (prop) {
        //filter out props that are dedicatedResolverArgProp
        return !dedicatedResolverArgProps.some(function (dedicatedResolverArgProp) { return dedicatedResolverArgProp.name === prop.name; });
    })
        .map(function (prop) {
        var targetMeta = prop.targetMeta;
        if (!targetMeta)
            throw new Error("targetMeta is not set for relation");
        return {
            name: prop.name,
            singularName: (0, pluralize_1.singular)(prop.name),
            nullable: prop.nullable,
            type: prop.type,
        };
    });
    var inputRelationOneToOneProps = relationOneToOneProps
        .filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "input"); })
        .map(function (prop) {
        var targetMeta = prop.targetMeta;
        if (!targetMeta)
            throw new Error("targetMeta is not set for relation");
        return {
            name: prop.name,
            singularName: (0, pluralize_1.singular)(prop.name),
            nullable: prop.nullable,
            type: prop.type,
            targetMeta: targetMeta,
        };
    });
    var inputRelationToManyProps = __spreadArray(__spreadArray([], relationOneToManyProps, true), relationManyToManyProps, true).filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "input"); })
        .map(function (prop) {
        var targetMeta = prop.targetMeta;
        if (!targetMeta)
            throw new Error("targetMeta is not set for relation");
        return {
            name: prop.name,
            singularName: (0, pluralize_1.singular)(prop.name),
            nullable: prop.nullable,
            type: prop.type,
            orphanRemoval: prop.orphanRemoval,
            targetMeta: targetMeta,
        };
    });
    function innerGenerateInputHandling() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var ret = generateInputHandling.apply(void 0, args);
        return ret.code;
    }
    var noAssignProps = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], inputRelationToManyProps, true), inputRelationManyToOneProps, true), inputRelationOneToOneProps, true), blockProps, true);
    var code = "\n    ".concat(noAssignProps.length
        ? "const { ".concat(noAssignProps.map(function (prop) { return "".concat(prop.name, ": ").concat(prop.name, "Input"); }).join(", "), ", ...assignInput } = ").concat(options.inputName, ";")
        : "", "\n    ").concat(options.assignEntityCode, "\n    ...").concat(noAssignProps.length ? "assignInput" : options.inputName, ",\n        ").concat(options.mode == "create" && scopeProp ? "scope," : "").concat(options.mode == "create" && hasPositionProp ? "position," : "", "\n        ").concat(options.mode == "create"
        ? dedicatedResolverArgProps
            .map(function (dedicatedResolverArgProp) {
            return "".concat(dedicatedResolverArgProp.name, ": Reference.create(await this.entityManager.findOneOrFail(").concat(dedicatedResolverArgProp.type, ", ").concat(dedicatedResolverArgProp.name, ")), ");
        })
            .join("")
        : "", "\n        ").concat(options.mode == "create" || options.mode == "updateNested"
        ? inputRelationManyToOneProps
            .map(function (prop) {
            return "".concat(prop.name, ": ").concat(prop.nullable ? "".concat(prop.name, "Input ? ") : "", "Reference.create(await this.entityManager.findOneOrFail(").concat(prop.type, ", ").concat(prop.name, "Input))").concat(prop.nullable ? " : undefined" : "", ", ");
        })
            .join("")
        : "", "\n        ").concat(options.mode == "create" || options.mode == "updateNested"
        ? blockProps.map(function (prop) { return "".concat(prop.name, ": ").concat(prop.name, "Input.transformToBlockData(),"); }).join("")
        : "", "\n});\n").concat(inputRelationToManyProps
        .map(function (prop) {
        if (prop.orphanRemoval) {
            var code_1 = innerGenerateInputHandling({
                mode: "updateNested",
                inputName: "".concat(prop.singularName, "Input"),
                // alternative `return this.entityManager.create(${prop.type}, {` requires back relation to be set
                assignEntityCode: "return this.entityManager.assign(new ".concat(prop.type, "(), {"),
                excludeFields: prop.targetMeta.props
                    .filter(function (prop) { return prop.kind == "m:1" && prop.targetMeta == metadata; }) //filter out referencing back to this entity
                    .map(function (prop) { return prop.name; }),
            }, prop.targetMeta, generatorOptions);
            var isAsync = code_1.includes("await ");
            return "if (".concat(prop.name, "Input) {\n        await ").concat(instanceNameSingular, ".").concat(prop.name, ".loadItems();\n        ").concat(instanceNameSingular, ".").concat(prop.name, ".set(\n            ").concat(isAsync ? "await Promise.all(" : "", "\n            ").concat(prop.name, "Input.map(").concat(isAsync ? "async " : "", "(").concat(prop.singularName, "Input) => {\n                ").concat(code_1, "\n            })\n            ").concat(isAsync ? ")" : "", "\n        );\n        }");
        }
        else {
            return "\n            if (".concat(prop.name, "Input) {\n                const ").concat(prop.name, " = await this.entityManager.find(").concat(prop.type, ", { id: ").concat(prop.name, "Input });\n                if (").concat(prop.name, ".length != ").concat(prop.name, "Input.length) throw new Error(\"Couldn't find all ").concat(prop.name, " that were passed as input\");\n                await ").concat(instanceNameSingular, ".").concat(prop.name, ".loadItems();\n                ").concat(instanceNameSingular, ".").concat(prop.name, ".set(").concat(prop.name, ".map((").concat(prop.singularName, ") => Reference.create(").concat(prop.singularName, ")));\n            }");
        }
    })
        .join(""), "\n\n").concat(inputRelationOneToOneProps
        .map(function (prop) { return "\n            ".concat(options.mode != "create" || prop.nullable ? "if (".concat(prop.name, "Input) {") : "{", "\n                const ").concat(prop.singularName, " = ").concat((options.mode == "update" || options.mode == "updateNested") && prop.nullable
        ? "".concat(instanceNameSingular, ".").concat(prop.name, " ? await ").concat(instanceNameSingular, ".").concat(prop.name, ".loadOrFail() : new ").concat(prop.type, "();")
        : "new ".concat(prop.type, "();"), "\n                ").concat(innerGenerateInputHandling({
        mode: "updateNested",
        inputName: "".concat(prop.name, "Input"),
        assignEntityCode: "this.entityManager.assign(".concat(prop.singularName, ", {"),
        excludeFields: prop.targetMeta.props
            .filter(function (prop) { return prop.kind == "1:1" && prop.targetMeta == metadata; }) //filter out referencing back to this entity
            .map(function (prop) { return prop.name; }),
    }, prop.targetMeta, generatorOptions), "\n                ").concat(options.mode != "create" || prop.nullable ? "}" : "}"); })
        .join(""), "\n").concat(options.mode == "update"
        ? inputRelationManyToOneProps
            .map(function (prop) { return "if (".concat(prop.name, "Input !== undefined) {\n                        ").concat(instanceNameSingular, ".").concat(prop.name, " =\n                            ").concat(prop.nullable ? "".concat(prop.name, "Input ? ") : "", "\n                            Reference.create(await this.entityManager.findOneOrFail(").concat(prop.type, ", ").concat(prop.name, "Input))\n                            ").concat(prop.nullable ? " : undefined" : "", ";\n                        }"); })
            .join("")
        : "", "\n").concat(options.mode == "update"
        ? blockProps
            .map(function (prop) { return "\n                    if (".concat(prop.name, "Input) {\n                        ").concat(instanceNameSingular, ".").concat(prop.name, " = ").concat(prop.name, "Input.transformToBlockData();\n                    }"); })
            .join("")
        : "", "\n    ");
    return { code: code };
}
function generateNestedEntityResolver(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var classNameSingular = (0, build_name_variants_1.buildNameVariants)(metadata).classNameSingular;
    var skipScopeCheck = buildOptions(metadata, generatorOptions).skipScopeCheck;
    var imports = [];
    var _b = generateRelationsFieldResolver({ generatorOptions: generatorOptions, metadata: metadata }), fieldImports = _b.imports, code = _b.code, hasOutputRelations = _b.hasOutputRelations, needsBlocksTransformer = _b.needsBlocksTransformer;
    if (!hasOutputRelations)
        return null;
    imports.push.apply(imports, fieldImports);
    imports.push(generateEntityImport(metadata, generatorOptions.targetDirectory));
    return "\n    import { RequiredPermission, RootBlockDataScalar, BlocksTransformerService } from \"@comet/cms-api\";\n    import { Args, ID, Info, Mutation, Query, Resolver, ResolveField, Parent } from \"@nestjs/graphql\";\n    ".concat((0, generate_imports_code_1.generateImportsCode)(imports), "\n\n    @Resolver(() => ").concat(metadata.className, ")\n    @RequiredPermission(").concat(JSON.stringify(generatorOptions.requiredPermission)).concat(skipScopeCheck ? ", { skipScopeCheck: true }" : "", ")\n    export class ").concat(classNameSingular, "Resolver {\n        ").concat(needsBlocksTransformer ? "constructor(protected readonly blocksTransformer: BlocksTransformerService) {}" : "", "\n        ").concat(code, "\n    }\n    ");
}
function generateRelationsFieldResolver(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var instanceNameSingular = (0, build_name_variants_1.buildNameVariants)(metadata).instanceNameSingular;
    var relationManyToOneProps = metadata.props.filter(function (prop) { return prop.kind === "m:1"; });
    var relationOneToManyProps = metadata.props.filter(function (prop) { return prop.kind === "1:m"; });
    var relationManyToManyProps = metadata.props.filter(function (prop) { return prop.kind === "m:n"; });
    var relationOneToOneProps = metadata.props.filter(function (prop) { return prop.kind === "1:1"; });
    var outputRelationManyToOneProps = relationManyToOneProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    var outputRelationOneToManyProps = relationOneToManyProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    var outputRelationManyToManyProps = relationManyToManyProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    var outputRelationOneToOneProps = relationOneToOneProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    for (var _i = 0, _b = metadata.props; _i < _b.length; _i++) {
        var prop = _b[_i];
        if (!(0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField") &&
            !relationManyToOneProps.includes(prop) &&
            !relationOneToManyProps.includes(prop) &&
            !relationManyToManyProps.includes(prop) &&
            !relationOneToOneProps.includes(prop)) {
            throw new Error("".concat(prop.name, ": @CrudField resolveField=false is only used for relations, for other props simply remove @Field() to disable its output"));
        }
    }
    var resolveFieldBlockProps = metadata.props.filter(function (prop) {
        return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField") && prop.type === "RootBlockType";
    });
    var hasOutputRelations = outputRelationManyToOneProps.length > 0 ||
        outputRelationOneToManyProps.length > 0 ||
        outputRelationManyToManyProps.length > 0 ||
        outputRelationOneToOneProps.length > 0;
    var imports = [];
    for (var _c = 0, _d = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], relationManyToOneProps, true), relationOneToManyProps, true), relationManyToManyProps, true), relationOneToOneProps, true); _c < _d.length; _c++) {
        var prop = _d[_c];
        if (!prop.targetMeta)
            throw new Error("Relation ".concat(prop.name, " has targetMeta not set"));
        imports.push(generateEntityImport(prop.targetMeta, generatorOptions.targetDirectory));
    }
    for (var _e = 0, resolveFieldBlockProps_1 = resolveFieldBlockProps; _e < resolveFieldBlockProps_1.length; _e++) {
        var prop = resolveFieldBlockProps_1[_e];
        var blockName = (0, ts_morph_helper_1.findBlockName)(prop.name, metadata);
        var importPath = (0, ts_morph_helper_1.findBlockImportPath)(blockName, "".concat(generatorOptions.targetDirectory), metadata);
        imports.push({ name: blockName, importPath: importPath });
    }
    var code = "\n    ".concat(outputRelationManyToOneProps
        .map(function (prop) { return "\n        @ResolveField(() => ".concat(prop.type).concat(prop.nullable ? ", { nullable: true }" : "", ")\n        async ").concat(prop.name, "(@Parent() ").concat(instanceNameSingular, ": ").concat(metadata.className, "): Promise<").concat(prop.type).concat(prop.nullable ? " | undefined" : "", "> {\n            return ").concat(instanceNameSingular, ".").concat(prop.name).concat(prop.nullable ? "?" : "", ".loadOrFail();\n        }    \n    "); })
        .join("\n"), "\n\n    ").concat(outputRelationOneToManyProps
        .map(function (prop) { return "\n        @ResolveField(() => [".concat(prop.type, "])\n        async ").concat(prop.name, "(@Parent() ").concat(instanceNameSingular, ": ").concat(metadata.className, "): Promise<").concat(prop.type, "[]> {\n            return ").concat(instanceNameSingular, ".").concat(prop.name, ".loadItems();\n        }   \n    "); })
        .join("\n"), "\n\n    ").concat(outputRelationManyToManyProps
        .map(function (prop) { return "\n        @ResolveField(() => [".concat(prop.type, "])\n        async ").concat(prop.name, "(@Parent() ").concat(instanceNameSingular, ": ").concat(metadata.className, "): Promise<").concat(prop.type, "[]> {\n            return ").concat(instanceNameSingular, ".").concat(prop.name, ".loadItems();\n        }\n    "); })
        .join("\n"), "\n\n    ").concat(outputRelationOneToOneProps
        .map(function (prop) { return "\n        @ResolveField(() => ".concat(prop.type).concat(prop.nullable ? ", { nullable: true }" : "", ")\n        async ").concat(prop.name, "(@Parent() ").concat(instanceNameSingular, ": ").concat(metadata.className, "): Promise<").concat(prop.type).concat(prop.nullable ? " | undefined" : "", "> {\n            return ").concat(instanceNameSingular, ".").concat(prop.name).concat(prop.nullable ? "?" : "", ".loadOrFail();\n        }\n    "); })
        .join("\n"), "\n\n        ").concat(resolveFieldBlockProps
        .map(function (prop) { return "\n        @ResolveField(() => RootBlockDataScalar(".concat((0, ts_morph_helper_1.findBlockName)(prop.name, metadata), "))\n        async ").concat(prop.name, "(@Parent() ").concat(instanceNameSingular, ": ").concat(metadata.className, "): Promise<object> {\n            return this.blocksTransformer.transformToPlain(").concat(instanceNameSingular, ".").concat(prop.name, ");\n        }\n        "); })
        .join("\n"), "\n\n    ").trim();
    return {
        code: code,
        imports: imports,
        hasOutputRelations: hasOutputRelations,
        needsBlocksTransformer: resolveFieldBlockProps.length > 0,
    };
}
function generateResolver(_a) {
    var generatorOptions = _a.generatorOptions, metadata = _a.metadata;
    var _b = (0, build_name_variants_1.buildNameVariants)(metadata), classNameSingular = _b.classNameSingular, fileNameSingular = _b.fileNameSingular, instanceNameSingular = _b.instanceNameSingular, classNamePlural = _b.classNamePlural, fileNamePlural = _b.fileNamePlural, instanceNamePlural = _b.instanceNamePlural;
    var _c = buildOptions(metadata, generatorOptions), scopeProp = _c.scopeProp, skipScopeCheck = _c.skipScopeCheck, argsClassName = _c.argsClassName, argsFileName = _c.argsFileName, hasSlugProp = _c.hasSlugProp, hasSearchArg = _c.hasSearchArg, hasSortArg = _c.hasSortArg, hasFilterArg = _c.hasFilterArg, hasPositionProp = _c.hasPositionProp, positionGroupProps = _c.positionGroupProps, dedicatedResolverArgProps = _c.dedicatedResolverArgProps;
    var relationManyToOneProps = metadata.props.filter(function (prop) { return prop.kind === "m:1"; });
    var relationOneToManyProps = metadata.props.filter(function (prop) { return prop.kind === "1:m"; });
    var relationManyToManyProps = metadata.props.filter(function (prop) { return prop.kind === "m:n"; });
    var relationOneToOneProps = metadata.props.filter(function (prop) { return prop.kind === "1:1"; });
    var outputRelationManyToOneProps = relationManyToOneProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    var outputRelationOneToManyProps = relationOneToManyProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    var outputRelationManyToManyProps = relationManyToManyProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    var outputRelationOneToOneProps = relationOneToOneProps.filter(function (prop) { return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "resolveField"); });
    var imports = [];
    var createInputHandlingCode = generateInputHandling({
        mode: "create",
        inputName: "input",
        assignEntityCode: "const ".concat(instanceNameSingular, " = this.entityManager.create(").concat(metadata.className, ", {"),
    }, metadata, generatorOptions).code;
    var updateInputHandlingCode = generateInputHandling({ mode: "update", inputName: "input", assignEntityCode: "".concat(instanceNameSingular, ".assign({") }, metadata, generatorOptions).code;
    var _d = generateRelationsFieldResolver({
        generatorOptions: generatorOptions,
        metadata: metadata,
    }), relationsFieldResolverImports = _d.imports, relationsFieldResolverCode = _d.code, hasOutputRelations = _d.hasOutputRelations, needsBlocksTransformer = _d.needsBlocksTransformer;
    imports.push.apply(imports, relationsFieldResolverImports);
    imports.push(generateEntityImport(metadata, generatorOptions.targetDirectory));
    if (scopeProp && scopeProp.targetMeta) {
        imports.push(generateEntityImport(scopeProp.targetMeta, generatorOptions.targetDirectory));
    }
    function generateIdArg(name, metadata) {
        if (constants_1.integerTypes.includes(metadata.properties[name].type)) {
            return "@Args(\"".concat(name, "\", { type: () => ID }, { transform: (value) => parseInt(value) }) ").concat(name, ": number");
        }
        else {
            return "@Args(\"".concat(name, "\", { type: () => ID }) ").concat(name, ": string");
        }
    }
    imports.push({ name: "extractGraphqlFields", importPath: "@comet/cms-api" });
    imports.push({ name: "SortDirection", importPath: "@comet/cms-api" });
    imports.push({ name: "RequiredPermission", importPath: "@comet/cms-api" });
    imports.push({ name: "AffectedEntity", importPath: "@comet/cms-api" });
    imports.push({ name: "validateNotModified", importPath: "@comet/cms-api" });
    imports.push({ name: "RootBlockDataScalar", importPath: "@comet/cms-api" });
    imports.push({ name: "BlocksTransformerService", importPath: "@comet/cms-api" });
    imports.push({ name: "gqlArgsToMikroOrmQuery", importPath: "@comet/cms-api" });
    var resolverOut = "import { EntityManager, FindOptions, ObjectQuery, Reference } from \"@mikro-orm/postgresql\";\n    import { Args, ID, Info, Mutation, Query, Resolver, ResolveField, Parent } from \"@nestjs/graphql\";\n    import { GraphQLResolveInfo } from \"graphql\";\n\n    ".concat(hasPositionProp ? "import { ".concat(classNamePlural, "Service } from \"./").concat(fileNamePlural, ".service\";") : "", "\n    import { ").concat(classNameSingular, "Input, ").concat(classNameSingular, "UpdateInput } from \"./dto/").concat(fileNameSingular, ".input\";\n    import { Paginated").concat(classNamePlural, " } from \"./dto/paginated-").concat(fileNamePlural, "\";\n    import { ").concat(argsClassName, " } from \"./dto/").concat(argsFileName, "\";\n    ").concat((0, generate_imports_code_1.generateImportsCode)(imports), "\n\n    @Resolver(() => ").concat(metadata.className, ")\n    @RequiredPermission(").concat(JSON.stringify(generatorOptions.requiredPermission)).concat(skipScopeCheck ? ", { skipScopeCheck: true }" : "", ")\n    export class ").concat(classNameSingular, "Resolver {\n        constructor(\n            protected readonly entityManager: EntityManager,").concat(hasPositionProp ? "protected readonly ".concat(instanceNamePlural, "Service: ").concat(classNamePlural, "Service,") : "", "\n            ").concat(needsBlocksTransformer ? "private readonly blocksTransformer: BlocksTransformerService," : "", "\n        ) {}\n\n        ").concat(generatorOptions.single
        ? "\n        @Query(() => ".concat(metadata.className, ")\n        @AffectedEntity(").concat(metadata.className, ")\n        async ").concat(instanceNameSingular, "(").concat(generateIdArg("id", metadata), "): Promise<").concat(metadata.className, "> {\n            const ").concat(instanceNameSingular, " = await this.entityManager.findOneOrFail(").concat(metadata.className, ", id);\n            return ").concat(instanceNameSingular, ";\n        }\n        ")
        : "", "\n\n        ").concat(hasSlugProp
        ? "\n        @Query(() => ".concat(metadata.className, ", { nullable: true })\n        async ").concat(instanceNameSingular, "BySlug(\n            @Args(\"slug\") slug: string\n            ").concat(scopeProp ? ", @Args(\"scope\", { type: () => ".concat(scopeProp.type, " }) scope: ").concat(scopeProp.type) : "", "\n        ): Promise<").concat(metadata.className, " | null> {\n            const ").concat(instanceNameSingular, " = await this.entityManager.findOne(").concat(metadata.className, ", { slug").concat(scopeProp ? ", scope" : "", "});\n\n            return ").concat(instanceNameSingular, " ?? null;\n        }\n        ")
        : "", "\n\n        ").concat(generatorOptions.list
        ? "\n        @Query(() => Paginated".concat(classNamePlural, ")\n        ").concat(dedicatedResolverArgProps
            .map(function (dedicatedResolverArgProp) {
            var _a;
            return "@AffectedEntity(".concat((_a = dedicatedResolverArgProp.targetMeta) === null || _a === void 0 ? void 0 : _a.className, ", { idArg: \"").concat(dedicatedResolverArgProp.name, "\" })");
        })
            .join(""), "\n        async ").concat(instanceNameSingular != instanceNamePlural ? instanceNamePlural : "".concat(instanceNamePlural, "List"), "(\n            @Args() {").concat(Object.entries(__assign(__assign({ scope: !!scopeProp }, dedicatedResolverArgProps.reduce(function (acc, dedicatedResolverArgProp) {
            acc[dedicatedResolverArgProp.name] = true;
            return acc;
        }, {})), { search: !!hasSearchArg, filter: !!hasFilterArg, sort: !!hasSortArg, offset: true, limit: true }))
            .filter(function (_a) {
            var key = _a[0], use = _a[1];
            return use;
        })
            .map(function (_a) {
            var key = _a[0];
            return key;
        })
            .join(", "), "}: ").concat(argsClassName, "\n            ").concat(hasOutputRelations ? ", @Info() info: GraphQLResolveInfo" : "", "\n        ): Promise<Paginated").concat(classNamePlural, "> {\n            const where").concat(hasSearchArg || hasFilterArg
            ? " = gqlArgsToMikroOrmQuery({ ".concat(hasSearchArg ? "search, " : "").concat(hasFilterArg ? "filter, " : "", " }, this.entityManager.getMetadata(").concat(metadata.className, "));")
            : ": ObjectQuery<".concat(metadata.className, "> = {}"), "\n            ").concat(scopeProp ? "where.scope = scope;" : "", "\n            ").concat(dedicatedResolverArgProps
            .map(function (dedicatedResolverArgProp) {
            return "where.".concat(dedicatedResolverArgProp.name, " = ").concat(dedicatedResolverArgProp.name, ";");
        })
            .join("\n"), "\n\n            ").concat(hasOutputRelations
            ? "const fields = extractGraphqlFields(info, { root: \"nodes\" });\n            const populate: string[] = [];"
            : "", "\n            ").concat(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], outputRelationManyToOneProps, true), outputRelationOneToManyProps, true), outputRelationManyToManyProps, true), outputRelationOneToOneProps, true).map(function (r) {
            return "if (fields.includes(\"".concat(r.name, "\")) {\n                            populate.push(\"").concat(r.name, "\");\n                        }");
        })
            .join("\n"), "\n\n            ").concat(hasOutputRelations ? "// eslint-disable-next-line @typescript-eslint/no-explicit-any" : "", "\n            const options: FindOptions<").concat(metadata.className).concat(hasOutputRelations ? ", any" : "", "> = { offset, limit").concat(hasOutputRelations ? ", populate" : "", "};\n\n            ").concat(hasSortArg
            ? "if (sort) {\n                options.orderBy = sort.map((sortItem) => {\n                    return {\n                        [sortItem.field]: sortItem.direction,\n                    };\n                });\n            }"
            : "", "\n\n            const [entities, totalCount] = await this.entityManager.findAndCount(").concat(metadata.className, ", where, options);\n            return new Paginated").concat(classNamePlural, "(entities, totalCount);\n        }\n        ")
        : "", "\n\n        ").concat(generatorOptions.create
        ? "\n\n        @Mutation(() => ".concat(metadata.className, ")\n        ").concat(dedicatedResolverArgProps
            .map(function (dedicatedResolverArgProp) {
            var _a;
            return "@AffectedEntity(".concat((_a = dedicatedResolverArgProp.targetMeta) === null || _a === void 0 ? void 0 : _a.className, ", { idArg: \"").concat(dedicatedResolverArgProp.name, "\" })");
        })
            .join(""), "\n        async create").concat(classNameSingular, "(\n            ").concat(scopeProp ? "@Args(\"scope\", { type: () => ".concat(scopeProp.type, " }) scope: ").concat(scopeProp.type, ",") : "").concat(dedicatedResolverArgProps
            .map(function (dedicatedResolverArgProp) {
            return "".concat(generateIdArg(dedicatedResolverArgProp.name, metadata), ", ");
        })
            .join(""), "@Args(\"input\", { type: () => ").concat(classNameSingular, "Input }) input: ").concat(classNameSingular, "Input\n        ): Promise<").concat(metadata.className, "> {\n            ").concat(
        // use local position-var because typescript does not narrow down input.position, keeping "| undefined" typing resulting in typescript error in create-function
        hasPositionProp
            ? "\n            const lastPosition = await this.".concat(instanceNamePlural, "Service.getLastPosition(").concat(positionGroupProps.length
                ? "{ ".concat(positionGroupProps
                    .map(function (prop) {
                    return prop.name === "scope"
                        ? "scope"
                        : dedicatedResolverArgProps.find(function (dedicatedResolverArgProp) { return dedicatedResolverArgProp.name === prop.name; }) !==
                            undefined
                            ? prop.name
                            : "".concat(prop.name, ": input.").concat(prop.name);
                })
                    .join(","), " }")
                : "", ");\n            let position = input.position;\n            if (position !== undefined && position < lastPosition + 1) {\n                await this.").concat(instanceNamePlural, "Service.incrementPositions(").concat(positionGroupProps.length
                ? "{ ".concat(positionGroupProps
                    .map(function (prop) {
                    return prop.name === "scope"
                        ? "scope"
                        : dedicatedResolverArgProps.find(function (dedicatedResolverArgProp) { return dedicatedResolverArgProp.name === prop.name; }) !==
                            undefined
                            ? prop.name
                            : "".concat(prop.name, ": input.").concat(prop.name);
                })
                    .join(","), " }, ")
                : "", "position);\n            } else {\n                position = lastPosition + 1;\n            }")
            : "", "\n\n            ").concat(createInputHandlingCode, "\n\n            await this.entityManager.flush();\n\n            return ").concat(instanceNameSingular, ";\n        }\n        ")
        : "", "\n\n        ").concat(generatorOptions.update
        ? "\n        @Mutation(() => ".concat(metadata.className, ")\n        @AffectedEntity(").concat(metadata.className, ")\n        async update").concat(classNameSingular, "(\n            ").concat(generateIdArg("id", metadata), ",\n            @Args(\"input\", { type: () => ").concat(classNameSingular, "UpdateInput }) input: ").concat(classNameSingular, "UpdateInput\n        ): Promise<").concat(metadata.className, "> {\n            const ").concat(instanceNameSingular, " = await this.entityManager.findOneOrFail(").concat(metadata.className, ", id);\n\n            ").concat(hasPositionProp
            ? "\n            if (input.position !== undefined) {\n                const lastPosition = await this.".concat(instanceNamePlural, "Service.getLastPosition(").concat(positionGroupProps.length
                ? "{ ".concat(positionGroupProps
                    .map(function (prop) {
                    return "".concat(prop.name, ": ").concat(instanceNameSingular, ".").concat(prop.name).concat([postgresql_1.ReferenceKind.MANY_TO_ONE, postgresql_1.ReferenceKind.ONE_TO_ONE].includes(prop.kind)
                        ? "".concat(prop.nullable ? "?" : "", ".id")
                        : "");
                })
                    .join(","), " }")
                : "", ");\n                if (input.position > lastPosition + 1) {\n                    input.position = lastPosition + 1;\n                }\n                if (").concat(instanceNameSingular, ".position < input.position) {\n                    await this.").concat(instanceNamePlural, "Service.decrementPositions(").concat(positionGroupProps.length
                ? "{ ".concat(positionGroupProps
                    .map(function (prop) {
                    return "".concat(prop.name, ": ").concat(instanceNameSingular, ".").concat(prop.name).concat([postgresql_1.ReferenceKind.MANY_TO_ONE, postgresql_1.ReferenceKind.ONE_TO_ONE].includes(prop.kind)
                        ? "".concat(prop.nullable ? "?" : "", ".id")
                        : "");
                })
                    .join(","), " },")
                : "").concat(instanceNameSingular, ".position, input.position);\n                } else if (").concat(instanceNameSingular, ".position > input.position) {\n                    await this.").concat(instanceNamePlural, "Service.incrementPositions(").concat(positionGroupProps.length
                ? "{ ".concat(positionGroupProps
                    .map(function (prop) {
                    return "".concat(prop.name, ": ").concat(instanceNameSingular, ".").concat(prop.name).concat([postgresql_1.ReferenceKind.MANY_TO_ONE, postgresql_1.ReferenceKind.ONE_TO_ONE].includes(prop.kind)
                        ? "".concat(prop.nullable ? "?" : "", ".id")
                        : "");
                })
                    .join(","), " },")
                : "", "input.position, ").concat(instanceNameSingular, ".position);\n                }\n            }")
            : "", "\n\n            ").concat(updateInputHandlingCode, "\n\n            await this.entityManager.flush();\n\n            return ").concat(instanceNameSingular, ";\n        }\n        ")
        : "", "\n\n        ").concat(generatorOptions.delete
        ? "\n        @Mutation(() => Boolean)\n        @AffectedEntity(".concat(metadata.className, ")\n        async delete").concat(metadata.className, "(").concat(generateIdArg("id", metadata), "): Promise<boolean> {\n            const ").concat(instanceNameSingular, " = await this.entityManager.findOneOrFail(").concat(metadata.className, ", id);\n            this.entityManager.remove(").concat(instanceNameSingular, ");").concat(hasPositionProp
            ? "await this.".concat(instanceNamePlural, "Service.decrementPositions(").concat(positionGroupProps.length
                ? "{ ".concat(positionGroupProps
                    .map(function (prop) {
                    return "".concat(prop.name, ": ").concat(instanceNameSingular, ".").concat(prop.name).concat([postgresql_1.ReferenceKind.MANY_TO_ONE, postgresql_1.ReferenceKind.ONE_TO_ONE].includes(prop.kind)
                        ? "".concat(prop.nullable ? "?" : "", ".id")
                        : "");
                })
                    .join(","), " },")
                : "").concat(instanceNameSingular, ".position);")
            : "", "\n            await this.entityManager.flush();\n            return true;\n        }\n        ")
        : "", "\n\n        ").concat(relationsFieldResolverCode, "\n    }\n    ");
    return resolverOut;
}
function generateCrud(generatorOptionsParam, metadata) {
    return __awaiter(this, void 0, void 0, function () {
        function generateCrudResolver() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (hasFilterArg) {
                        generatedFiles.push({
                            name: "dto/".concat(fileNameSingular, ".filter.ts"),
                            content: generateFilterDto({ generatorOptions: generatorOptions, metadata: metadata }),
                            type: "filter",
                        });
                    }
                    if (hasSortArg) {
                        generatedFiles.push({
                            name: "dto/".concat(fileNameSingular, ".sort.ts"),
                            content: generateSortDto({ generatorOptions: generatorOptions, metadata: metadata }),
                            type: "sort",
                        });
                    }
                    generatedFiles.push({
                        name: "dto/paginated-".concat(fileNamePlural, ".ts"),
                        content: generatePaginatedDto({ generatorOptions: generatorOptions, metadata: metadata }),
                        type: "sort",
                    });
                    generatedFiles.push({
                        name: "dto/".concat(argsFileName, ".ts"),
                        content: generateArgsDto({ generatorOptions: generatorOptions, metadata: metadata }),
                        type: "args",
                    });
                    if (hasPositionProp) {
                        generatedFiles.push({
                            name: "".concat(fileNamePlural, ".service.ts"),
                            content: generateService({ generatorOptions: generatorOptions, metadata: metadata }),
                            type: "service",
                        });
                    }
                    generatedFiles.push({
                        name: "".concat(fileNameSingular, ".resolver.ts"),
                        content: generateResolver({ generatorOptions: generatorOptions, metadata: metadata }),
                        type: "resolver",
                    });
                    metadata.props
                        .filter(function (prop) {
                        if (prop.kind === "1:m" && prop.orphanRemoval) {
                            if (!prop.targetMeta)
                                throw new Error("Target metadata not set");
                            var hasOwnCrudGenerator = Reflect.getMetadata(cms_api_1.CRUD_GENERATOR_METADATA_KEY, prop.targetMeta.class);
                            if (!hasOwnCrudGenerator) {
                                //generate nested resolver only if target entity has no own crud generator
                                return true;
                            }
                        }
                    })
                        .forEach(function (prop) {
                        if (!prop.targetMeta)
                            throw new Error("Target metadata not set");
                        var fileNameSingular = (0, build_name_variants_1.buildNameVariants)(prop.targetMeta).fileNameSingular;
                        var content = generateNestedEntityResolver({ generatorOptions: generatorOptions, metadata: prop.targetMeta });
                        //can be null if no relations exist
                        if (content) {
                            generatedFiles.push({
                                name: "".concat(fileNameSingular, ".resolver.ts"),
                                content: content,
                                type: "resolver",
                            });
                        }
                    });
                    return [2 /*return*/, generatedFiles];
                });
            });
        }
        var generatorOptions, generatedFiles, _a, fileNameSingular, fileNamePlural, _b, hasFilterArg, hasSortArg, argsFileName, hasPositionProp, crudInput, crudResolver;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    generatorOptions = __assign(__assign({}, generatorOptionsParam), { create: (_c = generatorOptionsParam.create) !== null && _c !== void 0 ? _c : true, update: (_d = generatorOptionsParam.update) !== null && _d !== void 0 ? _d : true, delete: (_e = generatorOptionsParam.delete) !== null && _e !== void 0 ? _e : true, list: (_f = generatorOptionsParam.list) !== null && _f !== void 0 ? _f : true, single: (_g = generatorOptionsParam.single) !== null && _g !== void 0 ? _g : true });
                    if (!generatorOptions.create && !generatorOptions.update && !generatorOptions.delete && !generatorOptions.list && !generatorOptions.single) {
                        throw new Error("At least one of create, update, delete, list or single must be true");
                    }
                    generatedFiles = [];
                    _a = (0, build_name_variants_1.buildNameVariants)(metadata), fileNameSingular = _a.fileNameSingular, fileNamePlural = _a.fileNamePlural;
                    _b = buildOptions(metadata, generatorOptions), hasFilterArg = _b.hasFilterArg, hasSortArg = _b.hasSortArg, argsFileName = _b.argsFileName, hasPositionProp = _b.hasPositionProp;
                    return [4 /*yield*/, (0, generate_crud_input_1.generateCrudInput)(generatorOptions, metadata)];
                case 1:
                    crudInput = _h.sent();
                    return [4 /*yield*/, generateCrudResolver()];
                case 2:
                    crudResolver = _h.sent();
                    return [2 /*return*/, __spreadArray(__spreadArray([], crudInput, true), crudResolver, true)];
            }
        });
    });
}
