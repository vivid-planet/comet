import { Command } from "commander";

import { downloadMitmproxyCommand } from "./commands/download-mitmproxy";
import { downloadOAuth2ProxyCommand } from "./commands/download-oauth2-proxy";
import { generateBlockTypes } from "./commands/generate-block-types";
import { installAgentFeaturesCommand } from "./commands/install-agent-features";
import { injectSiteConfigsCommand } from "./commands/site-configs";
import { uploadStaticAssetsCommand } from "./commands/upload-static-assets/upload-static-assets.command";

const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(injectSiteConfigsCommand);
program.addCommand(downloadOAuth2ProxyCommand);
program.addCommand(downloadMitmproxyCommand);
program.addCommand(installAgentFeaturesCommand);
program.addCommand(uploadStaticAssetsCommand);

program.parse();
