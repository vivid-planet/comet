"use client";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { usePathname } from "@src/framework/RouterContext";
import { fetchNewsList } from "@src/news/NewsPage.loader";
import { useState } from "react";
import { FormattedDate } from "react-intl";

import { type GQLNewsIndexPageQuery } from "./NewsPage.loader.generated";
import styles from "./NewsPage.module.scss";

export function NewsPage({ initialData, scope }: { initialData: GQLNewsIndexPageQuery["newsList"]; scope: { domain: string; language: string } }) {
    const pathname = usePathname();

    const [newsList, setNewsList] = useState(initialData.nodes);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        // ID is used for skip link
        <main id="mainContent">
            <h1>News</h1>
            <div className={styles.cardList}>
                {newsList.map((news) => (
                    <a key={news.id} href={`${pathname}/${news.slug}x`} className={styles.card}>
                        {pathname}/{news.slug}
                        <DamImageBlock data={news.image} aspectRatio="4x3" />
                        <h2>{news.title}</h2>
                        <p>
                            <FormattedDate value={news.createdAt} />
                        </p>
                    </a>
                ))}
            </div>
            <div>
                {initialData.totalCount > newsList.length && (
                    <button
                        disabled={isLoading}
                        onClick={async () => {
                            setIsLoading(true);
                            setError(null);
                            try {
                                const response = await fetchNewsList({
                                    scope,
                                    offset: newsList.length,
                                    limit: 2,
                                });
                                setIsLoading(false);
                                setNewsList([...newsList, ...response.nodes]);
                            } catch (e) {
                                setError(e.message);
                            }
                        }}
                    >
                        Load more
                    </button>
                )}
                {isLoading && <div>Loading</div>}
                {error && <div>Error: {error}</div>}
            </div>
        </main>
    );
}
