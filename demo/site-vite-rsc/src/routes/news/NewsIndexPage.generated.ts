import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    NewsIndexPage: 'NewsIndexPage'
  }
}
export type GQLNewsIndexPageQueryVariables = Types.Exact<{
  scope: Types.GQLNewsContentScopeInput;
  sort: Array<Types.GQLNewsSort> | Types.GQLNewsSort;
}>;


export type GQLNewsIndexPageQuery = { __typename?: 'Query', newsList: { __typename?: 'PaginatedNews', nodes: Array<{ __typename?: 'News', id: string, title: string, slug: string, image: DamImageBlockData, createdAt: string, scope: { __typename?: 'NewsContentScope', language: string } }> } };
