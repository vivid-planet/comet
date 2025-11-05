import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Fragment: {
    PageLink: 'PageLink'
  }
}
export type GQLPageLinkFragment = { __typename?: 'PageTreeNode', path: string, documentType: string, scope: { __typename?: 'PageTreeNodeScope', language: string }, document: { __typename: 'Link', content: LinkBlockData } | { __typename: 'Page' } | { __typename: 'PredefinedPage' } | null };
