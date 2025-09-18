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
exports.generateFiles = void 0;
var node_console_1 = require("node:console");
var cms_api_1 = require("@comet/cms-api");
var cli_1 = require("@mikro-orm/cli");
var lazy_metadata_storage_1 = require("@nestjs/graphql/dist/schema-builder/storages/lazy-metadata.storage");
var generate_crud_1 = require("./generateCrud/generate-crud");
var generate_crud_single_1 = require("./generateCrudSingle/generate-crud-single");
var write_generated_files_1 = require("./utils/write-generated-files");
/**
 * Generate mode for the generator.
 *
 * Generates CRUD files for all entities or a specific entity available at file path.
 * @param file
 */
var generateFiles = function (
/**
 * File path to the entity for which to generate CRUD files.
 *
 * @default undefined -> generate all entities
 */
file) { return __awaiter(void 0, void 0, void 0, function () {
    var orm, e_1, entities, _a, _b, _c, _i, name_1, entity, generatorOptions, files, generatorOptions, files;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                orm = null;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, cli_1.CLIHelper.getORM(undefined, undefined, { dbName: "generator" })];
            case 2:
                orm = _d.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _d.sent();
                node_console_1.default.warn(e_1);
                return [3 /*break*/, 4];
            case 4:
                if (!(orm != null)) return [3 /*break*/, 12];
                entities = orm.em.getMetadata().getAll();
                lazy_metadata_storage_1.LazyMetadataStorage.load();
                _a = entities;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _d.label = 5;
            case 5:
                if (!(_i < _b.length)) return [3 /*break*/, 12];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 11];
                name_1 = _c;
                entity = entities[name_1];
                if (!entity.class) {
                    // Ignore e.g. relation entities that don't have a class
                    return [3 /*break*/, 11];
                }
                if (!(file == null || entity.path === "./".concat(file))) return [3 /*break*/, 11];
                generatorOptions = Reflect.getMetadata(cms_api_1.CRUD_GENERATOR_METADATA_KEY, entity.class);
                if (!generatorOptions) return [3 /*break*/, 8];
                node_console_1.default.log("\uD83D\uDE80 start generateCrud for Entity ".concat(entity.path));
                return [4 /*yield*/, (0, generate_crud_1.generateCrud)(generatorOptions, entity)];
            case 6:
                files = _d.sent();
                return [4 /*yield*/, (0, write_generated_files_1.writeGeneratedFiles)(files, { targetDirectory: generatorOptions.targetDirectory })];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                generatorOptions = Reflect.getMetadata(cms_api_1.CRUD_SINGLE_GENERATOR_METADATA_KEY, entity.class);
                if (!generatorOptions) return [3 /*break*/, 11];
                node_console_1.default.log("\uD83D\uDE80 start generateCrudSingle for Entity ".concat(entity.path));
                return [4 /*yield*/, (0, generate_crud_single_1.generateCrudSingle)(generatorOptions, entity)];
            case 9:
                files = _d.sent();
                return [4 /*yield*/, (0, write_generated_files_1.writeGeneratedFiles)(files, { targetDirectory: generatorOptions.targetDirectory })];
            case 10:
                _d.sent();
                _d.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 5];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.generateFiles = generateFiles;
