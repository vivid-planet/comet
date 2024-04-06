import { BlockLoader, GraphQLFetch, recursivelyLoadBlockData as cometRecursivelyLoadBlockData } from "@comet/cms-site";

import { loader as newsDetailLoader } from "./news/blocks/NewsDetailBlock.loader";

const blockLoaders: Record<string, BlockLoader> = {
    NewsDetail: newsDetailLoader,
};

//small wrapper for @comet/cms-site recursivelyLoadBlockData that injects blockMeta from block-meta.json
export async function recursivelyLoadBlockData(options: { blockType: string; blockData: unknown; graphQLFetch: GraphQLFetch; fetch: typeof fetch }) {
    const blocksMeta = await import("../block-meta.json"); //dynamic import to avoid this json in client bundle
    return cometRecursivelyLoadBlockData({ ...options, blocksMeta: blocksMeta.default, loaders: blockLoaders });
}
