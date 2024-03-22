import { gql } from "@src/util/graphQLClient";

export const topMenuPageTreeNodeFragment = gql`
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
`;
