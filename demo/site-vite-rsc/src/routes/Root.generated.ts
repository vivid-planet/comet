import * as Types from '../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    DocumentType: 'DocumentType'
  }
}
export type GQLDocumentTypeQueryVariables = Types.Exact<{
  skipPage: Types.Scalars['Boolean']['input'];
  path: Types.Scalars['String']['input'];
  scope: Types.GQLPageTreeNodeScopeInput;
  redirectSource: Types.Scalars['String']['input'];
  redirectScope: Types.GQLRedirectScopeInput;
}>;


export type GQLDocumentTypeQuery = { __typename?: 'Query', pageTreeNodeByPath?: { __typename?: 'PageTreeNode', id: string, documentType: string } | null, redirectBySource: { __typename?: 'Redirect', target: any } | null };
