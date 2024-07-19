export { BaseSiteConfig, ExtractPrivateSiteConfig, ExtractPublicSiteConfig } from "./site-configs.types";
import { Command } from "commander";

import { blockGenerator } from "./commands/block-generator";
import { generateBlockTypes } from "./commands/generate-block-types";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(blockGenerator);

program.parse();
