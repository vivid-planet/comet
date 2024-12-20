"use client";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { fetcher } from "@src/util/Fetcher";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

import { GQLNewsIndexPageQuery } from "./NewsList.loader.generated";

export function NewsList({ fallbackData }: { fallbackData: GQLNewsIndexPageQuery["newsList"]["nodes"] }) {
    const [category, setCategory] = useState<string | undefined>(undefined);
    const { data, isLoading, error } = useSWR<GQLNewsIndexPageQuery["newsList"]["nodes"]>(
        { url: "news/api", params: { category } },
        {
            fetcher,
            fallbackData,
            revalidateOnMount: false,
        },
    );

    return (
        <div>
            <h1>News</h1>
            <button
                onClick={async () => {
                    setCategory(undefined);
                }}
            >
                {category === undefined ? <b>All</b> : "All"}
            </button>
            {["Events", "Company", "Awards"].map((c) => (
                <button
                    key={c}
                    onClick={async () => {
                        setCategory(c);
                    }}
                >
                    {c === category ? <b>{c}</b> : c}
                </button>
            ))}
            {isLoading && <div>Loading...</div>}
            {error && <div>{error.toString()}</div>}
            {data && data.length === 0 && <div>No News found</div>}
            <CardList>
                {!error &&
                    !isLoading &&
                    data &&
                    data.map((news) => (
                        <Card key={news.id} href={`news/${news.slug}`}>
                            <DamImageBlock data={news.image} aspectRatio="4x3" />
                            <h2>{news.title}</h2>
                            <p>{news.category}</p>
                            {/* <p><FormattedDate value={news.createdAt} /></p> */}
                        </Card>
                    ))}
            </CardList>
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
