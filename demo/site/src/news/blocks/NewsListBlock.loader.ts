import { BlockLoader, gql } from "@comet/cms-site";
import { NewsListBlockData } from "@src/blocks.generated";

import { GQLNewsListBlockNewsFragment, GQLNewsListBlockQuery, GQLNewsListBlockQueryVariables } from "./NewsListBlock.loader.generated";

export type LoadedData = GQLNewsListBlockNewsFragment[];

export const loader: BlockLoader<NewsListBlockData> = async ({ blockData, graphQLFetch }): Promise<LoadedData> => {
    const newsList: LoadedData = [];

    // TODO create a require that allows loading multiple news by IDs at once?
    for (const id of blockData.ids as string[]) {
        const data = await graphQLFetch<GQLNewsListBlockQuery, GQLNewsListBlockQueryVariables>(
            gql`
                query NewsListBlock($id: ID!) {
                    news(id: $id) {
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
            { id },
        );

        newsList.push(data.news);
    }

    return newsList;
};
