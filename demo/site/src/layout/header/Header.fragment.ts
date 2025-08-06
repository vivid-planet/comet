import { graphql } from "@src/gql";

export const headerFragment = graphql(/* GraphQL */ `
    fragment Header on MainMenu {
        items {
            id
            node {
                id
                name
                ...PageLink
                childNodes {
                    id
                    name
                    ...PageLink
                }
            }
        }
    }
`);
