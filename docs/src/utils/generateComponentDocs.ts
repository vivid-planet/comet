/* eslint-disable no-console */

import { kebabCase } from "change-case";
import { readdirSync, writeFileSync } from "fs";
import path from "path";
import { type ObjectLiteralExpression, Project, SyntaxKind } from "ts-morph";

const main = async () => {
    console.log("Generating component docs...");
    const storybookPath = path.resolve(process.cwd(), "../storybook/src/future-docs");
    const storyFiles = findStoryFiles(storybookPath);
    const titles = getTitlesFromStories(storyFiles);
    generateComponentDocs(titles);
};

function generateComponentDocs(titles: string[]): void {
    const docsDir = path.resolve(process.cwd(), "docs/6-future-admin-components");

    titles.forEach((fullTitle) => {
        const componentName = fullTitle.split("/")[1];
        if (!componentName) return;

        const fileName = `generated.${kebabCase(componentName)}.mdx`;
        const filePath = path.join(docsDir, fileName);

        const content = getDocsFileContent(componentName);
        writeFileSync(filePath, content);
        console.log(`- ${filePath}`);
    });
}

const getDocsFileContent = (componentName: string) => {
    return `---
title: ${componentName}
slug: ${kebabCase(componentName)}
---

import { ComponentDoc } from "../../src/components/ComponentDoc";

# ${componentName}

<ComponentDoc title="${componentName}" />
`;
};

function findStoryFiles(directoryPath: string): string[] {
    return readdirSync(directoryPath)
        .filter((file) => file.endsWith(".stories.ts") || file.endsWith(".stories.tsx"))
        .map((file) => path.join(directoryPath, file));
}

function getTitleFromConfigObject(configObject: ObjectLiteralExpression): string | undefined {
    const titleProperty = configObject.getProperty("title");

    if (titleProperty && titleProperty.getKind() === SyntaxKind.PropertyAssignment) {
        const titleInitializer = titleProperty.getLastChildByKind(SyntaxKind.StringLiteral);
        if (titleInitializer) {
            const title = titleInitializer.getLiteralText();

            if (title.startsWith("Future Docs/")) {
                return title;
            }
        }
    }
}

function getTitlesFromStories(storyFiles: string[]): string[] {
    const project = new Project();
    project.addSourceFilesAtPaths(storyFiles);
    const titles: Array<string | undefined> = [];

    for (const sourceFile of project.getSourceFiles()) {
        try {
            const defaultExport = sourceFile.getExportAssignments().find((exp) => !exp.isExportEquals());

            if (defaultExport) {
                const defaultExportExpression = defaultExport.getExpression();

                if (defaultExportExpression.getKind() === SyntaxKind.ObjectLiteralExpression) {
                    const configObject = defaultExportExpression.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
                    titles.push(getTitleFromConfigObject(configObject));
                } else if (defaultExportExpression.getKind() === SyntaxKind.Identifier) {
                    const configVariableName = defaultExportExpression.getText();
                    const configDeclaration = sourceFile.getVariableDeclaration(configVariableName);

                    if (configDeclaration) {
                        const configInitializer = configDeclaration.getInitializer();

                        if (configInitializer && configInitializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
                            const configObject = configInitializer.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
                            titles.push(getTitleFromConfigObject(configObject));
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`Error parsing file ${sourceFile.getFilePath()}: ${error}`);
        }
    }

    return titles.filter((title) => title !== undefined);
}

main();
