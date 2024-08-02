import { Command } from "commander";

import { blockGeneratorCommand } from "./commands/block-generator/command";
import { generateBlockTypes } from "./commands/generate-block-types";
import { injectSiteConfigsCommand } from "./commands/site-configs";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(injectSiteConfigsCommand);
program.addCommand(blockGeneratorCommand);

program.parse();
