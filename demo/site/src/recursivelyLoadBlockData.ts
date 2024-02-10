import { recursivelyLoadBlockData as cometRecursivelyLoadBlockData } from "@comet/cms-site";
import { GraphQLClient } from "graphql-request";

//small wrapper for @comet/cms-site recursivelyLoadBlockData that injects blockMeta from block-meta.json
export async function recursivelyLoadBlockData(options: {
    blockType: string;
    blockData: unknown;
    client: GraphQLClient;
    cache?: Record<string, Record<string, unknown>>;
}) {
    const blocksMeta = await import("../block-meta.json"); //dynamic import to avoid this json in client bundle
    return cometRecursivelyLoadBlockData({ ...options, blocksMeta: blocksMeta.default });
}
