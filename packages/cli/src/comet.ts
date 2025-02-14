import { Command } from "commander";

import { apiGeneratorCommand } from "./commands/api-generator/api-generator-command";
import { generateBlockTypes } from "./commands/generate-block-types";
import { injectSiteConfigsCommand } from "./commands/site-configs";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(injectSiteConfigsCommand);
program.addCommand(apiGeneratorCommand);

program.parse();
