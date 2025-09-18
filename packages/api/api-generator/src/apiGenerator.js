"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var generate_command_1 = require("./commands/generate/generate-command");
var program = new commander_1.Command();
program.addCommand(generate_command_1.generateCommand);
program.parse();
