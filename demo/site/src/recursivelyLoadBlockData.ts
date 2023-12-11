import { recursivelyLoadBlockData as cometRecursivelyLoadBlockData } from "@comet/cms-site";
import { GraphQLClient } from "graphql-request";

import blocksMeta from "../block-meta.json";

//small wrapper for @comet/cms-site recursivelyLoadBlockData that injects blockMeta from block-meta.json
export function recursivelyLoadBlockData(options: { blockType: string; blockData: unknown; client: GraphQLClient }) {
    return cometRecursivelyLoadBlockData({ ...options, blocksMeta });
}
