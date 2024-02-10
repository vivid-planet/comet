import { PropsWithData, registerBlock } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";
import { gql } from "graphql-request";
import * as React from "react";

import { GQLNewsBlockDetailQuery, GQLNewsBlockDetailQueryVariables } from "./NewsDetailBlock.generated";

interface LoadedData {
    title: string;
}

function NewsDetailBlock({
    data: { id, loaded },
}: React.PropsWithChildren<PropsWithData<NewsLinkBlockData & { loaded: LoadedData | null }>>): JSX.Element | null {
    if (!loaded) {
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

registerBlock("NewsDetail", {
    loaderPayload(blockData: NewsLinkBlockData) {
        return blockData.id;
    },
    async loader(payload, client): Promise<LoadedData | null> {
        if (!payload) return null;
        const data = await client.request<GQLNewsBlockDetailQuery, GQLNewsBlockDetailQueryVariables>(
            gql`
                query NewsBlockDetail($id: ID!) {
                    news(id: $id) {
                        title
                    }
                }
            `,
            { id: payload },
        );
        return data.news;
    },
});
