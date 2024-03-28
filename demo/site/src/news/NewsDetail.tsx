"use client";
import { DamImageBlock } from "@src/blocks/DamImageBlock";

import { NewsContentBlock } from "./blocks/NewsContentBlock";
import { GQLNewsDetailFragment } from "./NewsDetail.fragment.generated";

export function NewsDetail({ news }: { news: GQLNewsDetailFragment }) {
    return (
        <div>
            <DamImageBlock data={news.image} layout="responsive" sizes="100vw" aspectRatio="16x9" />
            <h1>{news.title}</h1>
            {/* <p>
                <FormattedDate value={news.createdAt} />
            </p> */}
            <hr />
            <NewsContentBlock data={news.content} />
        </div>
    );
}
