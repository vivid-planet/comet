import { BlockInputInterface, SitemapPageChangeFrequency, SitemapPagePriority } from "@comet/cms-api";
import { SeoBlock } from "@src/pages/blocks/seo.block";

export const generateSeoBlock = (): BlockInputInterface => {
    // @TODO Introduce randomness
    return SeoBlock.blockInputFactory({
        htmlTitle: "",
        metaDescription: "",
        openGraphTitle: "",
        openGraphDescription: "",
        openGraphImage: { block: undefined, visible: false },
        structuredData: undefined,
        canonicalUrl: undefined,
        alternativeLinks: [],
        noIndex: false,
        priority: SitemapPagePriority._0_5,
        changeFrequency: SitemapPageChangeFrequency.weekly,
    });
};
