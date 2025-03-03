"use client";
import { DamImageBlock } from "@src/common/blocks/DamImageBlock";
import { createUrlObjectWithScope } from "@src/util/createUrlObjectWithScope";
import Link from "next/link";
import styled from "styled-components";

import { GQLNewsListFragment } from "./NewsList.fragment.generated";

export function NewsList({ newsList }: { newsList: GQLNewsListFragment }) {
    return (
        <div>
            <h1>News</h1>
            <CardList>
                {newsList.nodes.map((news) => (
                    <Card
                        key={news.id}
                        href={createUrlObjectWithScope({
                            path: `/news/${news.slug}`,
                            scope: {
                                language: news.scope.language,
                            },
                        })}
                    >
                        <DamImageBlock data={news.image} aspectRatio="4x3" />
                        <h2>{news.title}</h2>
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
