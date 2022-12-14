import { gql } from "@apollo/client";

import { redirectActivenessFragment } from "./RedirectActiveness";

export const redirectTargetPageFragment = gql`
    fragment RedirectTargetPage on PageTreeNode {
        id
        name
        path
    }
`;

// @TODO: consider content-scope in query
//
export const redirectTableFragment = gql`
    fragment RedirectTable on Redirect {
        id
        active
        sourceType
        source
        target
        comment
        generationType
        ...RedirectActiveness
    }
    ${redirectActivenessFragment}
`;

export const paginatedRedirectsQuery = gql`
    query PaginatedRedirects(
        $scope: RedirectScopeInput!
        $type: RedirectGenerationType
        $active: Boolean
        $query: String
        $sort: [RedirectSort!]
        $offset: Int
        $limit: Int
    ) {
        paginatedRedirects(scope: $scope, type: $type, active: $active, query: $query, sort: $sort, offset: $offset, limit: $limit) {
            nodes {
                ...RedirectTable
            }
            totalCount
        }
    }
    ${redirectTableFragment}
`;

export const deleteRedirectMutation = gql`
    mutation DeleteRedirect($id: ID!) {
        deleteRedirect(id: $id)
    }
`;
