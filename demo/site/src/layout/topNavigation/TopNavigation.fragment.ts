import { graphql } from "@src/gql";

export const topMenuPageTreeNodeFragment = graphql(/* GraphQL */ `
    fragment TopMenuPageTreeNode on PageTreeNode {
        id
        name
        ...PageLink

        childNodes {
            id
            name
            ...PageLink
        }
    }
`);
