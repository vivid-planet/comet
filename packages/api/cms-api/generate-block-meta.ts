import { createRichTextBlock, createTextLinkBlock, ExternalLinkBlock, getBlocksMeta } from "@comet/blocks-api";
import { promises as fs } from "fs";

import { createLinkBlock, createSeoBlock, createTextImageBlock, InternalLinkBlock } from "./src";

async function generateBlockMeta(): Promise<void> {
    console.info("Generating block-meta.json...");

    const LinkBlock = createLinkBlock({ supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock } });

    const TextBlock = createRichTextBlock({ link: LinkBlock });

    // Create TextImageBlock for block types generation in client libraries
    createTextImageBlock({ text: TextBlock });

    // Create TextLinkBlock for block types generation in client libraries
    createTextLinkBlock({ link: LinkBlock });

    // Create SeoBlock for block types generation in client libraries
    createSeoBlock();

    const metaJson = getBlocksMeta();
    await fs.writeFile("block-meta.json", JSON.stringify(metaJson, null, 4));

    console.info("Done!");
}

generateBlockMeta();
