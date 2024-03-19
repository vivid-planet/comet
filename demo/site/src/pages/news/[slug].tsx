import { PreviewData } from "@comet/cms-site";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { defaultLanguage, domain } from "@src/config";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import createGraphQLClient from "@src/util/createGraphQLClient";
import { gql } from "graphql-request";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";
import { FormattedDate } from "react-intl";

import { NotFoundProps } from "../[[...path]]";
import NotFound404 from "../404";
import { GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables } from "./[slug].generated";

export default function NewsDetailPage(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    if ("notFound" in props) {
        return <NotFound404 />;
    }

    const { news } = props;

    return (
        <div>
            <DamImageBlock data={news.image} layout="responsive" sizes="100vw" aspectRatio="16x9" />
            <h1>{news.title}</h1>
            <p>
                <FormattedDate value={news.createdAt} />
            </p>
            <hr />
            <NewsContentBlock data={news.content} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<
    { news: NonNullable<GQLNewsDetailPageQuery["newsBySlug"]> } | NotFoundProps,
    ParsedUrlQuery,
    PreviewData
> = async (context) => {
    const slug = context.params?.slug;

    if (typeof slug !== "string") {
        context.res.statusCode = 404;
        return {
            props: {
                notFound: true,
            },
        };
    }

    const client = createGraphQLClient(context.previewData);
    const locale = context.locale ?? defaultLanguage;
    const scope = { domain, language: locale };

    const data = await client.request<GQLNewsDetailPageQuery, GQLNewsDetailPageQueryVariables>(
        gql`
            query NewsDetailPage($slug: String!, $scope: NewsContentScopeInput!) {
                newsBySlug(slug: $slug, scope: $scope) {
                    id
                    title
                    image
                    createdAt
                    content
                }
            }
        `,
        { slug, scope },
    );

    if (data.newsBySlug === null) {
        context.res.statusCode = 404;
        return {
            props: {
                notFound: true,
            },
        };
    }

    return { props: { news: data.newsBySlug } };
};
