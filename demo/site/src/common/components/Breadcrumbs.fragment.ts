import { gql } from "@comet/cms-site";

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
