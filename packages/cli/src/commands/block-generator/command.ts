import { Command } from "commander";
import { ESLint } from "eslint";
import fs from "fs";

import { addAdminBlockToPageContent } from "./addAdminBlockToPageContent";
import { createBlockAdmin } from "./createAdminBlock";
import { exampleTeaserBlockConfig } from "./exampleBlockConfigs";
import { BlockConfig, getBlockConfig } from "./getBlockConfig";

export type FileCreationData = {
    filePath: string;
    content: string;
};

const writeFile = async (data: FileCreationData, logMessage: string) => {
    const packagePath = "../../demo/admin"; // TODO: Use the correct config depending on the package the file is created in (admin, api, site)

    const eslint = new ESLint({
        cwd: `${process.cwd()}/${packagePath}`,
        fix: true,
        overrideConfigFile: `${packagePath}/.eslintrc.json`,
    });

    const lintResult = await eslint.lintText(data.content, {
        filePath: data.filePath,
    });

    const output = lintResult[0] && lintResult[0].output ? lintResult[0].output : lintResult[0].source;

    // eslint-disable-next-line no-console
    console.log(`> ${logMessage} (${data.filePath})`);
    fs.writeFileSync(data.filePath, output ?? data.content);
};

type Options = {
    exampleTeaserBlock: boolean;
};

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