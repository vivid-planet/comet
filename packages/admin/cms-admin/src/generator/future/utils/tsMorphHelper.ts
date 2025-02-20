import {
    type ArrayLiteralExpression,
    type ArrowFunction,
    type ExportedDeclarations,
    type Expression,
    type Identifier,
    type Node,
    type NumericLiteral,
    type ObjectLiteralExpression,
    Project,
    type PropertyAssignment,
    type SourceFile,
    type StringLiteral,
    SyntaxKind,
    type VariableDeclaration,
} from "ts-morph";

import { type GeneratorConfig } from "../generator";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
});
export function morphTsSource(path: string) {
    let tsSource = project.getSourceFile(path);
    if (!tsSource) tsSource = project.addSourceFileAtPath(path);
    return tsSource;
}

const supportedImportPaths = [
    "[type=grid].columns.filterOperators",
    "[type=grid].columns.block",
    "[type=grid].columns.component",
    // TODO implement in generator "[type=grid].columns.renderCell",
    "[type=form].fields.validate",
    "[type=form].fields.block",
    "[type=form].fields.component",
];
const supportedInlineCodePaths = [
    // TODO implement in generator "[type=grid].columns.filterOperators",
    "[type=grid].columns.renderCell",
    "[type=form].fields.validate",
];

export function configsFromSourceFile(sourceFile: SourceFile) {
    const configs: Record<string, GeneratorConfig> = {}; //TODO GeneratorConfig is not fully correct (runtime vs config mismatch)
    for (const [name, declarations] of Array.from(sourceFile.getExportedDeclarations().entries())) {
        //console.log(name);
        if (declarations.length != 1) {
            throw new Error(`Expected exactly one declaration for ${name}`);
        }
        const config = exportedDeclarationToJson(declarations[0]);
        //console.dir(config, { depth: 10 });
        configs[name] = config;
    }
    return configs;
}

function findUsedImports(node: Node) {
    const imports = [] as Array<{ name: string; import: string }>;
    node.getDescendantsOfKind(SyntaxKind.Identifier).forEach((identifier) => {
        for (const referencedSymbol of identifier.findReferences()) {
            for (const reference of referencedSymbol.getReferences()) {
                const referenceNode = reference.getNode();
                const importDeclaration = referenceNode.getFirstAncestorByKind(SyntaxKind.ImportDeclaration);
                if (importDeclaration) {
                    for (const namedImport of importDeclaration.getNamedImports()) {
                        if ((namedImport.getAliasNode() || namedImport.getNameNode())?.getText() == referenceNode.getText()) {
                            imports.push({
                                name: namedImport.getNameNode().getText(),
                                import: importDeclaration.getModuleSpecifierValue(),
                            });
                        }
                    }
                }
            }
        }
    });
    return imports;
}

