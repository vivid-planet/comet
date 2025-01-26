import { BlockLoader, BlockLoaderDependencies, recursivelyLoadBlockData as cometRecursivelyLoadBlockData } from "@comet/cms-site";

const blockLoaders: Record<string, BlockLoader> = {
    // Add your block loaders here
};

//small wrapper for @comet/cms-site recursivelyLoadBlockData that injects blockMeta from block-meta.json
export async function recursivelyLoadBlockData(options: { blockType: string; blockData: unknown } & BlockLoaderDependencies) {
    const blocksMeta = await import("../../block-meta.json"); //dynamic import to avoid this json in client bundle
    return cometRecursivelyLoadBlockData({ ...options, blocksMeta: blocksMeta.default, loaders: blockLoaders });
}
