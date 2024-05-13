import * as Types from '../../../src/graphql.generated';

import { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    SitemapPageData: 'SitemapPageData'
  }
}
export type GQLSitemapPageDataQueryVariables = Types.Exact<{
  contentScope: Types.GQLPageTreeNodeScopeInput;
}>;


export type GQLSitemapPageDataQuery = { __typename?: 'Query', pageTreeNodeList: Array<{ __typename?: 'PageTreeNode', id: string, path: string, documentType: string, document: { __typename: 'Link', id: string, updatedAt: any } | { __typename: 'Page', id: string, updatedAt: any, seo: SeoBlockData } | { __typename: 'PredefinedPage', id: string } | null }> };
