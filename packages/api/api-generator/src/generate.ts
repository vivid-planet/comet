import * as console from "node:console";

import { Command } from "commander";

import { generateFiles } from "./generateFiles";
import { watchMode } from "./watchMode";

type GenerateOptions = {
    watch: boolean;
    file?: string;
};

const program = new Command();

const generate = new Command("generate")
    .action(async (options: GenerateOptions) => {
        if (options.watch) {
            console.log("API generator in watch mode ...");
            await generateFiles();
            await watchMode();
        } else {
            console.log(`API generator in ${options.file ? "file mode" : "all mode"}}...`);
            generateFiles(options.file);
        }
    })
    .option("-f, --file <file>", "path to entity file")
    .option("--watch", "Watch for changes");

program.addCommand(generate);

program.parse(process.argv);
