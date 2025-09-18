"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.morphTsProperty = morphTsProperty;
exports.findImportPath = findImportPath;
exports.findEnumName = findEnumName;
exports.findEnumImportPath = findEnumImportPath;
exports.findValidatorImportPath = findValidatorImportPath;
exports.findBlockName = findBlockName;
exports.findBlockImportPath = findBlockImportPath;
exports.findInputClassImportPath = findInputClassImportPath;
exports.getFieldDecoratorClassName = getFieldDecoratorClassName;
var path = require("path");
var ts_morph_1 = require("ts-morph");
/* eslint-disable @typescript-eslint/no-explicit-any */
var project = new ts_morph_1.Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
});
function morphTsSource(metadata) {
    var tsSource = project.getSourceFile(metadata.path);
    if (!tsSource)
        tsSource = project.addSourceFileAtPath(metadata.path);
    return tsSource;
}
function morphTsClass(metadata) {
    var tsSource = morphTsSource(metadata);
    var tsClass = tsSource.getClass(metadata.className);
    if (!tsClass)
        throw new Error("Class ".concat(metadata.className, " not found in ").concat(metadata.path));
    return tsClass;
}
function morphTsProperty(name, metadata) {
    var currentClass = morphTsClass(metadata);
    while (currentClass) {
        var prop = currentClass.getProperty(name);
        if (prop)
            return prop;
        currentClass = currentClass.getBaseClass();
    }
    throw new Error("Property ".concat(name, " not found in ").concat(metadata.className));
}
function findImportPath(importName, targetDirectory, metadata) {
    var _a;
    var tsSource = morphTsSource(metadata);
    for (var _i = 0, _b = tsSource.getImportDeclarations(); _i < _b.length; _i++) {
        var tsImport = _b[_i];
        for (var _c = 0, _d = tsImport.getNamedImports(); _c < _d.length; _c++) {
            var namedImport = _d[_c];
            if (((_a = namedImport.getAliasNode()) === null || _a === void 0 ? void 0 : _a.getText()) == importName) {
                throw new Error("Aliased enum import is not supported");
            }
            if (namedImport.getNameNode().getText() == importName) {
                var importPath = tsImport.getModuleSpecifierValue();
                var importSource = tsImport.getModuleSpecifierSourceFile();
                if (!importSource) {
                    throw new Error("Can't resolve import ".concat(importPath));
                }
                var exportedDeclarations = importSource.getExportedDeclarations().get(importName);
                if (!exportedDeclarations)
                    throw new Error("Can't get exported declaration for ".concat(importName));
                var exportedDeclaration = exportedDeclarations[0];
                if (importPath.startsWith("./") || importPath.startsWith("../")) {
                    var absolutePath = path.resolve(path.dirname(metadata.path), importPath);
                    return {
                        importPath: path.relative(targetDirectory, absolutePath),
                        exportedDeclaration: exportedDeclaration,
                    };
                }
                else {
                    return { importPath: importPath, exportedDeclaration: exportedDeclaration };
                }
            }
        }
    }
    return {
        importPath: null,
        exportedDeclaration: undefined,
    };
}
function findImportPathOrThrow(importName, targetDirectory, metadata) {
    var ret = findImportPath(importName, targetDirectory, metadata);
    if (!ret.importPath) {
        throw new Error("".concat(importName, " import not found in ").concat(metadata.path));
    }
    return ret;
}
function findEnumName(propertyName, metadata) {
    var tsProp = morphTsProperty(propertyName, metadata);
    return tsProp
        .getType()
        .getText(tsProp)
        .replace(/ ?\| ?undefined$/, "")
        .replace(/\[\]$/, "");
}
function findEnumImportPath(enumName, targetDirectory, metadata) {
    var _a;
    var tsSource = morphTsSource(metadata);
    if (tsSource.getEnum(enumName)) {
        //enum defined in same file as entity
        if (!((_a = tsSource.getEnum(enumName)) === null || _a === void 0 ? void 0 : _a.isExported())) {
            throw new Error("Enum ".concat(enumName, " is not exported in ").concat(metadata.path));
        }
        return path.relative(targetDirectory, metadata.path).replace(/\.ts$/, "");
    }
    else {
        //try to find import where enum is imported from
        var importPath = findImportPathOrThrow(enumName, targetDirectory, metadata).importPath;
        return importPath;
    }
}
function findValidatorImportPath(validatorName, generatorOptions, metadata) {
    var _a, _b;
    var tsSource = morphTsSource(metadata);
    //validator defined in same file as entity
    if (tsSource.getVariableDeclaration(validatorName) || tsSource.getFunction(validatorName)) {
        if (!(((_a = tsSource.getVariableDeclaration(validatorName)) === null || _a === void 0 ? void 0 : _a.isExported()) || ((_b = tsSource.getFunction(validatorName)) === null || _b === void 0 ? void 0 : _b.isExported()))) {
            throw new Error("Validator ".concat(validatorName, " is not exported in ").concat(metadata.path));
        }
        return path.relative("".concat(generatorOptions.targetDirectory, "/dto"), metadata.path).replace(/\.ts$/, "");
    }
    else {
        var importPath = findImportPathOrThrow(validatorName, generatorOptions.targetDirectory, metadata).importPath;
        return importPath;
    }
}
function findBlockName(propertyName, metadata) {
    var tsProp = morphTsProperty(propertyName, metadata);
    if (!tsProp)
        throw new Error("property not found");
    var rootBlockDecorator = tsProp.getDecorators().find(function (i) { return i.getName() == "RootBlock"; });
    if (!rootBlockDecorator)
        throw new Error("RootBlock decorator not found for property ".concat(propertyName));
    return rootBlockDecorator.getArguments()[0].getText();
}
function findBlockImportPath(blockName, targetDirectory, metadata) {
    var _a;
    var tsSource = morphTsSource(metadata);
    if (tsSource.getVariableDeclaration(blockName)) {
        //block defined in same file as entity
        if (!((_a = tsSource.getVariableDeclaration(blockName)) === null || _a === void 0 ? void 0 : _a.isExported())) {
            throw new Error("Block ".concat(blockName, " is not exported in ").concat(metadata.path));
        }
        return path.relative(targetDirectory, metadata.path).replace(/\.ts$/, "");
    }
    else {
        //try to find import where block is imported from
        var importPath = findImportPathOrThrow(blockName, targetDirectory, metadata).importPath;
        return importPath;
    }
}
function findInputClassImportPath(className, targetDirectory, metadata) {
    var _a;
    var tsSource = morphTsSource(metadata);
    var returnImportPath;
    var classDeclaration;
    if (tsSource.getClass(className)) {
        //block defined in same file as entity
        if (!((_a = tsSource.getClass(className)) === null || _a === void 0 ? void 0 : _a.isExported())) {
            throw new Error("Class ".concat(className, " is not exported in ").concat(metadata.path));
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        classDeclaration = tsSource.getClass(className);
        returnImportPath = path.relative(targetDirectory, metadata.path).replace(/\.ts$/, "");
    }
    else {
        //try to find import where block is imported from
        var _b = findImportPathOrThrow(className, targetDirectory, metadata), importPath = _b.importPath, exportedDeclaration = _b.exportedDeclaration;
        if (!(exportedDeclaration instanceof ts_morph_1.ClassDeclaration)) {
            throw new Error("Exported declaration for ".concat(className, " is not a class"));
        }
        classDeclaration = exportedDeclaration;
        returnImportPath = importPath;
    }
    if (!classDeclaration.getDecorators().some(function (i) { return i.getName() == "InputType"; })) {
        throw new Error("Exported declaration for ".concat(className, " is not decorated with @InputType"));
    }
    return returnImportPath;
}
function getFieldDecoratorClassName(propertyName, metadata) {
    var definedDecorators = morphTsProperty(propertyName, metadata).getDecorators();
    var fieldDecorator = definedDecorators.find(function (decorator) { return decorator.getName() == "Field"; });
    if (!fieldDecorator) {
        return false;
    }
    var typeFnArg = fieldDecorator.getArguments()[0];
    if (!typeFnArg)
        throw new Error("".concat(propertyName, ": @Field is missing argument"));
    if (typeFnArg.getKind() != ts_morph_1.SyntaxKind.ArrowFunction)
        throw new Error("".concat(propertyName, ": @Field first argument must be an ArrowFunction"));
    var typeReturningArrowFunction = typeFnArg;
    var body = typeReturningArrowFunction.getBody();
    if (body.getKind() != ts_morph_1.SyntaxKind.Identifier)
        throw new Error("".concat(propertyName, ": @Field first argument must be an ArrowFunction returning an Identifier"));
    var identifier = body;
    var className = identifier.getText();
    return className;
}
