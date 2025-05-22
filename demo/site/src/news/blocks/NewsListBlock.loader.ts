<<<<<<< HEAD
import { type BlockLoader, gql } from "@comet/cms-site";
import { type NewsListBlockData } from "@src/blocks.generated";
=======
import { BlockLoader, gql } from "@comet/site-nextjs";
import { NewsListBlockData } from "@src/blocks.generated";
>>>>>>> main

import { type GQLNewsListBlockNewsFragment, type GQLNewsListBlockQuery, type GQLNewsListBlockQueryVariables } from "./NewsListBlock.loader.generated";

export type LoadedData = GQLNewsListBlockNewsFragment[];

export const loader: BlockLoader<NewsListBlockData> = async ({ blockData, graphQLFetch }): Promise<LoadedData> => {
    if (blockData.ids.length === 0) {
        return [];
    }

    const data = await graphQLFetch<GQLNewsListBlockQuery, GQLNewsListBlockQueryVariables>(
        gql`
            query NewsListBlock($ids: [ID!]!) {
                newsListByIds(ids: $ids) {
                    ...NewsListBlockNews
                }
            }

            fragment NewsListBlockNews on News {
                id
                title
                slug
                scope {
                    domain
                    language
                }
            }
        `,
        { ids: blockData.ids },
    );

    return data.newsListByIds;
};
