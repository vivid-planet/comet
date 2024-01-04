import { TypedDocumentNode } from "@apollo/client";
import { BlockInputApi, BlockInterface } from "@comet/blocks-admin";

import { Maybe } from "../graphql.generated";
import { DependencyInterface } from "./types";

interface Query<RootBlocks extends Record<string, BlockInterface>> {
    node: Maybe<{ id: string } & { [Key in keyof RootBlocks]: BlockInputApi<RootBlocks[Key]> }>;
}

interface QueryVariables {
    id: string;
}

export function createDependencyMethods<RootBlocks extends Record<string, BlockInterface>>({
    rootBlocks,
    prefixes,
    query,
    buildUrl,
}: {
    rootBlocks: RootBlocks;
    prefixes?: { [Key in keyof RootBlocks]?: string };
    query: TypedDocumentNode<Query<RootBlocks>, QueryVariables>;
    buildUrl: (
        id: string,
        data: Query<RootBlocks>,
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
            const { data, error } = await apolloClient.query<Query<RootBlocks>, QueryVariables>({
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
                    rootBlocks[rootColumnName].input2State(data.node[rootColumnName]),
                    jsonPath.substring("root.".length),
                );
            }

            return buildUrl(id, data, { contentScopeUrl, blockUrl });
        },
    };
}
