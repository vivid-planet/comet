import { previewParams } from "@comet/cms-site";
import { GQLNewsContentScopeInput } from "@src/graphql.generated";
import { NewsList } from "@src/news/NewsList";
import { fetchNewsList } from "@src/news/NewsList.loader";

export default async function NewsIndexPage({ params: { domain, language } }: { params: { domain: string; language: string } }) {
    const scope = ((await previewParams())?.scope || { domain, language }) as GQLNewsContentScopeInput;
    return <NewsList fallbackData={await fetchNewsList({ scope })} />;
}
