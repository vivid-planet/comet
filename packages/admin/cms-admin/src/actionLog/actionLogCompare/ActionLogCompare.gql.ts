import { gql } from "@apollo/client";

export const actionLogCompareFragment = gql`
    fragment ActionLogCompareFragment on ActionLog {
        id
        version
        snapshot
        createdAt
        userId
        entityName
    }
`;
