"use client";

import { gql } from "@comet/cms-site";
import { DamImageBlock } from "@src/blocks/DamImageBlock";
import { NewsContentBlock } from "@src/news/blocks/NewsContentBlock";
import { FormattedDate } from "react-intl";

import { GQLNewsDetailPageFragment } from "./content.generated";

export const fragment = gql`
    fragment NewsDetailPage on News {
        title
        image
        createdAt
        content
    }
`;

type Props = {
    news: GQLNewsDetailPageFragment;
};
export function Content({ news }: Props) {
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
