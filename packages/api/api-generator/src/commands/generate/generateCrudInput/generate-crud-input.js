"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCrudInput = generateCrudInput;
var cms_api_1 = require("@comet/cms-api");
var class_validator_1 = require("class-validator");
var ts_morph_1 = require("ts-morph");
var generate_crud_1 = require("../generateCrud/generate-crud");
var build_name_variants_1 = require("../utils/build-name-variants");
var constants_1 = require("../utils/constants");
var generate_imports_code_1 = require("../utils/generate-imports-code");
var ts_morph_helper_1 = require("../utils/ts-morph-helper");
function tsCodeRecordToString(object) {
    var filteredEntries = Object.entries(object).filter(function (_a) {
        var key = _a[0], value = _a[1];
        return value !== undefined;
    });
    if (filteredEntries.length == 0)
        return "";
    return "{".concat(filteredEntries.map(function (_a) {
        var key = _a[0], value = _a[1];
        return "".concat(key, ": ").concat(value, ",");
    }).join("\n"), "}");
}
function findReferenceTargetType(targetMeta, referencedColumnName) {
    var referencedColumnProp = targetMeta === null || targetMeta === void 0 ? void 0 : targetMeta.props.find(function (p) { return p.name == referencedColumnName; });
    if (!referencedColumnProp)
        throw new Error("referencedColumnProp not found");
    if (referencedColumnProp.type == "uuid") {
        return "uuid";
    }
    else if (referencedColumnProp.type == "string") {
        return "string";
    }
    else if (referencedColumnProp.type == "integer" || referencedColumnProp.type == "int") {
        return "integer";
    }
    else {
        return null;
    }
}
function generateCrudInput(generatorOptions_1, metadata_1) {
    return __awaiter(this, arguments, void 0, function (generatorOptions, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata, options) {
        var generatedFiles, dedicatedResolverArgProps, props, fieldsOut, imports, _i, props_1, prop, type, fieldName, definedDecorators, decorators, isOptional, initializer, defaultValue, fieldOptions, initializer, defaultValue, fieldOptions, enumName, importPath, initializer, fieldOptions, enumName, importPath, initializer, defaultValue, fieldOptions, initializer, defaultValue, fieldOptions, initializer, defaultValue, fieldOptions, initializer, defaultValue, fieldOptions, initializer, defaultValue, fieldOptions, blockName, importPath, initializer, defaultValueNull, fieldOptions, refType, inputNameClassName, excludeFields, fileNameSingular_1, targetFileNameSingular, fileName_1, nestedInputFiles, refType, refType, inputNameClassName, excludeFields, fileNameSingular_2, targetFileNameSingular, fileName_2, nestedInputFiles, tsProp, tsType, initializer, defaultValue, fieldOptions, nestedClassName, importPath, typeNode, elementTypeNode, importPath, nestedClassName, importPath, typeNode, importPath, initializer, defaultValueNull, fieldOptions, className_1, importPath, classValidatorValidators, _a, classValidatorValidators_1, validator_1, constraints, _loop_1, _b, constraints_1, constraint, className, inputOut, fileNameSingular, fileName;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        if (options === void 0) { options = {
            nested: false,
            excludeFields: [],
            generateUpdateInput: true,
        }; }
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    generatedFiles = [];
                    dedicatedResolverArgProps = (0, generate_crud_1.buildOptions)(metadata, generatorOptions).dedicatedResolverArgProps;
                    props = metadata.props
                        .filter(function (prop) {
                        return !prop.embedded;
                    })
                        .filter(function (prop) {
                        return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "input");
                    })
                        .filter(function (prop) {
                        //filter out props that are dedicatedResolverArgProps
                        return !dedicatedResolverArgProps.some(function (dedicatedResolverArgProp) { return dedicatedResolverArgProp.name === prop.name; });
                    })
                        .filter(function (prop) { return !options.excludeFields.includes(prop.name); });
                    fieldsOut = "";
                    imports = [
                        { name: "IsSlug", importPath: "@comet/cms-api" },
                        { name: "RootBlockInputScalar", importPath: "@comet/cms-api" },
                        { name: "IsNullable", importPath: "@comet/cms-api" },
                        { name: "PartialType", importPath: "@comet/cms-api" },
                        { name: "BlockInputInterface", importPath: "@comet/cms-api" },
                        { name: "isBlockInputInterface", importPath: "@comet/cms-api" },
                    ];
                    _i = 0, props_1 = props;
                    _r.label = 1;
                case 1:
                    if (!(_i < props_1.length)) return [3 /*break*/, 22];
                    prop = props_1[_i];
                    type = prop.type;
                    fieldName = prop.name;
                    definedDecorators = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getDecorators();
                    decorators = [];
                    isOptional = prop.nullable;
                    if (prop.name != "position") {
                        if (!prop.nullable) {
                            decorators.push("@IsNotEmpty()");
                        }
                        else {
                            decorators.push("@IsNullable()");
                        }
                    }
                    if (!["id", "createdAt", "updatedAt", "scope"].includes(prop.name)) return [3 /*break*/, 2];
                    //skip those (TODO find a non-magic solution?)
                    return [3 /*break*/, 21];
                case 2:
                    if (!(prop.name == "position")) return [3 /*break*/, 3];
                    initializer = (_c = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _c === void 0 ? void 0 : _c.getText();
                    defaultValue = initializer == "undefined" || initializer == "null" ? "null" : initializer;
                    fieldOptions = tsCodeRecordToString({ nullable: "true", defaultValue: defaultValue });
                    isOptional = true;
                    decorators.push("@IsOptional()");
                    imports.push({ name: "Min", importPath: "class-validator" });
                    decorators.push("@Min(1)");
                    decorators.push("@IsInt()");
                    decorators.push("@Field(() => Int, ".concat(fieldOptions, ")"));
                    type = "number";
                    return [3 /*break*/, 20];
                case 3:
                    if (!prop.enum) return [3 /*break*/, 4];
                    initializer = (_d = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _d === void 0 ? void 0 : _d.getText();
                    defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined) ? "null" : initializer;
                    fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue: defaultValue });
                    enumName = (0, ts_morph_helper_1.findEnumName)(prop.name, metadata);
                    importPath = (0, ts_morph_helper_1.findEnumImportPath)(enumName, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
                    imports.push({ name: enumName, importPath: importPath });
                    decorators.push("@IsEnum(".concat(enumName, ")"));
                    decorators.push("@Field(() => ".concat(enumName, ", ").concat(fieldOptions, ")"));
                    type = enumName;
                    return [3 /*break*/, 20];
                case 4:
                    if (!(prop.type === "EnumArrayType")) return [3 /*break*/, 5];
                    if (prop.nullable) {
                        console.warn("".concat(prop.name, ": Nullable enum arrays are not supported"));
                    }
                    decorators.length = 0; //remove @IsNotEmpty
                    initializer = (_e = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _e === void 0 ? void 0 : _e.getText();
                    fieldOptions = tsCodeRecordToString({ defaultValue: initializer });
                    enumName = (0, ts_morph_helper_1.findEnumName)(prop.name, metadata);
                    importPath = (0, ts_morph_helper_1.findEnumImportPath)(enumName, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
                    imports.push({ name: enumName, importPath: importPath });
                    decorators.push("@IsEnum(".concat(enumName, ", { each: true })"));
                    decorators.push("@Field(() => [".concat(enumName, "], ").concat(fieldOptions, ")"));
                    type = "".concat(enumName, "[]");
                    return [3 /*break*/, 20];
                case 5:
                    if (!(prop.type === "string" || prop.type === "text")) return [3 /*break*/, 6];
                    initializer = (_f = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _f === void 0 ? void 0 : _f.getText();
                    defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined) ? "null" : initializer;
                    fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue: defaultValue });
                    decorators.push("@IsString()");
                    if (prop.name.startsWith("scope_")) {
                        return [3 /*break*/, 21];
                    }
                    else if (prop.name === "slug") {
                        //TODO find a non-magic solution
                        decorators.push("@IsSlug()");
                    }
                    decorators.push("@Field(".concat(fieldOptions, ")"));
                    type = "string";
                    return [3 /*break*/, 20];
                case 6:
                    if (!(prop.type === "DecimalType" || prop.type == "BigIntType" || prop.type === "number")) return [3 /*break*/, 7];
                    initializer = (_g = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _g === void 0 ? void 0 : _g.getText();
                    defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined) ? "null" : initializer;
                    fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue: defaultValue });
                    if (constants_1.integerTypes.includes(prop.columnTypes[0])) {
                        decorators.push("@IsInt()");
                        decorators.push("@Field(() => Int, ".concat(fieldOptions, ")"));
                    }
                    else {
                        decorators.push("@IsNumber()");
                        decorators.push("@Field(".concat(fieldOptions, ")"));
                    }
                    type = "number";
                    return [3 /*break*/, 20];
                case 7:
                    if (!(prop.type === "DateType")) return [3 /*break*/, 8];
                    initializer = (_h = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _h === void 0 ? void 0 : _h.getText();
                    defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined) ? "null" : initializer;
                    fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue: defaultValue });
                    decorators.push("@IsDateString()");
                    decorators.push("@Field(() => GraphQLLocalDate, ".concat(fieldOptions, ")"));
                    type = "string";
                    return [3 /*break*/, 20];
                case 8:
                    if (!(prop.type === "Date")) return [3 /*break*/, 9];
                    initializer = (_j = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _j === void 0 ? void 0 : _j.getText();
                    defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined) ? "null" : initializer;
                    fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue: defaultValue });
                    decorators.push("@IsDate()");
                    decorators.push("@Field(".concat(fieldOptions, ")"));
                    type = "Date";
                    return [3 /*break*/, 20];
                case 9:
                    if (!(prop.type === "BooleanType" || prop.type === "boolean")) return [3 /*break*/, 10];
                    initializer = (_k = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _k === void 0 ? void 0 : _k.getText();
                    defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined) ? "null" : initializer;
                    fieldOptions = tsCodeRecordToString({ nullable: prop.nullable ? "true" : undefined, defaultValue: defaultValue });
                    decorators.push("@IsBoolean()");
                    decorators.push("@Field(".concat(fieldOptions, ")"));
                    type = "boolean";
                    return [3 /*break*/, 20];
                case 10:
                    if (!(prop.type === "RootBlockType")) return [3 /*break*/, 11];
                    blockName = (0, ts_morph_helper_1.findBlockName)(prop.name, metadata);
                    importPath = (0, ts_morph_helper_1.findBlockImportPath)(blockName, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
                    imports.push({ name: blockName, importPath: importPath });
                    decorators.push("@Field(() => RootBlockInputScalar(".concat(blockName, ")").concat(prop.nullable ? ", { nullable: true }" : "", ")"));
                    decorators.push("@Transform(({ value }) => (isBlockInputInterface(value) ? value : ".concat(blockName, ".blockInputFactory(value)), { toClassOnly: true })"));
                    decorators.push("@ValidateNested()");
                    type = "BlockInputInterface";
                    return [3 /*break*/, 20];
                case 11:
                    if (!(prop.kind == "m:1")) return [3 /*break*/, 12];
                    initializer = (_l = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _l === void 0 ? void 0 : _l.getText();
                    defaultValueNull = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined);
                    fieldOptions = tsCodeRecordToString({
                        nullable: prop.nullable ? "true" : undefined,
                        defaultValue: defaultValueNull ? "null" : undefined,
                    });
                    decorators.push("@Field(() => ID, ".concat(fieldOptions, ")"));
                    if (prop.referencedColumnNames.length > 1) {
                        console.warn("".concat(prop.name, ": Composite keys are not supported"));
                        return [3 /*break*/, 21];
                    }
                    refType = findReferenceTargetType(prop.targetMeta, prop.referencedColumnNames[0]);
                    if (refType == "uuid") {
                        type = "string";
                        decorators.push("@IsUUID()");
                    }
                    else if (refType == "string") {
                        type = "string";
                        decorators.push("@IsString()");
                    }
                    else if (refType == "integer") {
                        type = "number";
                        decorators.push("@Transform(({ value }) => (value ? parseInt(value) : null))");
                        decorators.push("@IsInt()");
                    }
                    else {
                        console.warn("".concat(prop.name, ": Unsupported referenced type"));
                    }
                    return [3 /*break*/, 20];
                case 12:
                    if (!(prop.kind == "1:m")) return [3 /*break*/, 16];
                    if (!prop.orphanRemoval) return [3 /*break*/, 14];
                    //if orphanRemoval is enabled, we need to generate a nested input type
                    decorators.length = 0;
                    if (!prop.targetMeta)
                        throw new Error("No targetMeta");
                    inputNameClassName = "".concat(metadata.className, "Nested").concat(prop.targetMeta.className, "Input");
                    excludeFields = prop.targetMeta.props.filter(function (p) { return p.kind == "m:1" && p.targetMeta == metadata; }).map(function (p) { return p.name; });
                    fileNameSingular_1 = (0, build_name_variants_1.buildNameVariants)(metadata).fileNameSingular;
                    targetFileNameSingular = (0, build_name_variants_1.buildNameVariants)(prop.targetMeta).fileNameSingular;
                    fileName_1 = "dto/".concat(fileNameSingular_1, "-nested-").concat(targetFileNameSingular, ".input.ts");
                    return [4 /*yield*/, generateCrudInput(generatorOptions, prop.targetMeta, {
                            nested: true,
                            fileName: fileName_1,
                            className: inputNameClassName,
                            excludeFields: excludeFields,
                        })];
                case 13:
                    nestedInputFiles = _r.sent();
                    generatedFiles.push.apply(generatedFiles, nestedInputFiles);
                    imports.push({
                        name: inputNameClassName,
                        importPath: nestedInputFiles[0].name.replace(/^dto/, ".").replace(/\.ts$/, ""),
                    });
                    decorators.push("@Field(() => [".concat(inputNameClassName, "], {").concat(prop.nullable ? "nullable: true" : "defaultValue: []", "})"));
                    decorators.push("@IsArray()");
                    decorators.push("@Type(() => ".concat(inputNameClassName, ")"));
                    type = "".concat(inputNameClassName, "[]");
                    return [3 /*break*/, 15];
                case 14:
                    //if orphanRemoval is disabled, we reference the id in input
                    decorators.length = 0;
                    decorators.push("@Field(() => [ID], {".concat(prop.nullable ? "nullable: true" : "defaultValue: []", "})"));
                    decorators.push("@IsArray()");
                    if (prop.referencedColumnNames.length > 1) {
                        console.warn("".concat(prop.name, ": Composite keys are not supported"));
                        return [3 /*break*/, 21];
                    }
                    refType = findReferenceTargetType(prop.targetMeta, prop.referencedColumnNames[0]);
                    if (refType == "uuid") {
                        type = "string[]";
                        decorators.push("@IsUUID(undefined, { each: true })");
                    }
                    else if (refType == "string") {
                        type = "string[]";
                        decorators.push("@IsString({ each: true })");
                    }
                    else if (refType == "integer") {
                        type = "number[]";
                        decorators.push("@Transform(({ value }) => value.map((id: string) => parseInt(id)))");
                        decorators.push("@IsInt({ each: true })");
                    }
                    else {
                        console.warn("".concat(prop.name, ": Unsupported referenced type"));
                    }
                    _r.label = 15;
                case 15: return [3 /*break*/, 20];
                case 16:
                    if (!(prop.kind == "m:n")) return [3 /*break*/, 17];
                    decorators.length = 0;
                    decorators.push("@Field(() => [ID], {".concat(prop.nullable ? "nullable: true" : "defaultValue: []", "})"));
                    decorators.push("@IsArray()");
                    if (prop.referencedColumnNames.length > 1) {
                        console.warn("".concat(prop.name, ": Composite keys are not supported"));
                        return [3 /*break*/, 21];
                    }
                    refType = findReferenceTargetType(prop.targetMeta, prop.referencedColumnNames[0]);
                    if (refType == "uuid") {
                        type = "string[]";
                        decorators.push("@IsUUID(undefined, { each: true })");
                    }
                    else if (refType == "string") {
                        type = "string[]";
                        decorators.push("@IsString({ each: true })");
                    }
                    else if (refType == "integer") {
                        type = "number[]";
                        decorators.push("@Transform(({ value }) => value.map((id: string) => parseInt(id)))");
                    }
                    else {
                        console.warn("".concat(prop.name, ": Unsupported referenced type"));
                    }
                    return [3 /*break*/, 20];
                case 17:
                    if (!(prop.kind == "1:1")) return [3 /*break*/, 19];
                    if (!prop.targetMeta)
                        throw new Error("No targetMeta");
                    inputNameClassName = "".concat(metadata.className, "Nested").concat(prop.targetMeta.className, "Input");
                    excludeFields = prop.targetMeta.props.filter(function (p) { return p.kind == "1:1" && p.targetMeta == metadata; }).map(function (p) { return p.name; });
                    fileNameSingular_2 = (0, build_name_variants_1.buildNameVariants)(metadata).fileNameSingular;
                    targetFileNameSingular = (0, build_name_variants_1.buildNameVariants)(prop.targetMeta).fileNameSingular;
                    fileName_2 = "dto/".concat(fileNameSingular_2, "-nested-").concat(targetFileNameSingular, ".input.ts");
                    return [4 /*yield*/, generateCrudInput(generatorOptions, prop.targetMeta, {
                            nested: true,
                            fileName: fileName_2,
                            className: inputNameClassName,
                            excludeFields: excludeFields,
                        })];
                case 18:
                    nestedInputFiles = _r.sent();
                    generatedFiles.push.apply(generatedFiles, nestedInputFiles);
                    imports.push({
                        name: inputNameClassName,
                        importPath: nestedInputFiles[nestedInputFiles.length - 1].name.replace(/^dto/, ".").replace(/\.ts$/, ""),
                    });
                    decorators.push("@Field(() => ".concat(inputNameClassName).concat(prop.nullable ? ", { nullable: true }" : "", ")"));
                    decorators.push("@Type(() => ".concat(inputNameClassName, ")"));
                    decorators.push("@ValidateNested()");
                    type = "".concat(inputNameClassName);
                    return [3 /*break*/, 20];
                case 19:
                    if (prop.type == "JsonType" || prop.embeddable || prop.type == "ArrayType") {
                        tsProp = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata);
                        tsType = tsProp.getType();
                        if (tsType.isUnion() && tsType.getUnionTypes().length == 2 && tsType.getUnionTypes()[0].getText() == "undefined") {
                            // undefinded | type (or prop?: type) -> type
                            tsType = tsType.getUnionTypes()[1];
                        }
                        type = tsType.getText(tsProp);
                        if (tsType.isArray()) {
                            initializer = (_m = tsProp.getInitializer()) === null || _m === void 0 ? void 0 : _m.getText();
                            defaultValue = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined)
                                ? "null"
                                : initializer == "[]"
                                    ? "[]"
                                    : undefined;
                            fieldOptions = tsCodeRecordToString({
                                nullable: prop.nullable ? "true" : undefined,
                                defaultValue: defaultValue,
                            });
                            decorators.push("@IsArray()");
                            if (type == "string[]") {
                                decorators.push("@Field(() => [String], ".concat(fieldOptions, ")"));
                                decorators.push("@IsString({ each: true })");
                            }
                            else if (type == "number[]") {
                                decorators.push("@Field(() => [Number], ".concat(fieldOptions, ")"));
                                decorators.push("@IsNumber({ each: true })");
                            }
                            else if (type == "boolean[]") {
                                decorators.push("@Field(() => [Boolean], ".concat(fieldOptions, ")"));
                                decorators.push("@IsBoolean({ each: true })");
                            }
                            else if (tsType.getArrayElementTypeOrThrow().isClass()) {
                                nestedClassName = tsType.getArrayElementTypeOrThrow().getText(tsProp);
                                importPath = (0, ts_morph_helper_1.findInputClassImportPath)(nestedClassName, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
                                imports.push({ name: nestedClassName, importPath: importPath });
                                decorators.push("@ValidateNested()");
                                decorators.push("@Type(() => ".concat(nestedClassName, ")"));
                                decorators.push("@Field(() => [".concat(nestedClassName, "], ").concat(fieldOptions, ")"));
                            }
                            else {
                                typeNode = tsProp.getTypeNodeOrThrow().asKindOrThrow(ts_morph_1.SyntaxKind.ArrayType);
                                elementTypeNode = typeNode.getElementTypeNode();
                                if (elementTypeNode.isKind(ts_morph_1.SyntaxKind.TypeReference)) {
                                    importPath = (0, ts_morph_helper_1.findImportPath)(elementTypeNode.getText(), "".concat(generatorOptions.targetDirectory, "/dto"), metadata).importPath;
                                    if (importPath) {
                                        imports.push({ name: elementTypeNode.getText(), importPath: importPath });
                                    }
                                }
                                decorators.push("@Field(() => [GraphQLJSONObject], ".concat(fieldOptions, ") // Warning: this input is not validated properly"));
                            }
                        }
                        else if (tsType.isClass()) {
                            nestedClassName = tsType.getText(tsProp);
                            importPath = (0, ts_morph_helper_1.findInputClassImportPath)(nestedClassName, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
                            imports.push({ name: nestedClassName, importPath: importPath });
                            decorators.push("@ValidateNested()");
                            decorators.push("@Type(() => ".concat(nestedClassName, ")"));
                            decorators.push("@Field(() => ".concat(nestedClassName).concat(prop.nullable ? ", { nullable: true }" : "", ")"));
                        }
                        else {
                            typeNode = tsProp.getTypeNodeOrThrow();
                            if (typeNode.isKind(ts_morph_1.SyntaxKind.TypeReference)) {
                                importPath = (0, ts_morph_helper_1.findImportPath)(typeNode.getText(), "".concat(generatorOptions.targetDirectory, "/dto"), metadata).importPath;
                                if (importPath) {
                                    imports.push({ name: typeNode.getText(), importPath: importPath });
                                }
                            }
                            decorators.push("@Field(() => GraphQLJSONObject".concat(prop.nullable ? ", { nullable: true }" : "", ") // Warning: this input is not validated properly"));
                        }
                    }
                    else if (prop.type == "uuid") {
                        initializer = (_o = (0, ts_morph_helper_1.morphTsProperty)(prop.name, metadata).getInitializer()) === null || _o === void 0 ? void 0 : _o.getText();
                        defaultValueNull = prop.nullable && (initializer == "undefined" || initializer == "null" || initializer === undefined);
                        fieldOptions = tsCodeRecordToString({
                            nullable: prop.nullable ? "true" : undefined,
                            defaultValue: defaultValueNull ? "null" : undefined,
                        });
                        decorators.push("@Field(() => ID, ".concat(fieldOptions, ")"));
                        decorators.push("@IsUUID()");
                        type = "string";
                    }
                    else if ((0, ts_morph_helper_1.getFieldDecoratorClassName)(prop.name, metadata)) {
                        className_1 = (0, ts_morph_helper_1.getFieldDecoratorClassName)(prop.name, metadata);
                        importPath = (0, ts_morph_helper_1.findInputClassImportPath)(className_1, "".concat(generatorOptions.targetDirectory, "/dto"), metadata);
                        imports.push({ name: className_1, importPath: importPath });
                        decorators.push("@ValidateNested()");
                        decorators.push("@Type(() => ".concat(className_1, ")"));
                        decorators.push("@Field(() => ".concat(className_1).concat(prop.nullable ? ", { nullable: true }" : "", ")"));
                        type = className_1;
                    }
                    else {
                        console.warn("".concat(prop.name, ": unsupported type ").concat(type));
                        return [3 /*break*/, 21];
                    }
                    _r.label = 20;
                case 20:
                    classValidatorValidators = (0, class_validator_1.getMetadataStorage)().getTargetValidationMetadatas(metadata.class, prop.name, false, false, undefined);
                    for (_a = 0, classValidatorValidators_1 = classValidatorValidators; _a < classValidatorValidators_1.length; _a++) {
                        validator_1 = classValidatorValidators_1[_a];
                        if (validator_1.propertyName !== prop.name)
                            continue;
                        constraints = (0, class_validator_1.getMetadataStorage)().getTargetValidatorConstraints(validator_1.constraintCls);
                        _loop_1 = function (constraint) {
                            var decorator = definedDecorators.find(function (decorator) {
                                return (
                                // ignore casing since class validator is inconsistent with casing
                                decorator.getName().toUpperCase() === constraint.name.toUpperCase() ||
                                    // some class validator decorators have a prefix "Is" but not in the constraint name
                                    "Is".concat(decorator.getName()).toUpperCase() === constraint.name.toUpperCase());
                            });
                            if (decorator) {
                                var importPath = (0, ts_morph_helper_1.findValidatorImportPath)(decorator.getName(), generatorOptions, metadata);
                                if (importPath) {
                                    imports.push({ name: decorator.getName(), importPath: importPath });
                                    if (!decorators.includes(decorator.getText())) {
                                        decorators.unshift(decorator.getText());
                                    }
                                }
                            }
                            else {
                                console.warn("Decorator import for constraint ".concat(constraint.name, " not found"));
                            }
                        };
                        for (_b = 0, constraints_1 = constraints; _b < constraints_1.length; _b++) {
                            constraint = constraints_1[_b];
                            _loop_1(constraint);
                        }
                    }
                    fieldsOut += "".concat(decorators.join("\n"), "\n    ").concat(fieldName).concat(isOptional ? "?" : "", ": ").concat(type, ";\n    \n    ");
                    _r.label = 21;
                case 21:
                    _i++;
                    return [3 /*break*/, 1];
                case 22:
                    className = (_p = options.className) !== null && _p !== void 0 ? _p : "".concat(metadata.className, "Input");
                    inputOut = "import { Field, InputType, ID, Int } from \"@nestjs/graphql\";\nimport { Transform, Type } from \"class-transformer\";\nimport { IsString, IsNotEmpty, ValidateNested, IsNumber, IsBoolean, IsDate, IsDateString, IsOptional, IsEnum, IsUUID, IsArray, IsInt } from \"class-validator\";\nimport { GraphQLJSONObject, GraphQLLocalDate } from \"graphql-scalars\";\n".concat((0, generate_imports_code_1.generateImportsCode)(imports), "\n\n@InputType()\nexport class ").concat(className, " {\n    ").concat(fieldsOut, "\n}\n\n").concat(options.generateUpdateInput && !options.nested
                        ? "\n@InputType()\nexport class ".concat(className.replace(/Input$/, ""), "UpdateInput extends PartialType(").concat(className, ") {}\n")
                        : "", "\n");
                    fileNameSingular = (0, build_name_variants_1.buildNameVariants)(metadata).fileNameSingular;
                    fileName = (_q = options.fileName) !== null && _q !== void 0 ? _q : "dto/".concat(fileNameSingular, ".input.ts");
                    generatedFiles.push({
                        name: fileName,
                        content: inputOut,
                        type: "input",
                    });
                    return [2 /*return*/, generatedFiles];
            }
        });
    });
}
