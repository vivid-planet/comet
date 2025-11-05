import * as Types from '../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    PrebuildPageDataListSitemap: 'PrebuildPageDataListSitemap'
  }
}
export type GQLPrebuildPageDataListSitemapQueryVariables = Types.Exact<{
  scope: Types.GQLPageTreeNodeScopeInput;
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GQLPrebuildPageDataListSitemapQuery = { __typename?: 'Query', paginatedPageTreeNodes: { __typename?: 'PaginatedPageTreeNodes', totalCount: number, nodes: Array<{ __typename?: 'PageTreeNode', id: string, path: string, document: { __typename: 'Link' } | { __typename: 'Page', updatedAt: string, seo: SeoBlockData } | { __typename: 'PredefinedPage' } | null }> } };
