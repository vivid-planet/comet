"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImportsCode = generateImportsCode;
// generate imports code and filter duplicates
function generateImportsCode(imports) {
    var importsNameToPath = new Map(); // name -> importPath
    var filteredImports = imports.filter(function (imp) {
        if (importsNameToPath.has(imp.name)) {
            if (importsNameToPath.get(imp.name) !== imp.importPath) {
                throw new Error("Duplicate import name ".concat(imp.name));
            }
            else {
                // duplicate import, skip
                return false;
            }
        }
        importsNameToPath.set(imp.name, imp.importPath);
        return true;
    });
    var importsPathToName = {};
    for (var _i = 0, filteredImports_1 = filteredImports; _i < filteredImports_1.length; _i++) {
        var imp = filteredImports_1[_i];
        if (!importsPathToName[imp.importPath]) {
            importsPathToName[imp.importPath] = [];
        }
        importsPathToName[imp.importPath].push(imp.name);
    }
    var importsString = "";
    for (var _a = 0, _b = Object.entries(importsPathToName); _a < _b.length; _a++) {
        var _c = _b[_a], importPath = _c[0], importNames = _c[1];
        importsString += "import { ".concat(importNames.sort().join(", "), " } from \"").concat(importPath, "\";\n");
    }
    return importsString;
}
