/* eslint-disable no-console */

import { kebabCase } from "change-case";
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import prettier from "prettier";
import { Project, type SourceFile, SyntaxKind, type VariableDeclaration } from "ts-morph";

type StoriesJsonEntry = {
    id: string;
    title: string;
    type: "story" | "docs";
    tags: string[];
};

type StoriesJson = {
    v: number;
    entries: Record<string, StoriesJsonEntry>;
};

const getStaticStorybookIndexJson = () => {
    const jsonPath = path.resolve(process.cwd(), "../storybook/storybook-static/index.json");
    const json = readFileSync(jsonPath, "utf8");
    return JSON.parse(json);
};

const getRunningStorybookIndexJson = async () => {
    const response = await fetch("http://localhost:26638/index.json");
    return response.json();
};

const getAdminComponentDocsStories = async (): Promise<StoriesJsonEntry[]> => {
    let storiesJson: StoriesJson;

    if (process.env.FETCH_FROM_RUNNING_STORYBOOK === "true") {
        storiesJson = await getRunningStorybookIndexJson();
    } else {
        storiesJson = getStaticStorybookIndexJson();
    }

    return Object.values(storiesJson.entries).filter(({ tags, type }) => tags.includes("adminComponentDocs") && type === "docs");
};

const main = async () => {
    cleanupExistingStoryCodeFiles();
    const stories = await getAdminComponentDocsStories();
    console.log(`Generating component docs for ${stories.length} components...`);
    await generateComponentDocs(stories);
};

// TODO: Check if this makes sense
const cleanupExistingStoryCodeFiles = (): void => {
    const storyCodeDir = path.resolve(process.cwd(), "docs/5-admin-components/components/stories-code");

    try {
        const files = readdirSync(storyCodeDir);
        const generatedFiles = files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx") || file.endsWith(".ts") || file.endsWith(".tsx"));

        generatedFiles.forEach((file) => {
            const filePath = path.join(storyCodeDir, file);
            unlinkSync(filePath);
            console.log(`  - Removed existing story code file: ${file}`);
        });
    } catch {
        // Directory might not exist yet, ignore error
    }
};

const generateComponentDocs = async (stories: StoriesJsonEntry[]) => {
    const docsDir = path.resolve(process.cwd(), "docs/5-admin-components/components");

    // Process components sequentially to avoid overwhelming the system
    for (const { id, title } of stories) {
        const componentName = title.split("/")[1];
        if (!componentName) continue;

        const fileName = `generated.${kebabCase(componentName)}.mdx`;
        const filePath = path.join(docsDir, fileName);

        const content = getDocsFileContent(componentName, id);
        writeFileSync(filePath, content);
        console.log(`- ${filePath}`);

        await generateStoryCodeFiles(componentName);
    }
};

const getDocsFileContent = (componentName: string, storyId: string) => {
    return `---
title: ${componentName}
slug: ${kebabCase(componentName)}
---

import { StorybookAdminComponentDocsIframe } from "../../../src/components/StorybookAdminComponentDocsIframe";

# ${componentName}

<StorybookAdminComponentDocsIframe storyId="${storyId}" />
`;
};

// TODO: Check if this makes sense
const createSourceFileFromStoryFile = (componentName: string): SourceFile | null => {
    const storyFilePath = path.resolve(process.cwd(), `../storybook/src/admin-component-docs/${componentName}.stories.tsx`);

    try {
        const fileContent = readFileSync(storyFilePath, "utf-8");
        const project = new Project({ useInMemoryFileSystem: true });
        return project.createSourceFile("story.tsx", fileContent);
    } catch {
        console.error(`Error reading story file for ${componentName}`);
        return null;
    }
};

// TODO: Check if this makes sense
const extractStoryExports = (sourceFile: SourceFile): VariableDeclaration[] => {
    return sourceFile.getVariableDeclarations().filter((variable) => {
        const variableStatement = variable.getVariableStatement();
        return variableStatement.hasExportKeyword() && !variableStatement.isDefaultExport();
    });
};

