import * as process from "node:process";

import type { Permission } from "@dextinity/cms-api";
import { Project, type SourceFile } from "ts-morph";

import { formatWithOxfmt } from "./format-with-oxfmt";
import type { GeneratedFile } from "./write-generated-files";

export async function formatSource(sourceCode: string): Promise<string> {
    return formatWithOxfmt(`${process.cwd()}/test.ts`, sourceCode);
}

export async function formatGeneratedFiles(files: GeneratedFile[]): Promise<GeneratedFile[]> {
    return Promise.all(
        files.map(async (file) => {
            return {
                ...file,
                content: await formatSource(file.content),
            };
        }),
    );
}

export function parseSource(source: string): SourceFile {
    const project = new Project({
        tsConfigFilePath: "./tsconfig.json",
        skipAddingFilesFromTsConfig: true,
    });
    return project.createSourceFile("test.ts", source);
}

export const testPermission = "crud" as Permission;
