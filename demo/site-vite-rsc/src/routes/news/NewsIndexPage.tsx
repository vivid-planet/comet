import { NewsPage } from "@src/news/NewsPage";
import { fetchNewsList } from "@src/news/NewsPage.loader";
import type { PublicSiteConfig } from "@src/site-configs";

interface Props {
    scope: {
        domain: string;
        language: string;
    };
    siteConfig: PublicSiteConfig;
}
export async function NewsIndexPage({ scope }: Props) {
    return <NewsPage scope={scope} initialData={await fetchNewsList({ scope, limit: 2 })} />;
}
