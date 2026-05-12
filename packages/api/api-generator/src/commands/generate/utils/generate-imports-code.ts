export type Imports = Array<{
    name: string;
    importPath: string;
}>;

// generate imports code and filter duplicates
export function generateImportsCode(imports: Imports): string {
    const importsNameToPath: Map<string, string> = new Map(); // name -> importPath
    const filteredImports = imports.filter((imp) => {
        if (importsNameToPath.has(imp.name)) {
            if (importsNameToPath.get(imp.name) !== imp.importPath) {
                throw new Error(
                    `Duplicate import name ${imp.name} with different importPaths: ${imp.importPath} vs ${importsNameToPath.get(imp.name)}`,
                );
            } else {
                // duplicate import, skip
                return false;
            }
        }
        importsNameToPath.set(imp.name, imp.importPath);
        return true;
    });

    const importsPathToName: Record<string, string[]> = {};
    for (const imp of filteredImports) {
        if (!importsPathToName[imp.importPath]) {
            importsPathToName[imp.importPath] = [];
        }
        importsPathToName[imp.importPath].push(imp.name);
    }

    let importsString = "";
    for (const [importPath, importNames] of Object.entries(importsPathToName)) {
        importsString += `import { ${importNames.sort().join(", ")} } from "${importPath}";\n`;
    }
    return importsString;
}
