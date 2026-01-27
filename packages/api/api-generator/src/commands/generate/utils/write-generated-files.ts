import { writeGeneratedFile } from "./write-generated-file";

export interface GeneratedFile {
    name: string;
    content: string;
    type: "resolver" | "input" | "filter" | "sort" | "service" | "args";
}

export async function writeGeneratedFiles(files: GeneratedFile[], targetDirectory: string): Promise<void> {
    for (const file of files) {
        await writeGeneratedFile(`${targetDirectory}/${file.name}`, file.content);
    }
}
