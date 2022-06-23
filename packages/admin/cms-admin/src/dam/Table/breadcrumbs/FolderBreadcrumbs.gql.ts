import { gql } from "@apollo/client";

export const damFolderBreadcrumbQuery = gql`
    query DamFolderBreadcrumb($id: ID!) {
        damFolder(id: $id) {
            id
            name
        }
    }
`;
