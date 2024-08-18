import * as Types from '../../src/graphql.generated';

import { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    Redirects: 'Redirects'
  }
}
export type GQLRedirectsQueryVariables = Types.Exact<{
  scope: Types.GQLRedirectScopeInput;
  filter?: Types.InputMaybe<Types.GQLRedirectFilter>;
  sort?: Types.InputMaybe<Array<Types.GQLRedirectSort> | Types.GQLRedirectSort>;
  offset: Types.Scalars['Int'];
  limit: Types.Scalars['Int'];
}>;


export type GQLRedirectsQuery = { __typename?: 'Query', paginatedRedirects: { __typename?: 'PaginatedRedirects', totalCount: number, nodes: Array<{ __typename?: 'Redirect', sourceType: Types.GQLRedirectSourceTypeValues, source: string, target: any }> } };
