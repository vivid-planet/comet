import { gql, useQuery } from "@apollo/client";
import { DependencyList } from "@comet/cms-admin";
import { GQLPageDependenciesQuery, GQLPageDependenciesQueryVariables } from "@src/pages/PageDependencies.generated";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const pageDependenciesQuery = gql`
    query PageDependencies($id: ID!) {
        page(id: $id) {
            id
            dependencies {
                nodes {
                    targetGraphqlObjectType
                    targetId
                    rootColumnName
                    jsonPath
                }
                totalCount
            }
        }
    }
`;

interface PageDependenciesProps {
    pageId?: string;
}

export const PageDependencies = ({ pageId }: PageDependenciesProps) => {
    const { data, loading, error, refetch } = useQuery<GQLPageDependenciesQuery, GQLPageDependenciesQueryVariables>(pageDependenciesQuery, {
        variables: {
            // non-null check is done in skip
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: pageId!,
        },
        skip: pageId === undefined,
    });

    if (pageId === undefined) {
        return <FormattedMessage id="pages.pages.page.pageDependencies.pageIdUndefined" defaultMessage="Error: The page ID is undefined." />;
    }

    return (
        <DependencyList
            loading={loading}
            error={error}
            refetch={refetch}
            dependencyItems={data?.page.dependencies.nodes.map((dependency) => {
                return {
                    ...dependency,
                    id: dependency.targetId,
                    graphqlObjectType: dependency.targetGraphqlObjectType,
                };
            })}
        />
    );
};
