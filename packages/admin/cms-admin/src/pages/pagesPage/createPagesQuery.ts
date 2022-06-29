import { gql } from "@apollo/client";
import { DocumentNode } from "graphql";

import { DocumentInterface, DocumentType } from "../../documents/types";
import { pageSearchFragment } from "../pageSearch/usePageSearch";
import { pageTreePageFragment } from "../pageTree/usePageTree";

interface CreatePagesQueryOptions {
    documentTypes?: Record<DocumentType, DocumentInterface>;
}

export const createPagesQuery = (props?: CreatePagesQueryOptions): DocumentNode => {
    const additionalDocumentFragments: Array<{ name: string; fragment: DocumentNode }> = [];
    for (const key in props?.documentTypes) {
        const fragment = props?.documentTypes[key].additionalDocumentFragment;
        if (fragment) {
            additionalDocumentFragments.push(fragment);
        }
    }

    const fragments = additionalDocumentFragments.map((fragment) => {
        return fragment.fragment;
    });

    return gql`
        query Pages($contentScope: PageTreeNodeScopeInput!, $category: PageTreeNodeCategory!) {
            pages: pageTreeNodeList(scope: $contentScope, category: $category) {
                id
                ...PageTreePage
                ...PageSearch

                document {
                     __typename
                    ${additionalDocumentFragments.map((fragment) => "...".concat(fragment.name))}
                }
            }
        }
        ${pageTreePageFragment}
        ${pageSearchFragment}
        ${fragments.length > 0 ? fragments.reduce(fragmentsReducer) : ""}
    `;
};

const fragmentsReducer = (previousValue: DocumentNode, currentValue: DocumentNode) => {
    return gql`
        ${previousValue}
        ${currentValue}
    `;
};
