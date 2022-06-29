import { Command } from "commander";

import { generateBlockTypes } from "./commands/generate-block-types";

const program = new Command();

program.addCommand(generateBlockTypes);

program.parse();