// TODO: Check if this makes sense
const generateStoryCodeFile = async (componentName: string, storyName: string, storyVariable: VariableDeclaration): Promise<void> => {
    const storyCodeDir = path.resolve(process.cwd(), "docs/5-admin-components/components/stories-code");

    try {
        mkdirSync(storyCodeDir, { recursive: true });
    } catch {
        // Directory might already exist, ignore error
    }

    const storyInitializer = storyVariable.getInitializer();
    if (!storyInitializer) return;

    const returnContent = extractReturnContentFromStory(storyInitializer);
    if (!returnContent) return;

    // Format the JSX code itself with Prettier
    let formattedJsxCode: string;
    try {
        // First, clean up the original content manually to get proper base
        const cleanedContent = removeOuterParenthesesAndNormalizeIndentation(returnContent);

        // Then format it with Prettier by wrapping in a simple return statement
        const wrappedCode = `const temp = () => {\n    return (\n        ${cleanedContent.replace(/\n/g, "\n        ")}\n    );\n};`;

        const formattedWrapped = await prettier.format(wrappedCode, {
            parser: "typescript",
            semi: true,
            singleQuote: false,
            tabWidth: 4,
            trailingComma: "all",
            printWidth: 80,
        });

        // Extract the JSX content between the return parentheses
        const returnMatch = formattedWrapped.match(/return \(\s*([\s\S]*?)\s*\);/);
        if (returnMatch) {
            // Remove the extra indentation that was added for the wrapper
            const extractedContent = returnMatch[1];
            const lines = extractedContent.split("\n");
            const dedentedLines = lines.map((line) => {
                // Remove up to 8 spaces of indentation (2 levels of 4 spaces)
                return line.replace(/^ {8}/, "");
            });
            formattedJsxCode = dedentedLines.join("\n").trim();
        } else {
            throw new Error("Could not extract JSX from formatted code");
        }
    } catch {
        console.warn(`  - Warning: Could not format JSX code for ${componentName}.${storyName}, using manual cleanup`);
        // Fallback: just use manual cleanup
        formattedJsxCode = removeOuterParenthesesAndNormalizeIndentation(returnContent);
    }

    // Generate React component file with CodeBlock
    const tsxFileName = `${componentName}.${storyName}.tsx`;
    const tsxFilePath = path.join(storyCodeDir, tsxFileName);

    // Generate React component with CodeBlock
    const rawTsxContent = `// Auto-generated story code component for ${componentName}.${storyName}
import CodeBlock from "@theme/CodeBlock";

const code = \`${formattedJsxCode.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;

export default function ${componentName}${storyName}StoryCode() {
    return (
        <CodeBlock language="tsx">
            {code}
        </CodeBlock>
    );
}
`;

    // Format the generated code with Prettier
    let formattedTsxContent: string;
    try {
        formattedTsxContent = await prettier.format(rawTsxContent, {
            parser: "typescript",
            semi: true,
            singleQuote: false,
            tabWidth: 4,
            trailingComma: "all",
        });
    } catch {
        console.warn(`  - Warning: Could not format ${tsxFileName} with Prettier, using unformatted code`);
        formattedTsxContent = rawTsxContent;
    }

    writeFileSync(tsxFilePath, formattedTsxContent, "utf-8");
    console.log(`  - Generated story code: ${tsxFileName}`);
};

// TODO: Check if this makes sense
const removeOuterParenthesesAndNormalizeIndentation = (content: string): string => {
    let cleanedContent = content.trim();

    // Remove outer parentheses if they wrap the entire content
    if (cleanedContent.startsWith("(") && cleanedContent.endsWith(")")) {
        cleanedContent = cleanedContent.slice(1, -1).trim();
    }

    // Split into lines and find the minimum indentation (excluding empty lines)
    const lines = cleanedContent.split("\n");
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

    if (nonEmptyLines.length === 0) return cleanedContent;

    const minIndentation = Math.min(
        ...nonEmptyLines.map((line) => {
            const match = line.match(/^(\s*)/);
            return match ? match[1].length : 0;
        }),
    );

    // Remove the minimum indentation from all lines
    const normalizedLines = lines.map((line) => {
        if (line.trim().length === 0) return "";
        return line.slice(minIndentation);
    });

    return normalizedLines.join("\n").trim();
};

// TODO: Check if this makes sense
const extractReturnContentFromStory = (storyInitializer: unknown): string | null => {
    if (!storyInitializer || typeof storyInitializer !== "object") return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const objectLiteral = storyInitializer as any;

    // Look for render function in the story object
    const renderProperty = objectLiteral.getProperty?.("render");
    if (!renderProperty) return null;

    const renderFunction = renderProperty.getInitializer?.();
    if (!renderFunction) return null;

    // Find the return statement in the render function
    const returnStatements = renderFunction.getDescendantsOfKind?.(SyntaxKind.ReturnStatement);
    if (!returnStatements || returnStatements.length === 0) return null;

    const returnStatement = returnStatements[0];
    const returnExpression = returnStatement.getExpression();
    if (!returnExpression) return null;

    const rawContent = returnExpression.getFullText().trim();
    return removeOuterParenthesesAndNormalizeIndentation(rawContent);
};

// TODO: Check if this makes sense
const generateStoryCodeFiles = async (componentName: string): Promise<void> => {
    const sourceFile = createSourceFileFromStoryFile(componentName);
    if (!sourceFile) return;

    const storyExports = extractStoryExports(sourceFile);

    // Process story files sequentially to avoid overwhelming Prettier
    for (const storyVariable of storyExports) {
        const storyName = storyVariable.getName();
        await generateStoryCodeFile(componentName, storyName, storyVariable);
    }
};

main();
