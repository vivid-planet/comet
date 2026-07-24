import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Project, type SourceFile } from "ts-morph";

const adminTsConfigPath = join(dirname(fileURLToPath(import.meta.url)), "../../../../tsconfig.json");

/**
 * A ts-morph project wired to the `@comet/admin` `tsconfig.json` so the type
 * checker resolves the same way the package builds — needed to expand a
 * component's `Omit<…>` inheritance and union prop types. Source files are
 * added on demand rather than up front, matching `api-generator`'s usage.
 */
export function createProject(): Project {
    return new Project({
        tsConfigFilePath: adminTsConfigPath,
        skipAddingFilesFromTsConfig: true,
    });
}

/** Returns the project's source file for a path, adding it from disk when it is not loaded yet. */
export function getOrAddSourceFile(project: Project, filePath: string): SourceFile {
    return project.getSourceFile(filePath) ?? project.addSourceFileAtPath(filePath);
}
