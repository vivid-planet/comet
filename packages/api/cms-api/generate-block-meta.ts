import { createRichTextBlock, createTextLinkBlock, ExternalLinkBlock, getBlocksMeta, registerBlock } from "@comet/blocks-api";
import { promises as fs } from "fs";

import {
    AnchorBlock,
    createLinkBlock,
    createSeoBlock,
    createTextImageBlock,
    DamFileDownloadLinkBlock,
    DamImageBlock,
    DamVideoBlock,
    EmailLinkBlock,
    InternalLinkBlock,
    PhoneLinkBlock,
    VimeoVideoBlock,
    YouTubeVideoBlock,
} from "./src";

async function generateBlockMeta(): Promise<void> {
    console.info("Generating block-meta.json...");

    const LinkBlock = createLinkBlock({
        supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, email: EmailLinkBlock, phone: PhoneLinkBlock },
    });

    const TextBlock = createRichTextBlock({ link: LinkBlock });
    registerBlock(TextBlock);

    // Create TextImageBlock for block types generation in client libraries
    registerBlock(createTextImageBlock({ text: TextBlock }));

    // Create TextLinkBlock for block types generation in client libraries
    registerBlock(createTextLinkBlock({ link: LinkBlock }));

    // Create SeoBlock for block types generation in client libraries
    registerBlock(createSeoBlock());

    registerBlock(AnchorBlock);
    registerBlock(DamImageBlock);
    registerBlock(DamVideoBlock);
    registerBlock(DamFileDownloadLinkBlock);
    registerBlock(VimeoVideoBlock);
    registerBlock(YouTubeVideoBlock);

    console.info("Writing block-meta.json...");
    const metaJson = getBlocksMeta();
    await fs.writeFile("block-meta.json", JSON.stringify(metaJson, null, 4));

    console.info("Done!");
}

generateBlockMeta();
