import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Fragment: {
    DesktopMenu: 'DesktopMenu'
  }
}
export type GQLDesktopMenuFragment = { __typename?: 'MainMenu', items: Array<{ __typename?: 'MainMenuItem', id: string, node: { __typename?: 'PageTreeNode', id: string, name: string, path: string, documentType: string, childNodes: Array<{ __typename?: 'PageTreeNode', id: string, name: string, path: string, documentType: string, scope: { __typename?: 'PageTreeNodeScope', language: string }, document: { __typename: 'Link', content: LinkBlockData } | { __typename: 'Page' } | { __typename: 'PredefinedPage' } | null }>, scope: { __typename?: 'PageTreeNodeScope', language: string }, document: { __typename: 'Link', content: LinkBlockData } | { __typename: 'Page' } | { __typename: 'PredefinedPage' } | null } }> };
