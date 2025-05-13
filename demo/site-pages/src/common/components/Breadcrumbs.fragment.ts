import { gql } from "@comet/site-next";

export const breadcrumbsFragment = gql`
    fragment Breadcrumbs on PageTreeNode {
        name
        path
        parentNodes {
            name
            path
        }
    }
`;
