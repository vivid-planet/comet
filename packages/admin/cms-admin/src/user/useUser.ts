import { gql, useQuery } from "@apollo/client";

import { GQLCurrentUser, GQLMeQuery } from "../graphql.generated";

export function useUser(): GQLCurrentUser | undefined | null {
    const meQuery = gql`
        query Me {
            me {
                name
                role
            }
        }
    `;
    const { loading, data } = useQuery<GQLMeQuery>(meQuery);
    if (loading) return undefined;
    return data?.me;
}
