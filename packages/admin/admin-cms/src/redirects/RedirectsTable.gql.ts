import { gql, PureQueryOptions } from "@apollo/client";

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
        targetType
        targetUrl
        targetPageId
        comment
        generationType
        targetPage {
            ...RedirectTargetPage
        }
        ...RedirectActiveness
    }
    ${redirectTargetPageFragment}
    ${redirectActivenessFragment}
`;

export const redirectsQuery = gql`
    query Redirects($type: RedirectGenerationType, $active: Boolean, $query: String) {
        redirects(type: $type, active: $active, query: $query) {
            ...RedirectTable
        }
    }
    ${redirectTableFragment}
`;

export const automaticRedirectsRefetchQueryDescription: PureQueryOptions = {
    query: redirectsQuery,
    variables: {
        type: "automatic",
    },
};

export const deleteRedirectMutation = gql`
    mutation DeleteRedirect($id: ID!) {
        deleteRedirect(id: $id)
    }
`;
