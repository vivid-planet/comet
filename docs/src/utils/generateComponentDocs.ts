/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import { type ObjectLiteralExpression, Project, SyntaxKind } from "ts-morph";

const main = async () => {
    console.log("Generating component docs...");

    const storybookPath = path.resolve(process.cwd(), "../storybook/src/future-docs");
    const storyFiles = findStoryFiles(storybookPath);
    const titles = extractTitlesFromStories(storyFiles);

    console.log("Found story titles starting with 'Future Docs/':");
    titles.forEach((title) => console.log(`- ${title}`));
};

function findStoryFiles(directoryPath: string): string[] {
    try {
        const files = fs
            .readdirSync(directoryPath)
            .filter((file) => file.endsWith(".stories.ts") || file.endsWith(".stories.tsx"))
            .map((file) => path.join(directoryPath, file));

        return files;
    } catch (error) {
        console.error(`Error reading directory: ${error}`);
        return [];
    }
}

function extractTitleFromConfigObject(configObject: ObjectLiteralExpression): string | undefined {
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

function extractTitlesFromStories(storyFiles: string[]): string[] {
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
                    titles.push(extractTitleFromConfigObject(configObject));
                } else if (defaultExportExpression.getKind() === SyntaxKind.Identifier) {
                    const configVariableName = defaultExportExpression.getText();
                    const configDeclaration = sourceFile.getVariableDeclaration(configVariableName);

                    if (configDeclaration) {
                        const configInitializer = configDeclaration.getInitializer();

                        if (configInitializer && configInitializer.getKind() === SyntaxKind.ObjectLiteralExpression) {
                            const configObject = configInitializer.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
                            titles.push(extractTitleFromConfigObject(configObject));
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
