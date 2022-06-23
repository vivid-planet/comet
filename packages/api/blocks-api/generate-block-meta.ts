import { writeFile } from "fs/promises";

import { getBlocksMeta } from "./src";

async function generateBlockMeta(): Promise<void> {
    console.info("Generating block-meta.json...");

    const metaJson = getBlocksMeta();
    await writeFile("block-meta.json", JSON.stringify(metaJson, null, 4));

    console.info("Done!");
}

generateBlockMeta();
