import { type BlockLoader, type BlockLoaderDependencies, recursivelyLoadBlockData as cometRecursivelyLoadBlockData } from "@comet/site-react";
import { type AllBlockNames } from "@src/blocks.generated";
import { loader as newsDetailLoader } from "@src/news/blocks/NewsDetailBlock.loader";
import { loader as newsListLoader } from "@src/news/blocks/NewsListBlock.loader";

declare module "@comet/site-react" {
    export interface BlockLoaderDependencies {
        pageTreeNodeId?: string;
    }
}

const blockLoaders: Partial<Record<AllBlockNames, BlockLoader>> = {
    NewsDetail: newsDetailLoader,
    NewsList: newsListLoader,
};

//small wrapper for @comet/site-react recursivelyLoadBlockData that injects blockMeta from block-meta.json
export async function recursivelyLoadBlockData(options: { blockType: string; blockData: unknown } & BlockLoaderDependencies) {
    const blocksMeta = await import("../../block-meta.json"); //dynamic import to avoid this json in client bundle
    return cometRecursivelyLoadBlockData({ ...options, blocksMeta: blocksMeta.default, loaders: blockLoaders });
}
