import { ApolloClient } from "@apollo/client";

import { GQLPageTreeNodeVisibility } from "../../graphql.generated";
import { GQLUpdatePageVisibilityMutation, GQLUpdatePageVisibilityMutationVariables, updatePageVisibilityMutation } from "../pageTree/PageVisibility";
import { GQLPageTreePageFragment } from "../pageTree/usePageTree";

export const pageTreeBatchUpdateVisibility = async (
    client: ApolloClient<unknown>,
    pageTreeNodes: GQLPageTreePageFragment[],
    visibility: GQLPageTreeNodeVisibility,
): Promise<void> => {
    await Promise.all(
        pageTreeNodes.map(async (pageTreeNode) => {
            await client.mutate<GQLUpdatePageVisibilityMutation, GQLUpdatePageVisibilityMutationVariables>({
                mutation: updatePageVisibilityMutation,
                variables: {
                    id: pageTreeNode.id,
                    input: {
                        visibility,
                    },
                },
            });
        }),
    );
    return;
};

export const pageTreeBatchResetVisibility = async (
    client: ApolloClient<unknown>,
    pageTreeNodesWithPreviousVisibility: Pick<GQLPageTreePageFragment, "id" | "visibility">[],
): Promise<void> => {
    await Promise.all(
        pageTreeNodesWithPreviousVisibility.map(async (pageTreeNodeWithPreviousVisibility) => {
            await client.mutate<GQLUpdatePageVisibilityMutation, GQLUpdatePageVisibilityMutationVariables>({
                mutation: updatePageVisibilityMutation,
                variables: {
                    id: pageTreeNodeWithPreviousVisibility.id,
                    input: {
                        visibility: pageTreeNodeWithPreviousVisibility.visibility,
                    },
                },
            });
        }),
    );
};
