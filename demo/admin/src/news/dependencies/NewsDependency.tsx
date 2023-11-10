import { gql } from "@apollo/client";
import { DependencyInterface } from "@comet/cms-admin";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import { GQLNewsDependencyQuery, GQLNewsDependencyQueryVariables } from "@src/news/dependencies/NewsDependency.generated";
import * as React from "react";
import { FormattedMessage } from "react-intl";

export const NewsDependency: DependencyInterface = {
    displayName: <FormattedMessage id="news.displayName" defaultMessage="News" />,
    getUrl: async ({ contentScopeUrl, apolloClient, id, rootColumnName, jsonPath }) => {
        const { data, error } = await apolloClient.query<GQLNewsDependencyQuery, GQLNewsDependencyQueryVariables>({
            query: gql`
                query NewsDependency($id: ID!) {
                    news(id: $id) {
                        id
                        content
                    }
                }
            `,
            variables: {
                id,
            },
        });

        if (error) {
            throw new Error(`News.getUrl: Could not find a News with id ${id}`);
        }

        let dependencyRoute = "";
        if (rootColumnName === "content") {
            dependencyRoute = `form/${NewsContentBlock.resolveDependencyRoute(
                NewsContentBlock.input2State(data.news.content),
                jsonPath.substring("root.".length),
            )}`;
        }

        return `${contentScopeUrl}/structured-content/news/${data.news.id}/edit/${dependencyRoute}`;
    },
};
