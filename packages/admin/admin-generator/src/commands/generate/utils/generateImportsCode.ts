export type Imports = Array<{
    name: string;
    importPath: string;
    defaultImport?: boolean;
}>;

// generate imports code and filter duplicates
export function generateImportsCode(imports: Imports): string {
    const importsNameToPath: Map<string, string> = new Map(); // name -> importPath
    const filteredImports = imports.filter((imp) => {
        if (importsNameToPath.has(imp.name)) {
            if (importsNameToPath.get(imp.name) !== imp.importPath) {
                throw new Error(`Duplicate import name ${imp.name}`);
            } else {
                // duplicate import, skip
                return false;
            }
        }
        importsNameToPath.set(imp.name, imp.importPath);
        return true;
    });

    const importsString = filteredImports
        .map((imp) => {
            if (imp.defaultImport) {
                return `import ${imp.name} from "${imp.importPath}";`;
            } else {
                return `import { ${imp.name} } from "${imp.importPath}";`;
            }
        })
        .join("\n");
    return importsString;
}
