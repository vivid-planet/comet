"use client";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FormattedDate } from "react-intl";
import styled from "styled-components";

import { fetchNewsList } from "./NewsPage.loader";
import { type GQLNewsIndexPageQuery } from "./NewsPage.loader.generated";

export function NewsPage({ initialData, scope }: { initialData: GQLNewsIndexPageQuery["newsList"]; scope: { domain: string; language: string } }) {
    const pathname = usePathname();
    const [newsList, setNewsList] = useState(initialData.nodes);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div id="mainContent">
            <h1>News</h1>
            <CardList>
                {newsList.map((news) => (
                    <Card key={news.id} href={`${pathname}/${news.slug}`}>
                        <DamImageBlock data={news.image} aspectRatio="4x3" />
                        <h2>{news.title}</h2>
                        <p>
                            <FormattedDate value={news.createdAt} />
                        </p>
                    </Card>
                ))}
            </CardList>
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
        </div>
    );
}

const CardList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

const Card = styled(Link)`
    padding: 5px;
    color: black;
    text-decoration: none;
    border: 1px solid ${({ theme }) => theme.palette.gray[200]};

    &:hover {
        border-color: ${({ theme }) => theme.palette.primary.main};
    }
`;
