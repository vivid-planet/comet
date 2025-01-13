import { PropsWithData, withPreview } from "@comet/cms-site";
import { NewsListBlockData } from "@src/blocks.generated";
import { resolveUrl } from "@src/util/resolveUrl";
import Link from "next/link";

import { LoadedData } from "./NewsListBlock.loader";

export const NewsListBlock = withPreview(
    ({ data: { loaded: newsList } }: PropsWithData<NewsListBlockData & { loaded: LoadedData }>) => {
        if (newsList.length === 0) {
            return null;
        }

        return (
            <ol>
                {newsList.map((news) => (
                    <li key={news.id}>
                        <Link
                            href={resolveUrl({
                                scope: {
                                    language: news.scope.language,
                                },
                                path: `/news/${news.slug}`,
                            })}
                        >
                            {news.title}
                        </Link>
                    </li>
                ))}
            </ol>
        );
    },
    { label: "News List" },
);
