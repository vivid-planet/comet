import * as ts from "typescript";

const supportedImportPaths = [
    "[type=grid].columns.filterOperators",
    "[type=grid].columns.block",
    "[type=grid].columns.component",
    // TODO implement in generator "[type=grid].columns.renderCell",

    //support in up to 5 levels of nested fields (eg. fieldSet)
    ...Array.from(Array(5).keys()).map((i) => `[type=form]${".fields".repeat(i + 1)}.validate`),
    ...Array.from(Array(5).keys()).map((i) => `[type=form]${".fields".repeat(i + 1)}.block`),
    ...Array.from(Array(5).keys()).map((i) => `[type=form]${".fields".repeat(i + 1)}.component`),
];
const supportedInlineCodePaths = [
    // TODO implement in generator "[type=grid].columns.filterOperators",
    "[type=grid].columns.renderCell",

    //support in up to 5 levels of nested fields (eg. fieldSet)
    ...Array.from(Array(5).keys()).map((i) => `[type=form]${".fields".repeat(i + 1)}.validate`),
];

// transform the config file to replace all imports and inline code with a { code, imports } object
// this is needed to be able to execute the config file in a node environment
export function transformConfigFile(fileName: string, sourceText: string) {
    const sourceFile = ts.createSourceFile(
        fileName,
        sourceText,
        ts.ScriptTarget.ES2024, // language version
        true, // setParentNodes (useful for some traversals)
    );

    const importedIdentifiers = collectImports(sourceFile);

    function configTransformer(): ts.TransformerFactory<ts.Node> {
        return (context) => {
            const visit = (node: ts.Node, path: string): ts.Node => {
                if (ts.isArrowFunction(node)) {
                    if (supportedInlineCodePaths.includes(path)) {
                        let code = node.getText();
                        if (code.endsWith(",")) code = code.slice(0, -1); // for some unknown reason node can contain the trailing comma
                        const imports = findUsedImports(node.body, importedIdentifiers); //find all imports used in the function body
                        // replace inline code with { code, imports } object
                        return ts.factory.createObjectLiteralExpression(
                            [
                                ts.factory.createPropertyAssignment("code", ts.factory.createStringLiteral(code)),
                                ts.factory.createPropertyAssignment(
                                    "imports",
                                    ts.factory.createArrayLiteralExpression(
                                        imports.map((imprt) => {
                                            return ts.factory.createObjectLiteralExpression([
                                                ts.factory.createPropertyAssignment("name", ts.factory.createStringLiteral(imprt.name)),
                                                ts.factory.createPropertyAssignment("import", ts.factory.createStringLiteral(imprt.import)),
                                            ]);
                                        }),
                                    ),
                                ),
                            ],
                            true,
                        );
                    } else {
                        throw new Error(`Inline Function is not allowed here and calling the function is not supported: ${path}`);
                    }
                } else if (ts.isIdentifier(node)) {
                    const imported = importedIdentifiers.get(node.text);
                    if (imported) {
                        if (supportedImportPaths.includes(path)) {
                            // replace imported identifier with { name, import } object
                            return ts.factory.createObjectLiteralExpression(
                                [
                                    ts.factory.createPropertyAssignment("name", ts.factory.createStringLiteral(node.text)),
                                    ts.factory.createPropertyAssignment("import", ts.factory.createStringLiteral(imported.import)),
                                ],
                                true,
                            );
                        } else {
                            throw new Error(`Following the import is not supported: ${path} ${node.text}`);
                        }
                    }
                }

                const transformKinds = [
                    /*
                    OpenBraceToken = 19,
                    CloseBraceToken = 20,
                    OpenParenToken = 21,
                    CloseParenToken = 22,
                    OpenBracketToken = 23,
                    CloseBracketToken = 24,
                    DotToken = 25,
                    DotDotDotToken = 26,
                    SemicolonToken = 27,
                    CommaToken = 28,
                    QuestionDotToken = 29,
                    LessThanToken = 30,
                    LessThanSlashToken = 31,
                    GreaterThanToken = 32,
                    LessThanEqualsToken = 33,
                    GreaterThanEqualsToken = 34,
                    EqualsEqualsToken = 35,
                    ExclamationEqualsToken = 36,
                    EqualsEqualsEqualsToken = 37,
                    ExclamationEqualsEqualsToken = 38,
                    EqualsGreaterThanToken = 39,
                    PlusToken = 40,
                    MinusToken = 41,
                    AsteriskToken = 42,
                    AsteriskAsteriskToken = 43,
                    SlashToken = 44,
                    PercentToken = 45,
                    PlusPlusToken = 46,
                    MinusMinusToken = 47,
                    LessThanLessThanToken = 48,
                    GreaterThanGreaterThanToken = 49,
                    GreaterThanGreaterThanGreaterThanToken = 50,
                    AmpersandToken = 51,
                    BarToken = 52,
                    CaretToken = 53,
                    ExclamationToken = 54,
                    TildeToken = 55,
                    AmpersandAmpersandToken = 56,
                    BarBarToken = 57,
                    QuestionToken = 58,
                    ColonToken = 59,
                    AtToken = 60,
                    QuestionQuestionToken = 61,
                    BacktickToken = 62,
                    HashToken = 63,
                    EqualsToken = 64,
                    PlusEqualsToken = 65,
                    MinusEqualsToken = 66,
                    AsteriskEqualsToken = 67,
                    AsteriskAsteriskEqualsToken = 68,
                    SlashEqualsToken = 69,
                    PercentEqualsToken = 70,
                    LessThanLessThanEqualsToken = 71,
                    GreaterThanGreaterThanEqualsToken = 72,
                    GreaterThanGreaterThanGreaterThanEqualsToken = 73,
                    AmpersandEqualsToken = 74,
                    BarEqualsToken = 75,
                    BarBarEqualsToken = 76,
                    AmpersandAmpersandEqualsToken = 77,
                    QuestionQuestionEqualsToken = 78,
                    CaretEqualsToken = 79,
                    */
                    ts.SyntaxKind.Identifier,
                    /*
                    PrivateIdentifier = 81,
                    BreakKeyword = 83,
                    CaseKeyword = 84,
                    CatchKeyword = 85,
                    ClassKeyword = 86,
                    ConstKeyword = 87,
                    ContinueKeyword = 88,
                    DebuggerKeyword = 89,
                    DefaultKeyword = 90,
                    DeleteKeyword = 91,
                    DoKeyword = 92,
                    ElseKeyword = 93,
                    EnumKeyword = 94,
                    ExportKeyword = 95,
                    ExtendsKeyword = 96,
                    FalseKeyword = 97,
                    FinallyKeyword = 98,
                    ForKeyword = 99,
                    FunctionKeyword = 100,
                    IfKeyword = 101,
                    ImportKeyword = 102,
                    InKeyword = 103,
                    InstanceOfKeyword = 104,
                    NewKeyword = 105,
                    NullKeyword = 106,
                    ReturnKeyword = 107,
                    SuperKeyword = 108,
                    SwitchKeyword = 109,
                    ThisKeyword = 110,
                    ThrowKeyword = 111,
                    TrueKeyword = 112,
                    TryKeyword = 113,
                    TypeOfKeyword = 114,
                    VarKeyword = 115,
                    VoidKeyword = 116,
                    WhileKeyword = 117,
                    WithKeyword = 118,
                    ImplementsKeyword = 119,
                    InterfaceKeyword = 120,
                    LetKeyword = 121,
                    PackageKeyword = 122,
                    PrivateKeyword = 123,
                    ProtectedKeyword = 124,
                    PublicKeyword = 125,
                    StaticKeyword = 126,
                    YieldKeyword = 127,
                    AbstractKeyword = 128,
                    AccessorKeyword = 129,
                    AsKeyword = 130,
                    AssertsKeyword = 131,
                    AssertKeyword = 132,
                    AnyKeyword = 133,
                    AsyncKeyword = 134,
                    AwaitKeyword = 135,
                    BooleanKeyword = 136,
                    ConstructorKeyword = 137,
                    DeclareKeyword = 138,
                    GetKeyword = 139,
                    InferKeyword = 140,
                    IntrinsicKeyword = 141,
                    IsKeyword = 142,
                    KeyOfKeyword = 143,
                    ModuleKeyword = 144,
                    NamespaceKeyword = 145,
                    NeverKeyword = 146,
                    OutKeyword = 147,
                    ReadonlyKeyword = 148,
                    RequireKeyword = 149,
                    NumberKeyword = 150,
                    ObjectKeyword = 151,
                    SatisfiesKeyword = 152,
                    SetKeyword = 153,
                    StringKeyword = 154,
                    SymbolKeyword = 155,
                    TypeKeyword = 156,
                    UndefinedKeyword = 157,
                    UniqueKeyword = 158,
                    UnknownKeyword = 159,
                    UsingKeyword = 160,
                    FromKeyword = 161,
                    GlobalKeyword = 162,
                    BigIntKeyword = 163,
                    OverrideKeyword = 164,
                    OfKeyword = 165,
                    */
                    /*
                    QualifiedName = 166,
                    ComputedPropertyName = 167,
                    TypeParameter = 168,
                    Parameter = 169,
                    Decorator = 170,
                    PropertySignature = 171,
                    PropertyDeclaration = 172,
                    MethodSignature = 173,
                    MethodDeclaration = 174,
                    ClassStaticBlockDeclaration = 175,
                    Constructor = 176,
                    GetAccessor = 177,
                    SetAccessor = 178,
                    CallSignature = 179,
                    ConstructSignature = 180,
                    IndexSignature = 181,
                    TypePredicate = 182,
                    TypeReference = 183,
                    FunctionType = 184,
                    ConstructorType = 185,
                    TypeQuery = 186,
                    TypeLiteral = 187,
                    ArrayType = 188,
                    TupleType = 189,
                    OptionalType = 190,
                    RestType = 191,
                    UnionType = 192,
                    IntersectionType = 193,
                    ConditionalType = 194,
                    InferType = 195,
                    ParenthesizedType = 196,
                    ThisType = 197,
                    TypeOperator = 198,
                    IndexedAccessType = 199,
                    MappedType = 200,
                    LiteralType = 201,
                    NamedTupleMember = 202,
                    TemplateLiteralType = 203,
                    TemplateLiteralTypeSpan = 204,
                    ImportType = 205,
                    ObjectBindingPattern = 206,
                    ArrayBindingPattern = 207,
                    BindingElement = 208,
                    */
                    ts.SyntaxKind.ArrayLiteralExpression,
                    ts.SyntaxKind.ObjectLiteralExpression,
                    /*
                    PropertyAccessExpression = 211,
                    ElementAccessExpression = 212,
                    CallExpression = 213,
                    NewExpression = 214,
                    */
                    ts.SyntaxKind.TaggedTemplateExpression,
                    /*
                    TypeAssertionExpression = 216,
                    ParenthesizedExpression = 217,
                    FunctionExpression = 218,
                    ArrowFunction = 219,
                    DeleteExpression = 220,
                    TypeOfExpression = 221,
                    VoidExpression = 222,
                    AwaitExpression = 223,
                    PrefixUnaryExpression = 224,
                    PostfixUnaryExpression = 225,
                    BinaryExpression = 226,
                    ConditionalExpression = 227,
                    TemplateExpression = 228,
                    YieldExpression = 229,
                    */
                    ts.SyntaxKind.SpreadElement,
                    /*
                    ClassExpression = 231,
                    OmittedExpression = 232,
                    ExpressionWithTypeArguments = 233,
                    AsExpression = 234,
                    NonNullExpression = 235,
                    MetaProperty = 236,
                    SyntheticExpression = 237,
                    SatisfiesExpression = 238,
                    TemplateSpan = 239,
                    SemicolonClassElement = 240,
                    Block = 241,
                    EmptyStatement = 242,
                    VariableStatement = 243,
                    ExpressionStatement = 244,
                    IfStatement = 245,
                    DoStatement = 246,
                    WhileStatement = 247,
                    ForStatement = 248,
                    ForInStatement = 249,
                    ForOfStatement = 250,
                    ContinueStatement = 251,
                    BreakStatement = 252,
                    ReturnStatement = 253,
                    WithStatement = 254,
                    SwitchStatement = 255,
                    LabeledStatement = 256,
                    ThrowStatement = 257,
                    TryStatement = 258,
                    DebuggerStatement = 259,
                    VariableDeclaration = 260,
                    VariableDeclarationList = 261,
                    FunctionDeclaration = 262,
                    ClassDeclaration = 263,
                    InterfaceDeclaration = 264,
                    TypeAliasDeclaration = 265,
                    EnumDeclaration = 266,
                    ModuleDeclaration = 267,
                    ModuleBlock = 268,
                    CaseBlock = 269,
                    NamespaceExportDeclaration = 270,
                    ImportEqualsDeclaration = 271,
                    ImportDeclaration = 272,
                    ImportClause = 273,
                    NamespaceImport = 274,
                    NamedImports = 275,
                    ImportSpecifier = 276,
                    ExportAssignment = 277,
                    ExportDeclaration = 278,
                    NamedExports = 279,
                    NamespaceExport = 280,
                    ExportSpecifier = 281,
                    MissingDeclaration = 282,
                    ExternalModuleReference = 283,
                    JsxElement = 284,
                    JsxSelfClosingElement = 285,
                    JsxOpeningElement = 286,
                    JsxClosingElement = 287,
                    JsxFragment = 288,
                    JsxOpeningFragment = 289,
                    JsxClosingFragment = 290,
                    JsxAttribute = 291,
                    JsxAttributes = 292,
                    JsxSpreadAttribute = 293,
                    JsxExpression = 294,
                    JsxNamespacedName = 295,
                    CaseClause = 296,
                    DefaultClause = 297,
                    HeritageClause = 298,
                    CatchClause = 299,
                    ImportAttributes = 300,
                    ImportAttribute = 301,
                    */
                    ts.SyntaxKind.PropertyAssignment,
                    ts.SyntaxKind.ShorthandPropertyAssignment,
                    /*
                    SpreadAssignment = 305,
                    EnumMember = 306,
                    SourceFile = 307,
                    Bundle = 308,
                    JSDocTypeExpression = 309,
                    JSDocNameReference = 310,
                    JSDocMemberName = 311,
                    JSDocAllType = 312,
                    JSDocUnknownType = 313,
                    JSDocNullableType = 314,
                    JSDocNonNullableType = 315,
                    JSDocOptionalType = 316,
                    JSDocFunctionType = 317,
                    JSDocVariadicType = 318,
                    JSDocNamepathType = 319,
                    JSDoc = 320,
                    JSDocComment = 320,
                    JSDocText = 321,
                    JSDocTypeLiteral = 322,
                    JSDocSignature = 323,
                    JSDocLink = 324,
                    JSDocLinkCode = 325,
                    JSDocLinkPlain = 326,
                    JSDocTag = 327,
                    JSDocAugmentsTag = 328,
                    JSDocImplementsTag = 329,
                    JSDocAuthorTag = 330,
                    JSDocDeprecatedTag = 331,
                    JSDocClassTag = 332,
                    JSDocPublicTag = 333,
                    JSDocPrivateTag = 334,
                    JSDocProtectedTag = 335,
                    JSDocReadonlyTag = 336,
                    JSDocOverrideTag = 337,
                    JSDocCallbackTag = 338,
                    JSDocOverloadTag = 339,
                    JSDocEnumTag = 340,
                    JSDocParameterTag = 341,
                    JSDocReturnTag = 342,
                    JSDocThisTag = 343,
                    JSDocTypeTag = 344,
                    JSDocTemplateTag = 345,
                    JSDocTypedefTag = 346,
                    JSDocSeeTag = 347,
                    JSDocPropertyTag = 348,
                    JSDocThrowsTag = 349,
                    JSDocSatisfiesTag = 350,
                    JSDocImportTag = 351,
                    SyntaxList = 352,
                    NotEmittedStatement = 353,
                    NotEmittedTypeElement = 354,
                    PartiallyEmittedExpression = 355,
                    CommaListExpression = 356,
                    SyntheticReferenceExpression = 357,
                    Count = 358,
                    FirstAssignment = 64,
                    LastAssignment = 79,
                    FirstCompoundAssignment = 65,
                    LastCompoundAssignment = 79,
                    FirstReservedWord = 83,
                    LastReservedWord = 118,
                    FirstKeyword = 83,
                    LastKeyword = 165,
                    FirstFutureReservedWord = 119,
                    LastFutureReservedWord = 127,
                    FirstTypeNode = 182,
                    LastTypeNode = 205,
                    FirstPunctuation = 19,
                    LastPunctuation = 79,
                    FirstToken = 0,
                    LastToken = 165,
                    FirstTriviaToken = 2,
                    LastTriviaToken = 7,
                    FirstLiteralToken = 9,
                    LastLiteralToken = 15,
                    FirstTemplateToken = 15,
                    LastTemplateToken = 18,
                    FirstBinaryOperator = 30,
                    LastBinaryOperator = 79,
                    FirstStatement = 243,
                    LastStatement = 259,
                    FirstNode = 166,
                    FirstJSDocNode = 309,
                    LastJSDocNode = 351,
                    FirstJSDocTagNode = 327,
                    LastJSDocTagNode = 351,
                    */
                ];
                if (!transformKinds.includes(node.kind)) {
                    // if the node is not one of the transformKinds, stop transformation at this level return it as is
                    return node;
                }
                let newPath = path;
                if (path == "") {
                    // first entry of path is the type, then property names (. separated) are added
                    if (ts.isObjectLiteralExpression(node)) {
                        const typeProperty = getTypePropertyFromObjectLiteral(node);
                        newPath = typeProperty ? `[type=${typeProperty}]` : "";
                    }
                } else {
                    if (ts.isPropertyAssignment(node)) {
                        newPath = `${path}.${node.name.getText()}`;
                    }
                }
                return ts.visitEachChild(
                    node,
                    (child) => {
                        return visit(child, newPath);
                    },
                    context,
                );
            };
            return (node: ts.Node) => ts.visitNode(node, (child) => visit(child, ""));
        };
    }

    const configNode = findConfigNode(sourceFile);
    const transformedConfigNode = ts.transform(configNode, [configTransformer()]).transformed[0];

    const updatedSource = ts.transform(sourceFile, [
        (context) => {
            const visitor: ts.Visitor = (node) => {
                if (node === configNode) return transformedConfigNode;
                return ts.visitEachChild(node, visitor, context);
            };
            return (node: ts.SourceFile) => ts.visitNode(node, visitor) as ts.SourceFile;
        },
    ]).transformed[0] as ts.SourceFile;

    const printer = ts.createPrinter();
    return printer.printFile(updatedSource);
}

