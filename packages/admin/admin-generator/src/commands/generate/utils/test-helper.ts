import { Project, type SourceFile } from "ts-morph";

export function parseSource(source: string): SourceFile {
    const project = new Project({
        tsConfigFilePath: "./tsconfig.json",
        skipAddingFilesFromTsConfig: true,
    });
    return project.createSourceFile("test.ts", source);
}
