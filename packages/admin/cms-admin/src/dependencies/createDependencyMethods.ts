import { TypedDocumentNode } from "@apollo/client";
import { BlockInterface } from "@comet/blocks-admin";

import { Maybe } from "../graphql.generated";
import { DependencyInterface } from "./types";

interface Query {
    node: Maybe<{
        id: string;
        [key: string]: unknown;
    }>;
}

interface QueryVariables {
    id: string;
}

export function createDependencyMethods({
    rootBlocks,
    prefixes,
    query,
    buildUrl,
}: {
    rootBlocks: Record<string, BlockInterface>;
    prefixes?: Record<string, string>;
    query: TypedDocumentNode<Query, QueryVariables>;
    buildUrl: (
        id: string,
        data: Query,
        {
            contentScopeUrl,
            blockUrl,
        }: {
            contentScopeUrl: string;
            blockUrl?: string;
        },
    ) => string;
}): Pick<DependencyInterface, "resolveUrl"> {
    return {
        resolveUrl: async ({ rootColumnName, jsonPath, contentScopeUrl, apolloClient, id }) => {
            const { data, error } = await apolloClient.query<Query, QueryVariables>({
                query,
                variables: {
                    id,
                },
            });

            if (error || data.node === null) {
                throw new Error(`Error for document ${id}: ${error?.message ?? "Document is undefined"}`);
            }

            let blockUrl: string | undefined = undefined;
            if (jsonPath && rootColumnName) {
                blockUrl = prefixes?.[rootColumnName] ?? "";
                blockUrl += rootBlocks[rootColumnName].resolveDependencyRoute(
                    rootBlocks[rootColumnName].input2State(data.node.content),
                    jsonPath.substring("root.".length),
                );
            }

            return buildUrl(id, data, { contentScopeUrl, blockUrl });
        },
    };
}
