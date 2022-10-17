import { gql } from "@apollo/client";

export const damFolderBreadcrumbFragment = gql`
    fragment DamFolderBreadcrumb on DamFolder {
        id
        name
    }
`;

export const damFolderBreadcrumbQuery = gql`
    query DamFolderBreadcrumb($id: ID!) {
        damFolder(id: $id) {
            ...DamFolderBreadcrumb
        }
    }

    ${damFolderBreadcrumbFragment}
`;
