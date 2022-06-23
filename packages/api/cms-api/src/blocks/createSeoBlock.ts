import {
    Block,
    BlockData,
    BlockDataInterface,
    BlockField,
    BlockInput,
    BlockInputInterface,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    createOptionalBlock,
    ExtractBlockInput,
    inputToData,
    OptionalBlockInputInterface,
    SimpleBlockInputInterface,
    TraversableTransformResponse,
} from "@comet/blocks-api";
import { IsBoolean, IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";

import { PixelImageBlock } from "./PixelImageBlock";

export enum SitemapPagePriority {
    _0_0 = "0_0",
    _0_1 = "0_1",
    _0_2 = "0_2",
    _0_3 = "0_3",
    _0_4 = "0_4",
    _0_5 = "0_5",
    _0_6 = "0_6",
    _0_7 = "0_7",
    _0_8 = "0_8",
    _0_9 = "0_9",
    _1_0 = "1_0",
}

export enum SitemapPageChangeFrequency {
    "always" = "always",
    "hourly" = "hourly",
    "daily" = "daily",
    "weekly" = "weekly",
    "monthly" = "monthly",
    "yearly" = "yearly",
    "never" = "never",
}

interface CreateSeoBlockOptions<ImageBlock extends Block> {
    image?: ImageBlock;
}

// Block-factories need the their BlockInputInterface to be public
interface SeoBlockInputInterface<ImageBlockInput extends BlockInputInterface> extends SimpleBlockInputInterface {
    htmlTitle?: string;
    metaDescription?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    openGraphImage: OptionalBlockInputInterface<ImageBlockInput>;
    noIndex: boolean;
    priority: SitemapPagePriority;
    changeFrequency: SitemapPageChangeFrequency;
}

export function createSeoBlock<ImageBlock extends Block = typeof PixelImageBlock>(
    options: CreateSeoBlockOptions<ImageBlock> = {},
): Block<BlockDataInterface, SeoBlockInputInterface<ExtractBlockInput<ImageBlock>>> {
    const image = options.image || PixelImageBlock;

    const OptionalImageBlock = createOptionalBlock(image);

    class SeoBlockData extends BlockData {
        @BlockField({ nullable: true })
        htmlTitle?: string;

        // Meta
        @BlockField({ nullable: true })
        metaDescription?: string;

        // Open Graph
        @BlockField({ nullable: true })
        openGraphTitle?: string;

        @BlockField({ nullable: true })
        openGraphDescription?: string;

        @ChildBlock(OptionalImageBlock)
        openGraphImage: BlockDataInterface;

        // Sitemap
        @BlockField()
        noIndex: boolean;

        @BlockField({
            type: "enum",
            enum: SitemapPagePriority,
        })
        priority: SitemapPagePriority;

        @BlockField({
            type: "enum",
            enum: SitemapPageChangeFrequency,
        })
        changeFrequency: SitemapPageChangeFrequency;

        async transformToPlain(): Promise<TraversableTransformResponse> {
            return {
                htmlTitle: this.htmlTitle,
                metaDescription: this.metaDescription,

                openGraphTitle: this.openGraphTitle,
                openGraphDescription: this.openGraphDescription,
                openGraphImage: this.openGraphImage,

                noIndex: this.noIndex,
                priority: this.priority,
                changeFrequency: this.changeFrequency,
            };
        }
    }

    class SeoBlockInput extends BlockInput {
        @IsString()
        @IsOptional()
        @BlockField({ nullable: true })
        htmlTitle?: string;

        // Meta
        @IsString()
        @IsOptional()
        @BlockField({ nullable: true })
        metaDescription?: string;

        // Open Graph
        @IsString()
        @IsOptional()
        @BlockField({ nullable: true })
        openGraphTitle?: string;

        @IsString()
        @IsOptional()
        @BlockField({ nullable: true })
        openGraphDescription?: string;

        @ValidateNested()
        @IsOptional() // @TODO: Should not be optional as the image-block is already optional itself
        @ChildBlockInput(OptionalImageBlock)
        openGraphImage: OptionalBlockInputInterface<ExtractBlockInput<ImageBlock>>;

        // Sitemap
        @IsBoolean()
        @BlockField()
        noIndex: boolean;

        @IsEnum(SitemapPagePriority)
        @BlockField({ type: "enum", enum: SitemapPagePriority })
        priority: SitemapPagePriority;

        @IsEnum(SitemapPageChangeFrequency)
        @BlockField({ type: "enum", enum: SitemapPageChangeFrequency })
        changeFrequency: SitemapPageChangeFrequency;

        transformToBlockData(): SeoBlockData {
            return inputToData(SeoBlockData, this);
        }
    }

    return createBlock(SeoBlockData, SeoBlockInput, "Seo");
}
