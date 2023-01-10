import { createOneOfBlock, createRichTextBlock, createTextLinkBlock, ExternalLinkBlock } from "@comet/blocks-api";
import { NestFactory } from "@nestjs/core";

import { BlocksModule, createSeoBlock, createTextImageBlock, InternalLinkBlock } from "./src";

async function generateBlockMeta(): Promise<void> {
    console.info("Generating block-meta.json...");

    const LinkBlock = createOneOfBlock(
        { supportedBlocks: { internal: InternalLinkBlock, external: ExternalLinkBlock } },
        {
            name: "Link",
        },
    );

    const TextBlock = createRichTextBlock({ link: LinkBlock });

    // Create TextImageBlock for block types generation in client libraries
    createTextImageBlock({ text: TextBlock });

    // Create TextLinkBlock for block types generation in client libraries
    createTextLinkBlock({ link: LinkBlock });

    // Create SeoBlock for block types generation in client libraries
    createSeoBlock();

    const app = await NestFactory.create(
        BlocksModule.forRootAsync({
            withoutIndex: true,
            useFactory: async () => ({ dependencyTransformers: {} }),
        }),
    );
    await app.init();

    console.info("Done!");
}

generateBlockMeta();
