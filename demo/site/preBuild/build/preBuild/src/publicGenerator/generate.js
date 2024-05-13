"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var robots_txt_1 = __importDefault(require("./robots.txt"));
var sitemap_xml_1 = __importDefault(require("./sitemap.xml"));
var main = function () {
    // create static files before next build
    (0, robots_txt_1.default)();
    (0, sitemap_xml_1.default)();
};
main();
