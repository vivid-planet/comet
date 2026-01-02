import * as Types from '../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoConfigCheck: 'BrevoConfigCheck'
  }
}
export type GQLBrevoConfigCheckQueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoConfigCheckQuery = { __typename?: 'Query', brevoConfig: { __typename?: 'BrevoConfig', id: string } | null };
