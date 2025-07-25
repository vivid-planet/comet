import { promises as fs } from "fs";
import * as path from "path";
import ts from "typescript";

export async function writeGeneratedFile(filePath: string, contents: string): Promise<void> {
    const header = `// This file has been generated by comet api-generator.
    // You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
    `;
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const sourceFile = ts.createSourceFile(filePath, header + contents, ts.ScriptTarget.ES2024, true, ts.ScriptKind.TS);
    const result = ts.transform(sourceFile, [removeUnusedImports()]);
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
        removeComments: false,
    });
    const prettyCode = printer.printFile(result.transformed[0]);
    result.dispose();

    await fs.writeFile(filePath, prettyCode);
    console.log(`generated ${filePath}`);
}

export function removeUnusedImports(): ts.TransformerFactory<ts.SourceFile> {
    return (context) => {
        function visit(sourceFile: ts.SourceFile): ts.SourceFile {
            const usedIdentifiers = new Set<string>();

            // Step 1: Collect all used identifiers
            function collectUsage(node: ts.Node) {
                if (ts.isIdentifier(node)) {
                    usedIdentifiers.add(node.text);
                } else if (ts.isImportDeclaration(node)) {
                    // Skip import declarations (those identifiers are not usages)
                    return;
                }
                ts.forEachChild(node, collectUsage);
            }
            ts.forEachChild(sourceFile, collectUsage);

            // Step 2: Visit and update the import declarations
            function visitor(node: ts.Node): ts.Node | ts.Node[] | undefined {
                if (ts.isImportDeclaration(node) && node.importClause) {
                    const { name, namedBindings } = node.importClause;

                    const updatedBindings: ts.ImportSpecifier[] = [];

                    if (name && usedIdentifiers.has(name.text)) {
                        // default import is used
                    } else if (name) {
                        // default import is unused
                        return undefined;
                    }

                    if (namedBindings && ts.isNamedImports(namedBindings)) {
                        for (const specifier of namedBindings.elements) {
                            const importName = specifier.name.text;
                            if (usedIdentifiers.has(importName)) {
                                updatedBindings.push(specifier);
                            }
                        }

                        if (updatedBindings.length === 0 && !name) {
                            // nothing left in this import
                            return undefined;
                        }

                        return ts.factory.updateImportDeclaration(
                            node,
                            node.modifiers,
                            ts.factory.updateImportClause(
                                node.importClause,
                                node.importClause.isTypeOnly,
                                name,
                                updatedBindings.length > 0 ? ts.factory.updateNamedImports(namedBindings, updatedBindings) : undefined,
                            ),
                            node.moduleSpecifier,
                            node.assertClause,
                        );
                    }

                    if (!namedBindings && !name) {
                        // empty import, probably a side-effect import
                        return node;
                    }

                    return node;
                }

                return ts.visitEachChild(node, visitor, context);
            }

            return ts.visitNode(sourceFile, visitor) as ts.SourceFile;
        }

        return (sourceFile) => visit(sourceFile);
    };
}
