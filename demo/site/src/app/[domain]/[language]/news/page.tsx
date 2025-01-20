import { previewParams } from "@comet/cms-site";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { NewsPage } from "@src/news/NewsPage";
import { fetchNewsList } from "@src/news/NewsPage.loader";

export type PageParams = {
    domain: string;
    language: string;
};

export default async function NewsIndexPage({ params: { domain, language } }: { params: PageParams }) {
    const scope = ((await previewParams())?.scope || { domain, language }) as GQLNewsContentScopeInput;
    const limit = 2;
    return <NewsPage initialData={await fetchNewsList({ scope, limit })} limit={limit} />;
}
