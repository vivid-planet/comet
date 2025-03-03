"use client";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import { GQLNewsIndexPageQuery } from "./NewsPage.loader.generated";

export function NewsPage({ initialData }: { initialData: GQLNewsIndexPageQuery["newsList"] }) {
    const newsApiUrl = `${usePathname()}/api`;
    const [newsList, setNewsList] = useState(initialData.nodes);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <h1>News</h1>
            <CardList>
                {newsList.map((news) => (
                    <Card key={news.id} href={`news/${news.slug}`}>
                        <DamImageBlock data={news.image} aspectRatio="4x3" />
                        <h2>{news.title}</h2>
                        {/* <p><FormattedDate value={news.createdAt} /></p> */}
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
                                const response = await fetch(
                                    `${newsApiUrl}?${new URLSearchParams({
                                        offset: `${newsList.length}`,
                                        limit: "2",
                                    })}`,
                                );
                                setIsLoading(false);

                                if (response.ok) {
                                    setNewsList([...newsList, ...(await response.json()).nodes]);
                                } else if (response.status === 400) {
                                    setError((await response.json()).message);
                                }
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
        </>
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
