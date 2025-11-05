import * as Types from '../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    PredefinedPages: 'PredefinedPages'
  }
}
export type GQLPredefinedPagesQueryVariables = Types.Exact<{
  scope: Types.GQLPageTreeNodeScopeInput;
}>;


export type GQLPredefinedPagesQuery = { __typename?: 'Query', paginatedPageTreeNodes: { __typename?: 'PaginatedPageTreeNodes', nodes: Array<{ __typename?: 'PageTreeNode', id: string, path: string, document: { __typename: 'Link' } | { __typename: 'Page' } | { __typename: 'PredefinedPage', type: Types.GQLPredefinedPageType | null } | null }> } };
