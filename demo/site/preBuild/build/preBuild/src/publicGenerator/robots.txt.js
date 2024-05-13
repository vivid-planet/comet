"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var createPublicGeneratedDirectory_1 = __importDefault(require("./createPublicGeneratedDirectory"));
var robotsTxt = function () {
    var generatedDirectory = (0, createPublicGeneratedDirectory_1.default)();
    var robots = "User-agent: * \nSitemap: ".concat(process.env.SITE_URL, "/sitemap.xml");
    var filePath = "".concat(generatedDirectory, "robots.txt");
    fs_1.default.writeFileSync(filePath, robots);
    console.log("\u2705 Successfully created robots.txt: ".concat(filePath));
};
exports.default = robotsTxt;
