import { Project, SourceFile, SyntaxKind } from "ts-morph";

export const getCamelCaseName = (name: string) => {
    return name.replace(/\s/g, "").replace(/^./, (str) => str.toLowerCase());
};

export const getPascalCaseName = (name: string) => {
    return getCamelCaseName(name).replace(/^./, (str) => str.toUpperCase());
};

export const nonEmptyInputValidation = (errorMessage: string) => (value: string) => value.trim() !== "" || errorMessage;

export const getFilesContainingFunctionCall = (packageName: "admin" | "api" | "site", functionName: string): SourceFile[] => {
    const files: SourceFile[] = [];
    const project = new Project({
        tsConfigFilePath: `./${packageName}/tsconfig.json`,
    });

    project.getSourceFiles().forEach((sourceFile) => {
        const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).filter((call) => {
            const expression = call.getExpression();
            return expression.getKind() === SyntaxKind.Identifier && expression.getText() === functionName;
        });

        if (calls.length > 0) {
            files.push(sourceFile);
        }
    });

    return files;
};
