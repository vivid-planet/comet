import { type BlockLoader, type BlockLoaderDependencies, recursivelyLoadBlockData as cometRecursivelyLoadBlockData } from "@comet/site-nextjs";
import { type AllBlockNames } from "@src/blocks.generated";
import { loader as pageTreeIndexLoader } from "@src/common/blocks/PageTreeIndexBlock.loader";
import { loader as newsDetailLoader } from "@src/news/blocks/NewsDetailBlock.loader";
import { loader as newsListLoader } from "@src/news/blocks/NewsListBlock.loader";
import { type ContentScope } from "@src/site-configs";

declare module "@comet/site-nextjs" {
    export interface BlockLoaderDependencies {
        pageTreeNodeId?: string;
        scope: ContentScope;
    }
}

const blockLoaders: Partial<Record<AllBlockNames, BlockLoader>> = {
    NewsDetail: newsDetailLoader,
    NewsList: newsListLoader,
    PageTreeIndex: pageTreeIndexLoader,
};

//small wrapper for @comet/site-nextjs recursivelyLoadBlockData that injects blockMeta from block-meta.json
export async function recursivelyLoadBlockData(options: { blockType: string; blockData: unknown } & BlockLoaderDependencies) {
    const blocksMeta = await import("../../block-meta.json"); //dynamic import to avoid this json in client bundle
    return cometRecursivelyLoadBlockData({ ...options, blocksMeta: blocksMeta.default, loaders: blockLoaders });
}
