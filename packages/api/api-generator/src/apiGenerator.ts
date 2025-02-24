import { Command } from "commander";

import { apiGeneratorCommand } from "./commands/generate/api-generator-command";

const program = new Command();

program.addCommand(apiGeneratorCommand);

program.parse();
