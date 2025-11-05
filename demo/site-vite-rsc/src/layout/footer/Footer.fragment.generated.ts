import * as Types from '../../graphql.generated';

import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Fragment: {
    Footer: 'Footer'
  }
}
export type GQLFooterFragment = { __typename?: 'Footer', content: FooterContentBlockData };
