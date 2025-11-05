import * as Types from '../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    Layout: 'Layout'
  }
}
export type GQLLayoutQueryVariables = Types.Exact<{
  domain: Types.Scalars['String']['input'];
  language: Types.Scalars['String']['input'];
}>;


export type GQLLayoutQuery = { __typename?: 'Query', header: { __typename?: 'MainMenu', items: Array<{ __typename?: 'MainMenuItem', id: string, node: { __typename?: 'PageTreeNode', id: string, name: string, path: string, documentType: string, childNodes: Array<{ __typename?: 'PageTreeNode', id: string, name: string, path: string, documentType: string, scope: { __typename?: 'PageTreeNodeScope', language: string }, document: { __typename: 'Link', content: LinkBlockData } | { __typename: 'Page' } | { __typename: 'PredefinedPage' } | null }>, scope: { __typename?: 'PageTreeNodeScope', language: string }, document: { __typename: 'Link', content: LinkBlockData } | { __typename: 'Page' } | { __typename: 'PredefinedPage' } | null } }> }, footer: { __typename?: 'Footer', content: FooterContentBlockData } | null };
