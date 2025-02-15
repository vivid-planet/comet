import {
    ArrayLiteralExpression,
    ExportedDeclarations,
    Expression,
    Identifier,
    NumericLiteral,
    ObjectLiteralExpression,
    Project,
    PropertyAssignment,
    StringLiteral,
    SyntaxKind,
    VariableDeclaration,
} from "ts-morph";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
    skipAddingFilesFromTsConfig: true,
});
export function morphTsSource(path: string) {
    let tsSource = project.getSourceFile(path);
    if (!tsSource) tsSource = project.addSourceFileAtPath(path);
    return tsSource;
}

function astExpressionToJson(node: Expression) {
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
        return {
            code: node.getText(),
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
                if (importDeclaration) {
                    for (const namedImport of importDeclaration.getNamedImports()) {
                        if ((namedImport.getAliasNode() || namedImport.getNameNode())?.getText() == referenceNode.getText()) {
                            return {
                                name: namedImport.getNameNode().getText(),
                                import: importDeclaration.getModuleSpecifierValue(),
                            };
                        }
                    }
                }
            }
        }
        throw new Error(`Unsupported identifier, only imports are supported`);
    } else {
        throw new Error(`Unsupported expression Kind ${node.getKindName()}`);
    }
}

export function exportedDeclarationToJson(node: ExportedDeclarations) {
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
