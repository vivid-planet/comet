/* eslint-disable no-console */

import { kebabCase } from "change-case";
import { readdirSync, writeFileSync } from "fs";
import path from "path";
import { type ExportAssignment, type ObjectLiteralExpression, Project, type SourceFile, SyntaxKind } from "ts-morph";

type StorybookStoryData = {
    name: string | null; // The values defines with {storyFunction}.name
    functionName: string | null; // The function name of the story
    description: string | null; // The optional JSDoc description of the story
};

type StorybookPropData = {
    name: string | null;
    description: string | null;
};

type StorybookDocsData = {
    title: string;
    props: StorybookPropData[];
    stories: StorybookStoryData[];
};

const main = async () => {
    console.log("Generating component docs...");
    const storybookPath = path.resolve(process.cwd(), "../storybook/src/admin-component-docs");
    const storyFiles = findStoryFiles(storybookPath);
    const storybookData = getStorybookData(storyFiles);
    generateComponentDocs(storybookData);
};

const generateComponentDocs = (storybookDocs: StorybookDocsData[]) => {
    const docsDir = path.resolve(process.cwd(), "docs/6-future-admin-components");

    storybookDocs.forEach((storybookDoc) => {
        const componentName = storybookDoc.title;
        if (!componentName) return;

        const fileName = `generated.${kebabCase(componentName)}.mdx`;
        const filePath = path.join(docsDir, fileName);

        const content = getDocsFileContent(storybookDoc);
        writeFileSync(filePath, content);
        console.log(`- ${filePath}`);
    });
};

const getPropsSection = (title: string, props: StorybookPropData[]) => {
    if (!props.length) return "";

    const propsList = props.map(({ name, description }) => {
        if (description) {
            return `- ${name}: ${description}`;
        }

        return `- ${name}`;
    });

    return [`${title}Props`, propsList.join("\n")].join("\n\n");
};

const getDocsFileContent = ({ title, props, stories }: StorybookDocsData) => {
    const defaultStory = stories.find((story) => story.functionName === "DefaultStory");
    const defaultStoryDescription = defaultStory?.description?.replaceAll("\n", " ");

    const docsHeaderObj = {
        title,
        slug: kebabCase(title),
        description: defaultStoryDescription,
    };

    const docsHeader = `---
${Object.entries(docsHeaderObj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")}
---`;

    const imports = ["import { ComponentDoc } from '../../src/components/ComponentDoc';"].join("\n");

    const titleSection = `# ${title}`;
    const propsSection = getPropsSection(title, props);
    const storyIframe = `<ComponentDoc title="${title}" />`;

    return `${docsHeader}

${imports}

${titleSection}

<span class="generated-hidden-text-content-only-used-for-search-indexing">
${propsSection}
</span>

${storyIframe}

---

\`\`\`json
${JSON.stringify(stories, null, 2)}
\`\`\`
    `;
};

const findStoryFiles = (directoryPath: string): string[] => {
    return readdirSync(directoryPath)
        .filter((file) => file.endsWith(".stories.ts") || file.endsWith(".stories.tsx"))
        .map((file) => path.join(directoryPath, file));
};

const getTitleFromConfigObject = (configObject: ObjectLiteralExpression): string | undefined => {
    const titleProperty = configObject.getProperty("title");

    if (titleProperty && titleProperty.getKind() === SyntaxKind.PropertyAssignment) {
        const titleInitializer = titleProperty.getLastChildByKind(SyntaxKind.StringLiteral);
        if (titleInitializer) {
            const title = titleInitializer.getLiteralText();
            const docsFileNamePrefix = "Admin Components/";

            if (title.startsWith(docsFileNamePrefix)) {
                return title.replace(docsFileNamePrefix, "");
            }
        }
    }
};

const getArgTypesFromConfigObject = (configObject: ObjectLiteralExpression): StorybookPropData[] => {
    const argTypesProperty = configObject.getProperty("argTypes");

    if (argTypesProperty && argTypesProperty.getKind() === SyntaxKind.PropertyAssignment) {
        const argTypesInitializer = argTypesProperty.getLastChildByKind(SyntaxKind.ObjectLiteralExpression);
        if (argTypesInitializer) {
            return argTypesInitializer
                .getProperties()
                .filter((property) => property.getKind() === SyntaxKind.PropertyAssignment)
                .map((property) => {
                    const propertyAssignment = property.asKindOrThrow(SyntaxKind.PropertyAssignment);
                    const nameNode = propertyAssignment.getNameNode();
                    const initializer = propertyAssignment.getInitializer();
                    const description =
                        initializer
                            ?.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
                            .getProperty("description")
                            ?.asKindOrThrow(SyntaxKind.PropertyAssignment)
                            .getInitializer()
                            ?.asKindOrThrow(SyntaxKind.StringLiteral)
                            .getLiteralText() || null;

                    return {
                        name: nameNode.getText(),
                        description,
                    };
                })
                .filter((prop) => prop.name.length > 0);
        }
    }

    return [];
};

