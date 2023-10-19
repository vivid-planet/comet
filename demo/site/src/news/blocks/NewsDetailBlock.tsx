import { PropsWithData } from "@comet/cms-site";
import { registerBlock } from "@src/blockRegistry";
import { NewsLinkBlockData } from "@src/blocks.generated";
import { gql } from "graphql-request";
import * as React from "react";

import { GQLNewsBlockDetailQuery, GQLNewsBlockDetailQueryVariables } from "./NewsDetailBlock.generated";

interface LoadedData {
    title: string;
}

function NewsDetailBlock({
    data: { id, loaded },
}: React.PropsWithChildren<PropsWithData<NewsLinkBlockData & { loaded: LoadedData }>>): JSX.Element | null {
    if (id === undefined) {
        return null;
    }

    return (
        <div>
            <h1>News #{id}</h1>
            <p>{loaded.title}</p>
        </div>
    );
}

export { NewsDetailBlock };

registerBlock<NewsLinkBlockData>("NewsDetail", {
    async loader({ blockData, client }): Promise<LoadedData | null> {
        if (!blockData.id) return null;
        const data = await client.request<GQLNewsBlockDetailQuery, GQLNewsBlockDetailQueryVariables>(gql`query NewsBlockDetail {
            news(id: "${blockData.id}") {
                title
            }
        }`);
        return data.news;
    },
});
