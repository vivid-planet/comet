import { gql } from "@apollo/client";

export const actionLogCompareQuery = gql`
    query ActionLogCompare($versionId: ID!, $versionId2: ID!) {
        beforeVersion: actionLog(id: $versionId) {
            ...ActionLogCompareFragment
        }
        afterVersion: actionLog(id: $versionId2) {
            ...ActionLogCompareFragment
        }
    }
    fragment ActionLogCompareFragment on ActionLog {
        id
        version
        snapshot
        createdAt
        userId
        entityName
    }
`;
