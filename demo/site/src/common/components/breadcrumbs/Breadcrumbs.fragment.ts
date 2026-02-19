import { gql } from "@comet/site-nextjs";

export const breadcrumbsFragment = gql`
    fragment Breadcrumbs on PageTreeNode {
        name
        path
        parentNodes {
            name
            path
        }
        scope {
            language
        }
    }
`;
