import { gql } from "@apollo/client";

export const actionLogGridFragment = gql`
    fragment ActionLogGridFragment on ActionLog {
        id
        userId
        entityName
        version
        createdAt
    }
`;