function getTypePropertyFromObjectLiteral(node: ObjectLiteralExpression) {
    for (const property of (node as ObjectLiteralExpression).getProperties()) {
        if (property.getKind() == SyntaxKind.PropertyAssignment) {
            const propertyAssignment = property as PropertyAssignment;
            if (propertyAssignment.getName() == "type") {
                const propertyAssignmentInitializer = propertyAssignment.getInitializer();
                if (propertyAssignmentInitializer?.getKind() == SyntaxKind.StringLiteral) {
                    return (propertyAssignmentInitializer as StringLiteral).getLiteralValue();
                }
            }
        }
    }
    return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function astExpressionToJson(node: Expression, path: string): any {
    if (node.getKind() == SyntaxKind.ObjectLiteralExpression) {
        if (path == "") {
            // first entry of path is the type, then property names (. separated) are added
            const typeProperty = getTypePropertyFromObjectLiteral(node as ObjectLiteralExpression);
            path = typeProperty ? `[type=${typeProperty}]` : "";
        }
        const ret = {} as Record<string, unknown>;
        for (const property of (node as ObjectLiteralExpression).getProperties()) {
            if (property.getKind() == SyntaxKind.PropertyAssignment) {
                const propertyAssignment = property as PropertyAssignment;
                const propertyAssignmentInitializer = propertyAssignment.getInitializer();
                if (propertyAssignmentInitializer) {
                    ret[propertyAssignment.getName()] = astExpressionToJson(propertyAssignmentInitializer, `${path}.${propertyAssignment.getName()}`);
                } else {
                    throw new Error(`Initializer is required for propertyAssignment '${propertyAssignment.getName()}'`);
                }
            } else {
                throw new Error(`Unsupported ObjectLiteralExpression property Kind ${property.getKindName()}`);
            }
        }
        return ret;
    } else if (node.getKind() == SyntaxKind.StringLiteral) {
        return (node as StringLiteral).getLiteralValue();
    } else if (node.getKind() == SyntaxKind.NumericLiteral) {
        return (node as NumericLiteral).getLiteralValue();
    } else if (node.getKind() == SyntaxKind.FalseKeyword) {
        return false;
    } else if (node.getKind() == SyntaxKind.TrueKeyword) {
        return true;
    } else if (node.getKind() == SyntaxKind.BinaryExpression) {
        //what is this?
        return node.getText();
    } else if (node.getKind() == SyntaxKind.ArrowFunction) {
        if (supportedInlineCodePaths.includes(path)) {
            const body = (node as ArrowFunction).getBody();
            return {
                code: node.getText(),
                imports: findUsedImports(body),
            };
        } else {
            throw new Error(`Inline Function is not allowed here and calling the function is not supported: ${path}`);
        }
    } else if (node.getKind() == SyntaxKind.ArrayLiteralExpression) {
        const ret = [] as Array<unknown>;
        for (const element of (node as ArrayLiteralExpression).getElements()) {
            ret.push(astExpressionToJson(element, path));
        }
        return ret;
    } else if (node.getKind() == SyntaxKind.Identifier) {
        for (const referencedSymbol of (node as Identifier).findReferences()) {
            for (const reference of referencedSymbol.getReferences()) {
                const referenceNode = reference.getNode();
                const importDeclaration = referenceNode.getFirstAncestorByKind(SyntaxKind.ImportDeclaration);
                const variableDeclaration = referenceNode.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
                if (importDeclaration) {
                    for (const namedImport of importDeclaration.getNamedImports()) {
                        if ((namedImport.getAliasNode() || namedImport.getNameNode())?.getText() == referenceNode.getText()) {
                            if (supportedImportPaths.includes(path)) {
                                return {
                                    name: namedImport.getNameNode().getText(),
                                    import: importDeclaration.getModuleSpecifierValue(),
                                };
                            } else {
                                throw new Error(`Following the import is not supported: ${path} ${namedImport.getText()}`);
                            }
                        }
                    }
                } else if (variableDeclaration) {
                    if (variableDeclaration.getName() == node.getText()) {
                        const variableInitializer = variableDeclaration.getInitializer();
                        if (variableInitializer) {
                            return astExpressionToJson(variableInitializer, path);
                        } else {
                            throw new Error(`Initializer is required for variableDeclaration '${variableDeclaration.getName()}'`);
                        }
                    }
                }
            }
        }
        throw new Error(`Unsupported identifier '${node.getText()}', only imports and are variable declarations with initializer are supported`);
    } else {
        throw new Error(`Unsupported expression Kind ${node.getKindName()}`);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportedDeclarationToJson(node: ExportedDeclarations): any {
    if (node.getKind() == SyntaxKind.VariableDeclaration) {
        const variableDeclaration = node as VariableDeclaration;
        const initializer = variableDeclaration.getInitializer();
        if (initializer) {
            return astExpressionToJson(initializer, "");
        } else {
            throw new Error(`Initializer is required for variableDeclaration '${variableDeclaration.getName()}'`);
        }
    } else {
        throw new Error(`Unsupported declaration kind '${node.getKindName()}'`);
    }
}
