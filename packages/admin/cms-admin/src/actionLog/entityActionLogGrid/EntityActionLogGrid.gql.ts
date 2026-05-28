import { gql } from "@apollo/client";

import { actionLogCompareFragment } from "../actionLogCompare/ActionLogCompare";

export const entityActionLogGridFragment = gql`
    fragment EntityActionLogGrid on ActionLog {
        id
        userId
        entityName
        entityId
        version
        action
        createdAt
        scope
        snapshot
        ...ActionLogCompare
        previousVersion {
            ...ActionLogCompare
        }
    }
    ${actionLogCompareFragment}
`;
