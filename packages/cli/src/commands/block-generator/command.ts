import { Command } from "commander";
import { ESLint } from "eslint";
import fs from "fs";

import { addAdminBlockToPageContent } from "./addAdminBlockToPageContent";
import { createBlockAdmin } from "./createAdminBlock";
import { exampleTeaserBlockConfig } from "./exampleBlockConfigs";
import { BlockConfig, getBlockConfig } from "./getBlockConfig";

export type FileCreationData = {
    filePath: string;
    package: "admin" | "api" | "site";
    content: string;
};

const writeFile = async (data: FileCreationData, logMessage: string) => {
    const fullFilePath = `./${data.filePath}`;

    const eslint = new ESLint({
        cwd: `${process.cwd()}/${data.package}`,
        fix: true,
    });

    const lintResult = await eslint.lintText(data.content, {
        filePath: fullFilePath,
    });

    const output = lintResult[0] && lintResult[0].output ? lintResult[0].output : lintResult[0].source;

    // eslint-disable-next-line no-console
    console.log(`> ${logMessage} (${fullFilePath})`);
    fs.writeFileSync(fullFilePath, output ?? data.content);
};

type Options = {
    exampleTeaserBlock: boolean;
};

/*
## Run command from project root ##
~/dev/comet-core/block-generator/packages/cli/bin/comet.js block-generator
~/dev/comet-core/block-generator/packages/cli/bin/comet.js block-generator --example-teaser-block
*/

export const blockGeneratorCommand = new Command("block-generator")
    .description("generate a block (POC)")
    .option("--example-teaser-block", "Skip the interactive block creation and use the example teaser block (used for debugging)")
    .action(async (options: Options) => {
        let config: BlockConfig;

        if (options.exampleTeaserBlock) {
            config = exampleTeaserBlockConfig;
        } else {
            config = await getBlockConfig();
        }

        // eslint-disable-next-line no-console
        console.log(`Generating block "${config.name}"`);

        const adminBlockFile = createBlockAdmin(config);
        await writeFile(adminBlockFile, "Creating admin file");

        const adminPageContentFile = addAdminBlockToPageContent(config);
        await writeFile(adminPageContentFile, "Updating PageContentBlock");
    });
