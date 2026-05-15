import { gql } from "@apollo/client";
import { actionLogCompareFragment, actionLogGridFragment, actionLogShowVersionFragment } from "@comet/cms-admin";

export const manufacturerActionLogsQuery = gql`
    query ManufacturerActionLogs($id: ID!, $offset: Int!, $limit: Int!, $sort: [ActionLogSort!]) {
        manufacturer(id: $id) {
            actionLogs(offset: $offset, limit: $limit, sort: $sort) {
                nodes {
                    ...ActionLogGridFragment
                }
                totalCount
            }
        }
    }
    ${actionLogGridFragment}
`;

export const manufacturerActionLogShowVersionQuery = gql`
    query ManufacturerActionLogShowVersion($id: ID!, $versionId: ID!) {
        manufacturer(id: $id) {
            actionLog(id: $versionId) {
                ...ActionLogShowVersionFragment
            }
        }
    }
    ${actionLogShowVersionFragment}
`;

export const manufacturerActionLogCompareVersionsQuery = gql`
    query ManufacturerActionLogCompareVersions($id: ID!, $beforeId: ID!, $afterId: ID!) {
        manufacturer(id: $id) {
            beforeVersion: actionLog(id: $beforeId) {
                ...ActionLogCompareFragment
            }
            afterVersion: actionLog(id: $afterId) {
                ...ActionLogCompareFragment
            }
        }
    }
    ${actionLogCompareFragment}
`;
