import { type ApolloClient } from "@apollo/client";
import gql from "graphql-tag";

export async function queryUpdatedAt(client: ApolloClient<object>, rootQueryName: string, id: string | undefined): Promise<string | undefined> {
    if (!id) return undefined;

    const query = gql`
        query ($id: ID!) {
            ${rootQueryName}(id: $id) {
                updatedAt
            }
        }
    `;
    const { data } = await client.query({
        query,
        variables: { id },
        fetchPolicy: "no-cache",
    });
    return data[rootQueryName]?.updatedAt;
}
