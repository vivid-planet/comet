"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var createPublicGeneratedDirectory = function () {
    var generatedDirectory = "./.next/public.generated/";
    if (!fs_1.default.existsSync(generatedDirectory)) {
        console.log("\u2705 Successfully created temp directory: ".concat(generatedDirectory));
        fs_1.default.mkdirSync(generatedDirectory, { recursive: true });
    }
    return generatedDirectory;
};
exports.default = createPublicGeneratedDirectory;
