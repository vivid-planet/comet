import { Command } from "commander";

import { generateCommand } from "./commands/generate/generate-command.js";

console.log("before command");
const program = new Command();

console.log("before addCommand");
program.addCommand(generateCommand);

console.log("before parse");
program.parse();
