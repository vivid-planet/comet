import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Fragment: {
    Breadcrumbs: 'Breadcrumbs'
  }
}
export type GQLBreadcrumbsFragment = { __typename?: 'PageTreeNode', name: string, path: string, parentNodes: Array<{ __typename?: 'PageTreeNode', name: string, path: string }>, scope: { __typename?: 'PageTreeNodeScope', language: string } };
