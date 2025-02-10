"use client";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { fetcher } from "@src/util/Fetcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

import { GQLNewsIndexPageQuery } from "./NewsPage.loader.generated";

type News = GQLNewsIndexPageQuery["newsList"];

export function NewsPage({ initialData, limit }: { initialData: News; limit: number }) {
    const [pages, setPages] = useState<number[]>([]); // Contains array of offsets

    return (
        <>
            <h1>News</h1>
            <CardList>
                <NewsList news={initialData.nodes} />
                {pages.map((offset) => (
                    <NewsListPaged key={offset} offset={offset} limit={limit} />
                ))}
            </CardList>
            <div>
                {initialData.totalCount > (pages.at(-1) || 0) * limit && (
                    <button
                        onClick={async () => {
                            setPages([...pages, (pages.length + 1) * limit]);
                        }}
                    >
                        Load more
                    </button>
                )}
            </div>
        </>
    );
}

function NewsListPaged({ offset, limit }: { offset: number; limit: number }) {
    const { data, isLoading, error } = useSWR<News>({ url: `${usePathname()}/api`, params: { offset, limit } }, { fetcher });

    if (error) return <div>{error.toString()}</div>;
    if (isLoading) return <div>Loading...</div>;
    if (!data || data.nodes.length === 0) return <div>No News found</div>;

    return <NewsList news={data.nodes} />;
}

function NewsList({ news }: { news: News["nodes"] }) {
    return (
        <>
            {news.map((news) => (
                <Card key={news.id} href={`news/${news.slug}`}>
                    <DamImageBlock data={news.image} aspectRatio="4x3" />
                    <h2>{news.title}</h2>
                    {/* <p><FormattedDate value={news.createdAt} /></p> */}
                </Card>
            ))}
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
