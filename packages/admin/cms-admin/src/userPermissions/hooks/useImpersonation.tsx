import { gql, useApolloClient } from "@apollo/client";

import {
    GQLUserPermissionsStartImpersonationMutation,
    GQLUserPermissionsStartImpersonationMutationVariables,
    GQLUserPermissionsStopImpersonationMutation,
} from "./useImpersonation.generated";

export function useImpersonation() {
    const client = useApolloClient();
    const startImpersonation = async (userId: string) => {
        const result = await client.mutate<GQLUserPermissionsStartImpersonationMutation, GQLUserPermissionsStartImpersonationMutationVariables>({
            mutation: gql`
                mutation UserPermissionsStartImpersonation($userId: String!) {
                    userPermissionsStartImpersonation(userId: $userId)
                }
            `,
            variables: {
                userId,
            },
        });
        if (result.data?.userPermissionsStartImpersonation) {
            location.href = "/";
        }
    };

    const stopImpersonation = async () => {
        const result = await client.mutate<GQLUserPermissionsStopImpersonationMutation>({
            mutation: gql`
                mutation UserPermissionsStopImpersonation {
                    userPermissionsStopImpersonation
                }
            `,
        });
        if (result.data?.userPermissionsStopImpersonation) {
            location.href = "/";
        }
    };

    return { startImpersonation, stopImpersonation };
}
