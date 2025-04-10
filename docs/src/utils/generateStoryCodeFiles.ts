import * as fs from "fs";
import { existsSync, rmSync } from "fs";
import * as path from "path";
import * as prettier from "prettier";
import { Project, SyntaxKind, ts, VariableStatement } from "ts-morph";

const STORIES_DIR = path.resolve(process.cwd(), "../storybook/src/component-docs");
const OUTPUT_DIR = path.resolve(process.cwd(), "src/generated");

if (existsSync(OUTPUT_DIR)) {
    rmSync(OUTPUT_DIR, { recursive: true });
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const project = new Project({
    compilerOptions: {
        jsx: ts.JsxEmit.React,
    },
});

const storyFiles = fs
    .readdirSync(STORIES_DIR)
    .filter((file) => file.endsWith(".stories.tsx"))
    .map((file) => path.join(STORIES_DIR, file));

storyFiles.forEach((file) => project.addSourceFileAtPath(file));

storyFiles.forEach(async (storyFilePath) => {
    const sourceFile = project.getSourceFile(storyFilePath);
    if (!sourceFile) {
        console.error(`Could not find source file: ${storyFilePath}`);
        return;
    }

    const componentName = path.basename(storyFilePath).replace(".stories.tsx", "");

    const exportedVariables = sourceFile.getVariableDeclarations().filter((variable) => {
        const variableStatement = variable.getParent()?.getParent();
        if (variableStatement && variableStatement.getKind() === SyntaxKind.VariableStatement) {
            const statement = variableStatement as VariableStatement;
            return statement.getModifiers()?.some((modifier) => modifier.getKind() === SyntaxKind.ExportKeyword);
        }
        return false;
    });

    const prettierConfig = await prettier.resolveConfig(process.cwd());

    for (const variable of exportedVariables) {
        const storyName = variable.getName();
        if (storyName === "default") continue;

        const jsxCode = variable
            .getInitializer()
            .asKind(SyntaxKind.ObjectLiteralExpression)
            .getProperty("render")
            .getFirstDescendantByKind(SyntaxKind.ArrowFunction)
            .getFirstDescendantByKind(SyntaxKind.ReturnStatement)
            .getExpression()
            .getText();

        const formattedJsxCode = prettier.format(jsxCode, {
            ...prettierConfig,
            parser: "typescript",
        });

        let cleanedJsxCode = formattedJsxCode;
        if (cleanedJsxCode.trim().endsWith(";")) {
            cleanedJsxCode = `${cleanedJsxCode.trim().slice(0, -1)}\n`;
        }

        const escapedCode = cleanedJsxCode.replace(/`/g, "\\`");
        const outputContent = `export default \`${escapedCode}\`;`;

        const outputFilePath = path.join(OUTPUT_DIR, `${componentName}_${storyName}.storyCode.ts`);
        fs.writeFileSync(outputFilePath, outputContent);

        const fileContent = fs.readFileSync(outputFilePath, "utf8");
        const formattedFileContent = prettier.format(fileContent, {
            ...prettierConfig,
            parser: "typescript",
        });
        fs.writeFileSync(outputFilePath, formattedFileContent);
        // eslint-disable-next-line no-console
        console.log(`Generated: ${outputFilePath}`);
    }
});

// eslint-disable-next-line no-console
console.log("Story code files generation complete!");
