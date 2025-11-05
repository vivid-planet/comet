import { gql } from "@comet/site-react";

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