// finds the config node in the source file (=default export, might be wrapped in defineConfig or uses satisfies)
function findConfigNode(sourceFile: ts.SourceFile): ts.Node {
    let ret: ts.Node | undefined;
    sourceFile.forEachChild((node) => {
        if (ts.isExportAssignment(node)) {
            const exportedNode = node.expression;
            if (ts.isCallExpression(exportedNode) && exportedNode.expression.getText() == "defineConfig") {
                //export default defineConfig<Foo>({ ... });
                const args = exportedNode.arguments;
                if (args.length != 1) {
                    throw new Error(`Expected exactly one argument for defineConfig`);
                }
                ret = args[0];
                return false;
            } else if (ts.isSatisfiesExpression(exportedNode)) {
                //export default { ... } satisfies GeneratorConfig<Foo>;
                if (ts.isObjectLiteralExpression(exportedNode.expression)) {
                    ret = exportedNode.expression;
                    return false;
                }
            } else if (ts.isObjectLiteralExpression(exportedNode)) {
                //export default { ... };
                ret = exportedNode;
                return false;
            }
        }
    });
    if (!ret) {
        throw new Error(`No default export found, please export the GeneratorConfig as default, preferrable using defineConfig helper.`);
    }
    return ret;
}

// simple helper that extracts the value of the type property from a object literal ({ type: "grid" } returns "grid")
function getTypePropertyFromObjectLiteral(node: ts.ObjectLiteralExpression) {
    for (const property of node.properties) {
        if (ts.isPropertyAssignment(property)) {
            if (property.name.getText() == "type") {
                const propertyAssignmentInitializer = property.initializer;
                if (ts.isStringLiteral(propertyAssignmentInitializer)) {
                    return propertyAssignmentInitializer.text;
                }
            }
        }
    }
    return null;
}

