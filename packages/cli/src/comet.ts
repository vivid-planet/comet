import { Command } from "commander";

import { generateBlockTypeStringUnion } from "./commands/generate-block-type-string-union";
import { generateBlockTypes } from "./commands/generate-block-types";
import { injectSiteConfigsCommand } from "./commands/site-configs";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(generateBlockTypeStringUnion);
program.addCommand(injectSiteConfigsCommand);

program.parse();
