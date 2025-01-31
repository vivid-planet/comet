import { Command } from "commander";

import { type BlockMetaField, generateBlockTypes } from "./commands/generate-block-types";
import { injectSiteConfigsCommand } from "./commands/site-configs";

const foo: BlockMetaField = {
    name: "foo",
    kind: "Boolean",
    array: false,
    nullable: false,
};

console.error("Foo", foo);
const program = new Command();

program.addCommand(generateBlockTypes);
program.addCommand(injectSiteConfigsCommand);

program.parse();
