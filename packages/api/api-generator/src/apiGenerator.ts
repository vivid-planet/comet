import { Command } from "commander";

import { generateCommand } from "./commands/generate/generate-command";

const program = new Command();

program.addCommand(generateCommand);

program.parse();
