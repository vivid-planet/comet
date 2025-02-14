import { Command } from "commander";

import { generateFiles } from "./generateFiles/generateFiles";
import { watchMode } from "./watchMode/watchMode";

type GenerateOptions = {
    watch: boolean;
    file?: string;
};
export const apiGeneratorCommand = new Command("api-generator")
    .action(async (options: GenerateOptions) => {
        if (options.watch) {
            console.log("API generator in watch mode ...");
            await generateFiles();
            console.log("ready in watch mode ...");

            await watchMode();
        } else {
            console.log(`API generator in ${options.file ? "file mode" : "all mode"}...`);
            generateFiles(options.file);
        }
    })
    .option("-f, --file <file>", "path to entity file")
    .option("--watch", "Watch for changes");
