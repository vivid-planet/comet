import { Command } from "commander";
import { createInjectSiteConfigsCommand } from "@comet/cli";
import { getSiteConfigs } from "./site-configs";

// Command
const program = new Command();
program.addCommand(createInjectSiteConfigsCommand(getSiteConfigs));

try {
    program.parseAsync();
} catch (e) {
    console.log("Error executing command");
    console.log(e);
}
