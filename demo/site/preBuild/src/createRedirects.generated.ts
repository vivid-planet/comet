import * as Types from '../../src/graphql.generated';

import { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    Redirects: 'Redirects'
  }
}
export type GQLRedirectsQueryVariables = Types.Exact<{
  scope: Types.GQLRedirectScopeInput;
}>;


export type GQLRedirectsQuery = { __typename?: 'Query', redirects: Array<{ __typename?: 'Redirect', sourceType: Types.GQLRedirectSourceTypeValues, source: string, target: any }> };
