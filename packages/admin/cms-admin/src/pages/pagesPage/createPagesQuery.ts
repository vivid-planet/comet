import { gql } from "@apollo/client";
import { DocumentNode } from "graphql";

import { pageSearchFragment } from "../pageSearch/usePageSearch";
import { pageTreePageFragment } from "../pageTree/usePageTree";

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
                ${additionalPageTreeNodeFragment ? "...".concat(additionalPageTreeNodeFragment.name) : undefined}
            }
        }
        ${pageTreePageFragment}
        ${pageSearchFragment}
        ${additionalPageTreeNodeFragment?.fragment ?? ""}
    `;
};
