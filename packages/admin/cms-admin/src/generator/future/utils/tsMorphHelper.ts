import {
    ArrayLiteralExpression,
    ArrowFunction,
    ExportedDeclarations,
    Expression,
    Identifier,
    Node,
    NumericLiteral,
    ObjectLiteralExpression,
    Project,
    PropertyAssignment,
    StringLiteral,
    SyntaxKind,
    VariableDeclaration,
} from "ts-morph";

import { Imports } from "./generateImportsCode";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
});
export function morphTsSource(path: string) {
    let tsSource = project.getSourceFile(path);
    if (!tsSource) tsSource = project.addSourceFileAtPath(path);
    return tsSource;
}

function findUsedImports(node: Node) {
    const imports = [] as Imports;
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
                                importPath: importDeclaration.getModuleSpecifierValue(),
                            });
                        }
                    }
                }
            }
        }
    });
    return imports;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function astExpressionToJson(node: Expression): any {
    if (node.getKind() == SyntaxKind.ObjectLiteralExpression) {
        const ret = {} as Record<string, unknown>;
        for (const property of (node as ObjectLiteralExpression).getProperties()) {
            if (property.getKind() == SyntaxKind.PropertyAssignment) {
                const propertyAssignment = property as PropertyAssignment;
                const propertyAssignmentInitializer = propertyAssignment.getInitializer();
                if (propertyAssignmentInitializer) {
                    ret[propertyAssignment.getName()] = astExpressionToJson(propertyAssignmentInitializer);
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
        const body = (node as ArrowFunction).getBody();
        return {
            code: node.getText(),
            imports: findUsedImports(body),
        };
    } else if (node.getKind() == SyntaxKind.ArrayLiteralExpression) {
        const ret = [] as Array<unknown>;
        for (const element of (node as ArrayLiteralExpression).getElements()) {
            ret.push(astExpressionToJson(element));
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
                            return {
                                name: namedImport.getNameNode().getText(),
                                import: importDeclaration.getModuleSpecifierValue(),
                            };
                        }
                    }
                } else if (variableDeclaration) {
                    if (variableDeclaration.getName() == node.getText()) {
                        const variableInitializer = variableDeclaration.getInitializer();
                        if (variableInitializer) {
                            return astExpressionToJson(variableInitializer);
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
            return astExpressionToJson(initializer);
        } else {
            throw new Error(`Initializer is required for variableDeclaration '${variableDeclaration.getName()}'`);
        }
    } else {
        throw new Error(`Unsupported declaration kind '${node.getKindName()}'`);
    }
}