const getConfigObjectFromDefaultExport = (defaultExport: ExportAssignment, sourceFile: SourceFile): ObjectLiteralExpression | null => {
    const defaultExportExpression = defaultExport.getExpression();

    if (defaultExportExpression.getKind() === SyntaxKind.ObjectLiteralExpression) {
        const configObject = defaultExportExpression.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
        return configObject;
    } else if (defaultExportExpression.getKind() === SyntaxKind.Identifier) {
        const configVariableName = defaultExportExpression.getText();
        const configDeclaration = sourceFile.getVariableDeclaration(configVariableName);

        if (configDeclaration) {
            const configInitializer = configDeclaration.getInitializer();

            if (configInitializer && configInitializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
                const configObject = configInitializer.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
                return configObject;
            }
        }
    }

    return null;
};

const getAllStoriesFromSourceFile = (sourceFile: SourceFile): StorybookStoryData[] => {
    const stories: StorybookStoryData[] = [];

    // Get all exported variable statements that are typed as Story
    const exportedVariables = sourceFile.getExportedDeclarations();

    for (const [name, declarations] of exportedVariables) {
        for (const declaration of declarations) {
            if (declaration.getKind() === SyntaxKind.VariableDeclaration) {
                const variableDeclaration = declaration.asKindOrThrow(SyntaxKind.VariableDeclaration);
                const type = variableDeclaration.getType();

                // Check if the type is Story (this is a simplified check)
                if (type.getText().includes("Story")) {
                    let description: string | null = null;
                    let functionName: string | null = name;

                    // Get comment if it exists
                    // TODO: This does not work, description is always null
                    const varParent = variableDeclaration.getParent();
                    if (varParent && varParent.getKind() === SyntaxKind.VariableDeclarationList) {
                        const varStatement = varParent.getParent();
                        if (varStatement && varStatement.getKind() === SyntaxKind.VariableStatement) {
                            // Look for comment before the variable statement
                            const previousSibling = varStatement.getPreviousSibling();
                            if (previousSibling && previousSibling.getKind() === SyntaxKind.MultiLineCommentTrivia) {
                                const comment = previousSibling.getText();
                                // Extract text from /** ... */ format
                                const match = comment.match(/\/\*\*\s*\*\s*(.*?)\s*\*\//s);
                                if (match && match[1]) {
                                    description = match[1].trim();
                                }
                            }
                        }
                    }

                    // Check if there's a .name assignment after the export
                    const parent = variableDeclaration.getParent();
                    if (parent && parent.getKind() === SyntaxKind.VariableDeclarationList) {
                        const grandParent = parent.getParent();
                        if (grandParent && grandParent.getKind() === SyntaxKind.VariableStatement) {
                            const nextSibling = grandParent.getNextSibling();
                            if (nextSibling && nextSibling.getKind() === SyntaxKind.ExpressionStatement) {
                                const expression = nextSibling.getFirstChildByKind(SyntaxKind.BinaryExpression);
                                if (expression) {
                                    const left = expression.getFirstChildByKind(SyntaxKind.PropertyAccessExpression);
                                    if (left) {
                                        const propertyName = left.getLastChildByKind(SyntaxKind.Identifier);
                                        if (propertyName && propertyName.getText() === "name") {
                                            const right = expression.getLastChildByKind(SyntaxKind.StringLiteral);
                                            if (right) {
                                                functionName = right.getLiteralText();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    stories.push({
                        name: functionName,
                        functionName: name,
                        description,
                    });
                }
            }
        }
    }

    return stories;
};

const getStorybookData = (storyFiles: string[]): StorybookDocsData[] => {
    const project = new Project();
    project.addSourceFilesAtPaths(storyFiles);
    const data: Array<StorybookDocsData | undefined> = [];

    for (const sourceFile of project.getSourceFiles()) {
        const defaultExport = sourceFile.getExportAssignments().find((exportedVariable) => !exportedVariable.isExportEquals());

        const configObject = getConfigObjectFromDefaultExport(defaultExport, sourceFile);

        if (configObject) {
            const argTypes = getArgTypesFromConfigObject(configObject);

            data.push({
                title: getTitleFromConfigObject(configObject),
                stories: getAllStoriesFromSourceFile(sourceFile),
                props: argTypes,
            });
        }
    }

    return data.filter((title) => title !== undefined);
};

main();
