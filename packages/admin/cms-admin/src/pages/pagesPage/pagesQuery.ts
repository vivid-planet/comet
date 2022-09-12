import { gql } from "@apollo/client";

import { pageSearchFragment } from "../pageSearch/usePageSearch";
import { pageTreePageFragment } from "../pageTree/usePageTree";

const pagesQuery = gql`
    query Pages($contentScope: PageTreeNodeScopeInput!, $category: String!) {
        pages: pageTreeNodeList(scope: $contentScope, category: $category) {
            id
            ...PageTreePage
            ...PageSearch
        }
    }
    ${pageTreePageFragment}
    ${pageSearchFragment}
`;

export { pagesQuery };
