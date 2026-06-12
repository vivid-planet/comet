import { gql } from "@apollo/client";

import { actionLogCompareFragment } from "../../components/actionLogCompare/ActionLogCompare";

export const actionLogsShowVersionQuery = gql`
    query ActionLogsShowVersion($id: ID!) {
        actionLog(id: $id) {
            ...ActionLogCompare
            previousVersion {
                ...ActionLogCompare
            }
        }
    }
    ${actionLogCompareFragment}
`;
