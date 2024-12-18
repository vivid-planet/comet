import { gql } from "@apollo/client";
import { DocumentNode } from "graphql";

import { pageSearchFragment } from "../pageSearch/usePageSearch";
import { pageTreePageFragment } from "../pageTree/usePageTree";
import { selectedPageFragment } from "../pageTreeSelect/PageTreeSelectDialog";

export { GQLPageTreePageFragment } from "../pageTree/usePageTree";
export { GQLPagesQuery, GQLPagesQueryVariables } from "./createPagesQuery.generated";

interface CreatePagesQueryOptions {
    additionalPageTreeNodeFragment?: { name: string; fragment: DocumentNode };
}

export const createPagesQuery = ({ additionalPageTreeNodeFragment }: CreatePagesQueryOptions): DocumentNode => {
    return gql`
        query Pages($contentScope: PageTreeNodeScopeInput!, $category: String!) {
            pages: pageTreeNodeList(scope: $contentScope, category: $category) {
                id
                ...PageTreePage
                ...PageSearch
                ...SelectedPage
                ${additionalPageTreeNodeFragment ? "...".concat(additionalPageTreeNodeFragment.name) : ""}
            }
        }
        ${selectedPageFragment}
        ${pageTreePageFragment}
        ${pageSearchFragment}
        ${additionalPageTreeNodeFragment?.fragment ?? ""}
    `;
};
