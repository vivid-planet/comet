import { gql } from "@apollo/client";

import { actionLogCompareFragment } from "../../components/actionLogCompare/ActionLogCompare";

export const actionLogGridFragment = gql`
    fragment ActionLogGrid on ActionLog {
        id
        entityName
        entityId
        version
        action
        createdAt
        scope
        snapshot
        user {
            id
            name
        }
        previousVersion {
            snapshot
        }
        ...ActionLogCompare
    }
    ${actionLogCompareFragment}
`;
