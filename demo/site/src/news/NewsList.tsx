"use client";
import { fetchNewsList } from "@src/app/[domain]/[language]/news/page";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { GQLNewsCategory, GQLNewsContentScopeInput } from "@src/graphql.generated";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";

import { GQLNewsListFragment } from "./NewsList.fragment.generated";

export function NewsList({ initialNewsList, scope }: { initialNewsList: GQLNewsListFragment; scope: GQLNewsContentScopeInput }) {
    const [newsList, setNewsList] = useState(initialNewsList);
    const categories = [undefined, "Events", "Company", "Awards"] as GQLNewsCategory[];

    return (
        <div>
            <h1>News</h1>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={async () => {
                        // To demonstrate server actions we don't filter on the client side
                        setNewsList(await fetchNewsList(scope, category));
                    }}
                >
                    {category ?? "All"}
                </button>
            ))}
            <CardList>
                {newsList.nodes.map((news) => (
                    <Card key={news.id} href={`/${news.scope.language}/news/${news.slug}`}>
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
    border: 1px solid ${({ theme }) => theme.colors.lightGray};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;
