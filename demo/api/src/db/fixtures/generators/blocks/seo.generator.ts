import { BlockInputInterface } from "@comet/api-blocks";
import { SitemapPageChangeFrequency, SitemapPagePriority } from "@comet/api-cms";
import { SeoBlock } from "@src/pages/blocks/seo.block";

export const generateSeoBlock = (): BlockInputInterface => {
    // @TODO Introduce randomness
    return SeoBlock.blockInputFactory({
        htmlTitle: "",
        metaDescription: "",
        openGraphTitle: "",
        openGraphDescription: "",
        openGraphImage: { block: undefined, visible: false },
        noIndex: false,
        priority: SitemapPagePriority._0_5,
        changeFrequency: SitemapPageChangeFrequency.weekly,
    });
};
