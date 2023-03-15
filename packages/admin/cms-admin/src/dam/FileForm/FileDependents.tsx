import { gql, useQuery } from "@apollo/client";
import * as React from "react";

import { DependencyList } from "../../dependencies/DependencyList";
import { GQLDamFileDependentsQuery, GQLDamFileDependentsQueryVariables } from "./FileDependents.generated";

const damFileDependentsQuery = gql`
    query DamFileDependents($id: ID!) {
        damFile(id: $id) {
            id
            dependents {
                nodes {
                    rootGraphqlObjectType
                    rootId
                    rootColumnName
                    jsonPath
                }
                totalCount
            }
        }
    }
`;

interface FileDependentsProps {
    fileId: string;
}

export const FileDependents = ({ fileId }: FileDependentsProps) => {
    const { data, loading, error, refetch } = useQuery<GQLDamFileDependentsQuery, GQLDamFileDependentsQueryVariables>(damFileDependentsQuery, {
        variables: {
            id: fileId,
        },
    });

    return (
        <DependencyList
            loading={loading}
            error={error}
            refetch={refetch}
            dependencyItems={data?.damFile.dependents.nodes.map((dependent) => {
                return {
                    ...dependent,
                    id: dependent.rootId,
                    graphqlObjectType: dependent.rootGraphqlObjectType,
                };
            })}
        />
    );
};
