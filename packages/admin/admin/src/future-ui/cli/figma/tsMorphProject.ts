import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Project, type SourceFile } from "ts-morph";

const adminTsConfigPath = join(dirname(fileURLToPath(import.meta.url)), "../../../../tsconfig.json");

export function createTsMorphProject(): Project {
    return new Project({ tsConfigFilePath: adminTsConfigPath, skipAddingFilesFromTsConfig: true });
}

export function getOrAddSourceFile(project: Project, filePath: string): SourceFile {
    return project.getSourceFile(filePath) ?? project.addSourceFileAtPath(filePath);
}
