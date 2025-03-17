export const dynamic = "error";

<<<<<<< HEAD
import { gql } from "@comet/cms-site";
import { type GQLNewsContentScopeInput } from "@src/graphql.generated";
import { type VisibilityParam } from "@src/middleware/domainRewrite";
import { NewsList } from "@src/news/NewsList";
import { newsListFragment } from "@src/news/NewsList.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { setVisibilityParam } from "@src/util/ServerContext";

import { type GQLNewsIndexPageQuery, type GQLNewsIndexPageQueryVariables } from "./page.generated";
=======
import { VisibilityParam } from "@src/middleware/domainRewrite";
import { NewsPage } from "@src/news/NewsPage";
import { fetchNewsList } from "@src/news/NewsPage.loader";
import { setVisibilityParam } from "@src/util/ServerContext";

export type PageParams = {
    domain: string;
    language: string;
    visibility: VisibilityParam;
};
>>>>>>> main

export default async function NewsIndexPage({ params: { domain, language, visibility } }: { params: PageParams }) {
    setVisibilityParam(visibility);
    return <NewsPage initialData={await fetchNewsList({ scope: { domain, language }, limit: 2 })} />;
}
