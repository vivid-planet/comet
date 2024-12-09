import { writeFile } from "fs/promises";

import { ExternalLinkBlock, getBlocksMeta, registerBlock, SpaceBlock } from "./src";

async function generateBlockMeta(): Promise<void> {
    console.info("Generating block-meta.json...");

    registerBlock(SpaceBlock);
    registerBlock(ExternalLinkBlock);

    const metaJson = getBlocksMeta();
    await writeFile("block-meta.json", JSON.stringify(metaJson, null, 4));

    console.info("Done!");
}

generateBlockMeta();
