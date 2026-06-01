import { gql } from "graphql-request";

export const savePageMutation = gql`
    mutation SavePage($pageId: ID!, $input: PageInput!, $attachedPageTreeNodeId: ID) {
        savePage(pageId: $pageId, input: $input, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
            id
            content
            seo
            stage
            updatedAt
        }
    }
`;
