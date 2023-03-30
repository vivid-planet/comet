import { writeGeneratedFile } from "./write-generated-file";

export type GeneratedFiles = Record<string, string>;

export async function writeGeneratedFiles(files: GeneratedFiles, options: { targetDirectory: string }): Promise<void> {
    for (const fileName in files) {
        await writeGeneratedFile(`${options.targetDirectory}/${fileName}`, files[fileName]);
    }
}
