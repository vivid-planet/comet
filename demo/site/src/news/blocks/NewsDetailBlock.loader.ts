import { BlockLoader, gql } from "@comet/cms-site";
import { NewsLinkBlockData } from "@src/blocks.generated";

import { GQLNewsBlockDetailQuery, GQLNewsBlockDetailQueryVariables } from "./NewsDetailBlock.loader.generated";

export interface LoadedData {
    title: string;
}

export const loader: BlockLoader<NewsLinkBlockData> = async ({ blockData, graphQLFetch }): Promise<LoadedData | null> => {
    if (!blockData.id) return null;
    const data = await graphQLFetch<GQLNewsBlockDetailQuery, GQLNewsBlockDetailQueryVariables>(
        gql`
            query NewsBlockDetail($id: ID!) {
                news(id: $id) {
                    title
                }
            }
        `,
        { id: blockData.id },
    );
    return data.news;
};
