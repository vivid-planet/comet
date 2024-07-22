export { BaseSiteConfig, ExtractPrivateSiteConfig, ExtractPublicSiteConfig } from "./site-configs.types";
import { Command } from "commander";

import { blockGeneratorCommand } from "./commands/block-generator/command";
import { generateBlockTypes } from "./commands/generate-block-types";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(blockGeneratorCommand);

program.parse();
