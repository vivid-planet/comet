import { promises as fs } from "fs";

import {
    AnchorBlock,
    createLinkBlock,
    createRichTextBlock,
    createSeoBlock,
    createTextImageBlock,
    createTextLinkBlock,
    DamFileDownloadLinkBlock,
    DamImageBlock,
    DamVideoBlock,
    EmailLinkBlock,
    ExternalLinkBlock,
    getBlocksMeta,
    InternalLinkBlock,
    PhoneLinkBlock,
    SpaceBlock,
    VimeoVideoBlock,
    YouTubeVideoBlock,
} from "./src";

async function generateBlockMeta(): Promise<void> {
    console.info("Generating block-meta.json...");

    const LinkBlock = createLinkBlock({
        supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock, email: EmailLinkBlock, phone: PhoneLinkBlock },
    });
    LinkBlock.register();

    const TextBlock = createRichTextBlock({ link: LinkBlock });
    TextBlock.register();

    // Create TextImageBlock for block types generation in client libraries
    const TextImageBlock = createTextImageBlock({ text: TextBlock });
    TextImageBlock.register();

    // Create TextLinkBlock for block types generation in client libraries
    const TextLinkBlock = createTextLinkBlock({ link: LinkBlock });
    TextLinkBlock.register();

    // Create SeoBlock for block types generation in client libraries
    const SeoBlock = createSeoBlock();
    SeoBlock.register();

    AnchorBlock.register();
    DamImageBlock.register();
    DamVideoBlock.register();
    DamFileDownloadLinkBlock.register();
    VimeoVideoBlock.register();
    YouTubeVideoBlock.register();
    SpaceBlock.register();

    const metaJson = getBlocksMeta();
    await fs.writeFile("block-meta.json", JSON.stringify(metaJson, null, 4));

    console.info("Done!");
}

generateBlockMeta();
