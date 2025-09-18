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
exports.generateCrudSingle = generateCrudSingle;
var cms_api_1 = require("@comet/cms-api");
var path = require("path");
var generate_crud_input_1 = require("../generateCrudInput/generate-crud-input");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateCrudSingle(generatorOptions, metadata) {
    return __awaiter(this, void 0, void 0, function () {
        function generateCrudResolver() {
            return __awaiter(this, void 0, void 0, function () {
                var generatedFiles, scopeProp, blockProps, serviceOut, resolverOut;
                return __generator(this, function (_a) {
                    generatedFiles = [];
                    scopeProp = metadata.props.find(function (prop) { return prop.name == "scope"; });
                    if (scopeProp && !scopeProp.targetMeta)
                        throw new Error("Scope prop has no targetMeta");
                    blockProps = metadata.props.filter(function (prop) {
                        return (0, cms_api_1.hasCrudFieldFeature)(metadata.class, prop.name, "input") && prop.type === "RootBlockType";
                    });
                    serviceOut = "import { ObjectQuery } from \"@mikro-orm/postgresql\";\n    import { Injectable } from \"@nestjs/common\";\n    import { ".concat(metadata.className, " } from \"").concat(path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, ""), "\";\n    \n    @Injectable()\n    export class ").concat(classNamePlural, "Service {    \n        \n    }\n    ");
                    generatedFiles.push({ name: "".concat(fileNamePlural, ".service.ts"), content: serviceOut, type: "service" });
                    resolverOut = "import { FindOptions, EntityManager } from \"@mikro-orm/postgresql\";\n    import { Args, ID, Mutation, Query, Resolver } from \"@nestjs/graphql\";\n    import { RequiredPermission, SortDirection, validateNotModified } from \"@comet/cms-api\";\n    \n    import { ".concat(metadata.className, " } from \"").concat(path.relative(generatorOptions.targetDirectory, metadata.path).replace(/\.ts$/, ""), "\";\n    ").concat(scopeProp && scopeProp.targetMeta
                        ? "import { ".concat(scopeProp.targetMeta.className, " } from \"").concat(path
                            .relative(generatorOptions.targetDirectory, scopeProp.targetMeta.path)
                            .replace(/\.ts$/, ""), "\";")
                        : "", "\n    import { ").concat(classNamePlural, "Service } from \"./").concat(fileNamePlural, ".service\";\n    import { ").concat(classNameSingular, "Input } from \"./dto/").concat(fileNameSingular, ".input\";\n\n    @Resolver(() => ").concat(metadata.className, ")\n    @RequiredPermission(").concat(JSON.stringify(generatorOptions.requiredPermission)).concat(!scopeProp ? ", { skipScopeCheck: true }" : "", ")\n    export class ").concat(classNameSingular, "Resolver {\n        constructor(\n            protected readonly entityManager: EntityManager,\n            protected readonly ").concat(instanceNamePlural, "Service: ").concat(classNamePlural, "Service,\n        ) {}\n    \n        @Query(() => ").concat(metadata.className, ", { nullable: true })\n        async ").concat(instanceNameSingular, "(\n                ").concat(scopeProp ? "@Args(\"scope\", { type: () => ".concat(scopeProp.type, " }) scope: ").concat(scopeProp.type, ",") : "", "\n            ): Promise<").concat(metadata.className, " | null> {\n            const ").concat(instanceNamePlural, " = await this.entityManager.find(").concat(metadata.className, ", {").concat(scopeProp ? "scope" : "", "});\n            if (").concat(instanceNamePlural, ".length > 1) {\n                throw new Error(\"There must be only one ").concat(instanceNameSingular, "\");\n            }\n    \n            return ").concat(instanceNamePlural, ".length > 0 ? ").concat(instanceNamePlural, "[0] : null;\n        }\n    \n        @Mutation(() => ").concat(metadata.className, ")\n        async save").concat(classNameSingular, "(\n            ").concat(scopeProp ? "@Args(\"scope\", { type: () => ".concat(scopeProp.type, " }) scope: ").concat(scopeProp.type, ",") : "", "\n            @Args(\"input\", { type: () => ").concat(classNameSingular, "Input }) input: ").concat(classNameSingular, "Input\n        ): Promise<").concat(metadata.className, "> {\n            let ").concat(instanceNameSingular, " = await this.entityManager.findOne(").concat(metadata.className, ", {").concat(scopeProp ? "scope" : "", "});\n\n            if (!").concat(instanceNameSingular, ") {\n                ").concat(instanceNameSingular, " = this.entityManager.create(").concat(metadata.className, ", {\n                    ...input,\n                    ").concat(blockProps.length ? "".concat(blockProps.map(function (prop) { return "".concat(prop.name, ": input.").concat(prop.name, ".transformToBlockData()"); }).join(", "), ", ") : "", "\n                    ").concat(scopeProp ? "scope," : "", " \n                });\n            }\n\n            ").concat(instanceNameSingular, ".assign({\n                ...input,\n                ").concat(blockProps.length ? "".concat(blockProps.map(function (prop) { return "".concat(prop.name, ": input.").concat(prop.name, ".transformToBlockData()"); }).join(", "), ", ") : "", "\n            });\n    \n            await this.entityManager.flush();\n    \n            return ").concat(instanceNameSingular, ";\n        }\n    }\n    ");
                    generatedFiles.push({ name: "".concat(fileNameSingular, ".resolver.ts"), content: resolverOut, type: "resolver" });
                    return [2 /*return*/, generatedFiles];
                });
            });
        }
        var classNameSingular, classNamePlural, instanceNameSingular, instanceNamePlural, fileNameSingular, fileNamePlural, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    classNameSingular = metadata.className;
                    classNamePlural = !metadata.className.endsWith("s") ? "".concat(metadata.className, "s") : metadata.className;
                    instanceNameSingular = classNameSingular[0].toLocaleLowerCase() + classNameSingular.slice(1);
                    instanceNamePlural = classNamePlural[0].toLocaleLowerCase() + classNamePlural.slice(1);
                    fileNameSingular = instanceNameSingular.replace(/[A-Z]/g, function (i) { return "-".concat(i.toLocaleLowerCase()); });
                    fileNamePlural = instanceNamePlural.replace(/[A-Z]/g, function (i) { return "-".concat(i.toLocaleLowerCase()); });
                    _a = [[]];
                    return [4 /*yield*/, (0, generate_crud_input_1.generateCrudInput)(generatorOptions, metadata, { nested: false, excludeFields: [], generateUpdateInput: false })];
                case 1:
                    _b = [__spreadArray.apply(void 0, _a.concat([(_c.sent()), true]))];
                    return [4 /*yield*/, generateCrudResolver()];
                case 2: return [2 /*return*/, __spreadArray.apply(void 0, _b.concat([(_c.sent()), true]))];
            }
        });
    });
}
