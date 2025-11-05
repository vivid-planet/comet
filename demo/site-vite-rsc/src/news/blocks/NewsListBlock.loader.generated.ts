import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    NewsListBlock: 'NewsListBlock'
  },
  Fragment: {
    NewsListBlockNews: 'NewsListBlockNews'
  }
}
export type GQLNewsListBlockQueryVariables = Types.Exact<{
  ids: Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input'];
}>;


export type GQLNewsListBlockQuery = { __typename?: 'Query', newsListByIds: Array<{ __typename?: 'News', id: string, title: string, slug: string, scope: { __typename?: 'NewsContentScope', domain: string, language: string } }> };

export type GQLNewsListBlockNewsFragment = { __typename?: 'News', id: string, title: string, slug: string, scope: { __typename?: 'NewsContentScope', domain: string, language: string } };
