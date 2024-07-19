import { Command } from "commander";

// TODO: This should be generated from a the cli-command.
const blockConfig = {
    name: "Highlight Teaser",
};

export const blockGenerator = new Command("block-generator").description("generate a block (POC)").action(async () => {
    // eslint-disable-next-line no-console
    console.log(`Generating a block "${blockConfig.name}"`);
});
