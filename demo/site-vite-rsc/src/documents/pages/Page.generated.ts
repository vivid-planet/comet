import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    Page: 'Page'
  }
}
export type GQLPageQueryVariables = Types.Exact<{
  pageTreeNodeId: Types.Scalars['ID']['input'];
}>;


export type GQLPageQuery = { __typename?: 'Query', pageContent: { __typename?: 'PageTreeNode', id: string, name: string, path: string, document: { __typename: 'Link' } | { __typename: 'Page', content: PageContentBlockData, seo: SeoBlockData, stage: StageBlockData } | { __typename: 'PredefinedPage' } | null, parentNodes: Array<{ __typename?: 'PageTreeNode', name: string, path: string }>, scope: { __typename?: 'PageTreeNodeScope', language: string } } | null };
