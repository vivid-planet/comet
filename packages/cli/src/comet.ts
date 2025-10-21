import { Command } from "commander";

import { downloadOAuth2ProxyCommand } from "./commands/download-oauth2-proxy";
import { generateBlockTypes } from "./commands/generate-block-types";
import { injectSiteConfigsCommand } from "./commands/site-configs";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(injectSiteConfigsCommand);
program.addCommand(downloadOAuth2ProxyCommand);

program.parse();
