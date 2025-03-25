import { Command } from "commander";
import { readFile, writeFile } from "fs/promises";

import { type BlockMeta } from "../BlockMeta";

type Options = {
    inputFile: string;
    outputFile: string;
};

export const generateBlockTypeStringUnion = new Command("generate-block-type-string-union")
    .description("generate block string union from block meta")
    .option("--input-file <inputFile>", "file to read block meta from", "block-meta.json")
    .option("--output-file <outputFile>", "file to write block types to", "./src/AvailableBlockTypes.generated.ts")
    .action(async (options: Options) => {
        const blockMeta = await readFile(options.inputFile).then((fileContents) => JSON.parse(fileContents.toString()) as BlockMeta[]);

        const uniqueBlockNames = Array.from(new Set(blockMeta.map((block) => block.name)));
        const sortedBlockMeta = uniqueBlockNames.sort();

        let content = "export type AvailableBlockTypes =";
        sortedBlockMeta.forEach((blockName, index) => {
            content += `    | "${blockName}"`;
        });
        content += "\n";

        await writeFile(options.outputFile, content);
    });
