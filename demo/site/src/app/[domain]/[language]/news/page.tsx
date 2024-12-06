"use server";

import { gql, previewParams } from "@comet/cms-site";
import { GQLNewsCategory, GQLNewsContentScopeInput } from "@src/graphql.generated";
import { NewsList } from "@src/news/NewsList";
import { newsListFragment } from "@src/news/NewsList.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";

import { GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables } from "./page.generated";

export default async function NewsIndexPage({ params: { domain, language } }: { params: { domain: string; language: string } }) {
    const scope = ((await previewParams())?.scope || { domain, language }) as GQLNewsContentScopeInput;
    const newsList = await fetchNewsList(scope);
    return <NewsList initialNewsList={newsList} scope={scope} />;
}

export async function fetchNewsList(scope: GQLNewsContentScopeInput, category?: GQLNewsCategory) {
    "use server";
    const graphqlFetch = createGraphQLFetch((await previewParams())?.previewData);

    const { newsList } = await graphqlFetch<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
        gql`
            query NewsIndexPage($scope: NewsContentScopeInput!, $sort: [NewsSort!]!, $filter: NewsFilter!) {
                newsList(scope: $scope, sort: $sort, filter: $filter) {
                    ...NewsList
                }
            }

            ${newsListFragment}
        `,
        {
            scope,
            sort: [{ field: "createdAt", direction: "DESC" }],
            filter: { category: { equal: category } },
        },
    );
    return newsList;
}
