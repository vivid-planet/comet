import { type BlockLoader, type BlockLoaderDependencies, recursivelyLoadBlockData as cometRecursivelyLoadBlockData } from "@comet/site-nextjs";
import { type AllBlockNames } from "@src/blocks.generated";
import { loader as newsDetailLoader } from "@src/news/blocks/NewsDetailBlock.loader";
import { loader as newsListLoader } from "@src/news/blocks/NewsListBlock.loader";

declare module "@comet/site-nextjs" {
    export interface BlockLoaderDependencies {
        pageTreeNodeId?: string;
    }
}

export const blockLoaders: Partial<Record<AllBlockNames, BlockLoader>> = {
    NewsDetail: newsDetailLoader,
    NewsList: newsListLoader,
};

//small wrapper for @comet/site-nextjs recursivelyLoadBlockData that injects blockMeta from block-meta.json
export async function recursivelyLoadBlockData({
    blockType,
    blockData,
    load,
    ...dependencies
}: { blockType: string; blockData: unknown; load?: (blockType: string, blockData: unknown) => Promise<unknown> | null } & BlockLoaderDependencies) {
    const blocksMeta = await import("../../block-meta.json"); //dynamic import to avoid this json in client bundle

    function defaultLoad(blockType: string, blockData: unknown) {
        const loader = blockLoaders[blockType as AllBlockNames];
        if (!loader) return null;
        return loader({ blockData, ...dependencies }); // return unresolved promise
    }

    return cometRecursivelyLoadBlockData({ blockType, blockData, blocksMeta: blocksMeta.default, load: load || defaultLoad });
}

const cache = new Map<string, unknown>();

export async function recursivelyLoadBlockDataBlockPreview({
    blockType,
    blockData,
    showOnlyVisible,
    ...dependencies
}: { blockType: string; blockData: unknown; showOnlyVisible: boolean } & Omit<BlockLoaderDependencies, "graphQLFetch" | "fetch">) {
    const blocksMeta = await import("../../block-meta.json"); //dynamic import to avoid this json in client bundle

    async function load(blockType: string, blockData: unknown) {
        const loader = blockLoaders[blockType as AllBlockNames];
        if (!loader) return null;
        const body = JSON.stringify({
            blockType,
            blockData,
            showOnlyVisible,
            ...dependencies,
        });
        const cacheId = `${blockType}#${body}`;
        if (cache.has(cacheId)) {
            return cache.get(cacheId);
        }
        const result = await (
            await fetch("/block-preview/load-block-data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            })
        ).json();
        cache.set(cacheId, result);
        return result;
    }

    return cometRecursivelyLoadBlockData({ blockType, blockData, blocksMeta: blocksMeta.default, load });
}
