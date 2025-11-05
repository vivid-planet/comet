"use client"; //for predefinedPages from context
import { type PropsWithData, withPreview } from "@comet/site-react";
import { type NewsListBlockData } from "@src/blocks.generated";
import { useRouterContext } from "@src/framework/RouterContext";
import { createPredefinedPageSitePath } from "@src/util/createSitePath";

import { type LoadedData } from "./NewsListBlock.loader";

export const NewsListBlock = withPreview(
    ({ data: { loaded: newsList } }: PropsWithData<NewsListBlockData & { loaded: LoadedData }>) => {
        const predefinedPages = useRouterContext().predefinedPages;
        if (newsList.length === 0) {
            return null;
        }

        return (
            <ol>
                {newsList.map((news) => (
                    <li key={news.id}>
                        <a
                            href={createPredefinedPageSitePath({
                                type: "news",
                                scope: news.scope,
                                subPath: `/${news.slug}`,
                                predefinedPages,
                            })}
                        >
                            {news.title}
                        </a>
                    </li>
                ))}
            </ol>
        );
    },
    { label: "News List" },
);