// visits ast and collects all imports statements in the source file
function collectImports(rootNode: ts.Node) {
    const importedIdentifiers = new Map<string, { name: string; import: string }>();

    function visit(node: ts.Node) {
        if (
            ts.isImportDeclaration(node) &&
            node.importClause &&
            node.importClause.namedBindings &&
            ts.isNamedImports(node.importClause.namedBindings)
        ) {
            const moduleSpecifier = (node.moduleSpecifier as ts.StringLiteral).text;
            for (const element of node.importClause.namedBindings.elements) {
                const localName = element.name.text;
                const originalName = element.propertyName ? element.propertyName.text : localName;
                importedIdentifiers.set(localName, {
                    name: originalName,
                    import: moduleSpecifier,
                });
            }
        }
        ts.forEachChild(node, visit);
    }
    visit(rootNode);
    return importedIdentifiers;
}

// visits ast and collects all identifiers that are an import
function findUsedImports(rootNode: ts.Node, importedIdentifiers: Map<string, { name: string; import: string }>) {
    const imports: { name: string; import: string }[] = [];
    const usedNames = new Set<string>();

    // Collect all identifiers used in the rootNode
    function collectUsedIdentifiers(node: ts.Node) {
        if (ts.isIdentifier(node)) {
            usedNames.add(node.text);
        }
        ts.forEachChild(node, collectUsedIdentifiers);
    }
    collectUsedIdentifiers(rootNode);

    // Match used identifiers to imported ones
    // NOTE: this is not 100% correct as it doesn't recognize cases where a import is overwritten by a local variable. But it is fast.
    for (const name of usedNames) {
        const imported = importedIdentifiers.get(name);
        if (imported) {
            imports.push(imported);
        }
    }

    return imports;
}
