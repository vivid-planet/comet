import { gql } from "@comet/site-nextjs";

export const mobileBreadcrumbsFragment = gql`
    fragment MobileBreadcrumbs on PageTreeNode {
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
