import { Command } from "commander";

import { generateCommand } from "./commands/generate/generate-command.js";

const program = new Command();

program.addCommand(generateCommand);
program.addHelpText("beforeAll", `⚠️️️⚠️️️⚠️️️  Admin Generator is still experimental and in beta phase. ⚠️️️⚠️️️⚠️️️ \n\n`);
program.parse();
