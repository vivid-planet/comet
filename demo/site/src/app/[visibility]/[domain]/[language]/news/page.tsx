export const dynamic = "error";

import { type VisibilityParam } from "@src/middleware/domainRewrite";
import { NewsPage } from "@src/news/NewsPage";
import { fetchNewsList } from "@src/news/NewsPage.loader";
import { setVisibilityParam } from "@src/util/ServerContext";

type Params = Promise<{
    domain: string;
    language: string;
    visibility: VisibilityParam;
}>;

export default async function NewsIndexPage({ params }: { params: Params }) {
    const { visibility, domain, language } = await params;
    setVisibilityParam(visibility);
    return <NewsPage scope={{ domain, language }} initialData={await fetchNewsList({ scope: { domain, language }, limit: 2 })} />;
}
