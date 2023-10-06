import { PropsWithData } from "@comet/cms-site";
import { registerBlock } from "@src/blockRegistry";
import { NewsLinkBlockData } from "@src/blocks.generated";
import { gql } from "graphql-request";
import * as React from "react";

interface LoadedData {
    title: string;
}

function NewsDetailBlock({ data: { id, title } }: React.PropsWithChildren<PropsWithData<NewsLinkBlockData & LoadedData>>): JSX.Element | null {
    if (id === undefined) {
        return null;
    }

    return (
        <div>
            <h1>News #{id}</h1>
            <p>{title}</p>
        </div>
    );
}

export { NewsDetailBlock };

registerBlock<NewsLinkBlockData>("NewsDetail", {
    async loader({ blockData, client }) {
        if (!blockData.id) return blockData;
        const data = await client.request(gql`query NewsBlockDetail {
            news(id: "${blockData.id}") {
                title
            }
        }`);
        return { ...blockData, title: data.news.title };
    },
});
