import { Command } from "commander";

import { encodeBase64Command } from "./commands/encode-base64";
import { generateBlockTypes } from "./commands/generate-block-types";
import { injectSiteConfigsCommand } from "./commands/site-configs";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(injectSiteConfigsCommand);
program.addCommand(encodeBase64Command);

program.parse();
