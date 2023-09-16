import { ApolloClient, gql } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { format } from "date-fns";

import { GQLCreateIncomingFolderMutation, GQLCreateIncomingFolderMutationVariables } from "./createIncomingFolder.generated";

export const createIncomingFolder = async ({
    client,
    targetScope,
    sourceScopes,
}: {
    client: ApolloClient<unknown>;
    targetScope: Record<string, unknown>;
    sourceScopes: Record<string, unknown>[];
}) => {
    const scopeString = sourceScopes.length === 0 ? "unknown" : sourceScopes.map((scope) => Object.values(scope).join("-")).join(", ");
    const date = new Date();
    const name = `Copy from ${scopeString} ${format(date, "dd.MM.yyyy")}, ${format(date, "HH:mm:ss")}`;

    const { data } = await client.mutate<GQLCreateIncomingFolderMutation, GQLCreateIncomingFolderMutationVariables>({
        mutation: gql`
            mutation CreateIncomingFolder($input: CreateDamFolderInput!, $contentScope: DamScopeInput!) {
                createDamFolder(input: $input, scope: $contentScope) {
                    id
                }
            }
        `,
        variables: {
            input: {
                name: name,
                isInboxFromOtherScope: true,
            },
            contentScope: targetScope,
        },
        context: LocalErrorScopeApolloContext,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return data!.createDamFolder;
};
