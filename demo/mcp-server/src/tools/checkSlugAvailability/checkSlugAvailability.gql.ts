import { gql } from "graphql-request";

export const checkSlugAvailabilityQuery = gql`
    query CheckSlug($slug: String!, $scope: PageTreeNodeScopeInput!, $parentId: ID) {
        pageTreeNodeSlugAvailable(slug: $slug, scope: $scope, parentId: $parentId)
    }
`;
