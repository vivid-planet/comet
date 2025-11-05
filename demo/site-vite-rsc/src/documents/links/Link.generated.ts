import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    LinkRedirect: 'LinkRedirect'
  }
}
export type GQLLinkRedirectQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLLinkRedirectQuery = { __typename?: 'Query', pageTreeNode: { __typename?: 'PageTreeNode', document: { __typename: 'Link', content: LinkBlockData } | { __typename: 'Page' } | { __typename: 'PredefinedPage' } | null } | null };
