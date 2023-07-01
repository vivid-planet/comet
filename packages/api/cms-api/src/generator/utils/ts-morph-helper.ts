import { EntityMetadata } from "@mikro-orm/core";
import * as path from "path";
import { ModuleKind, Project } from "ts-morph";

/* eslint-disable @typescript-eslint/no-explicit-any */

const project = new Project({
    compilerOptions: {
        strictNullChecks: true,
        module: ModuleKind.Node16,
    },
});
function morphTsSource(metadata: EntityMetadata<any>) {
    let tsSource = project.getSourceFile(metadata.path);
    if (!tsSource) tsSource = project.addSourceFileAtPath(metadata.path);
    return tsSource;
}

function morphTsClass(metadata: EntityMetadata<any>) {
    const tsSource = morphTsSource(metadata);
    const tsClass = tsSource.getClass(metadata.className);
    if (!tsClass) throw new Error(`Class ${metadata.className} not found in ${metadata.path}`);
    return tsClass;
}
function morphTsProperty(metadata: EntityMetadata<any>, name: string) {
    const tsClass = morphTsClass(metadata);
    const tsProp = tsClass.getInstanceProperties().find((i) => i.getName() == name);
    if (!tsProp) throw new Error("property not found");
    return tsProp;
}

function findImportPath(importName: string, generatorOptions: { targetDirectory: string }, metadata: EntityMetadata<any>) {
    const tsSource = morphTsSource(metadata);
    for (const tsImport of tsSource.getImportDeclarations()) {
        for (const namedImport of tsImport.getNamedImports()) {
            if (namedImport.getAliasNode()?.getText() == importName) {
                throw new Error("Aliased enum import is not supported");
            }
            if (namedImport.getNameNode().getText() == importName) {
                const importPath = tsImport.getModuleSpecifierValue();
                if (importPath.startsWith("./") || importPath.startsWith("../")) {
                    const absolutePath = path.resolve(path.dirname(metadata.path), importPath);
                    return path.relative(`${generatorOptions.targetDirectory}/dto`, absolutePath);
                } else {
                    return importPath;
                }
            }
        }
    }
    throw new Error(`${importName} import not found in ${metadata.path}`);
}

export function findEnumName(propertyName: string, metadata: EntityMetadata<any>) {
    const tsProp = morphTsProperty(metadata, propertyName);
    return tsProp.getType().getText(tsProp);
}

export function findEnumImportPath(enumName: string, generatorOptions: { targetDirectory: string }, metadata: EntityMetadata<any>) {
    const tsSource = morphTsSource(metadata);
    let importPath: string;
    if (tsSource.getEnum(enumName)) {
        //enum defined in same file as entity
        if (!tsSource.getEnum(enumName)?.isExported()) {
            throw new Error(`Enum ${enumName} is not exported in ${metadata.path}`);
        }
        importPath = path.relative(`${generatorOptions.targetDirectory}/dto`, metadata.path).replace(/\.ts$/, "");
    } else {
        //try to find import where enum is imported from
        importPath = findImportPath(enumName, generatorOptions, metadata);
    }
    return importPath;
}

export function findBlockName(propertyName: string, metadata: EntityMetadata<any>) {
    const tsProp = morphTsProperty(metadata, propertyName);
    if (!tsProp) throw new Error("property not found");
    const rootBlockDecorator = tsProp.getDecorators().find((i) => i.getName() == "RootBlock");
    if (!rootBlockDecorator) throw new Error(`RootBlock decorator not found for property ${propertyName}`);
    return rootBlockDecorator.getArguments()[0].getText();
}

export function findBlockImportPath(blockName: string, generatorOptions: { targetDirectory: string }, metadata: EntityMetadata<any>) {
    const tsSource = morphTsSource(metadata);

    let importPath: string;
    if (tsSource.getVariableDeclaration(blockName)) {
        //block defined in same file as entity
        if (!tsSource.getVariableDeclaration(blockName)?.isExported()) {
            throw new Error(`Block ${blockName} is not exported in ${metadata.path}`);
        }
        importPath = path.relative(`${generatorOptions.targetDirectory}/dto`, metadata.path).replace(/\.ts$/, "");
    } else {
        //try to find import where block is imported from
        importPath = findImportPath(blockName, generatorOptions, metadata);
    }
    return importPath;
}
