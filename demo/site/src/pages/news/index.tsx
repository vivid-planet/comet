import { PreviewData } from "@comet/cms-site";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { defaultLanguage, domain } from "@src/config";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";
import { FormattedDate } from "react-intl";
import styled from "styled-components";

import { GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables } from "./index.generated";

export default function NewsIndexPage({ newsList }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <h1>News</h1>
            <CardList>
                {newsList.nodes.map((news) => (
                    <Link key={news.id} href={`/news/${news.slug}`} passHref>
                        <Card>
                            <DamImageBlock data={news.image} aspectRatio="4x3" />
                            <h2>{news.title}</h2>
                            <p>
                                <FormattedDate value={news.createdAt} />
                            </p>
                        </Card>
                    </Link>
                ))}
            </CardList>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<GQLNewsIndexPageQuery, ParsedUrlQuery, PreviewData> = async (context) => {
    const client = createGraphQLClient(context.previewData);
    const locale = context.locale ?? defaultLanguage;
    const scope = { domain, language: locale };

    const data = await client.request<GQLNewsIndexPageQuery, GQLNewsIndexPageQueryVariables>(
        gql`
            query NewsIndexPage($scope: NewsContentScopeInput!, $sort: [NewsSort!]!) {
                newsList(scope: $scope, sort: $sort) {
                    nodes {
                        id
                        title
                        slug
                        image
                        createdAt
                    }
                }
            }
        `,
        { scope, sort: [{ field: "createdAt", direction: "DESC" }] },
    );

    return { props: data };
};

const CardList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

const Card = styled.a`
    padding: 5px;
    color: black;
    text-decoration: none;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};

    &:hover {
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;
