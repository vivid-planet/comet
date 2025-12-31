import * as Types from '../graphql.generated';

export type GQLUnnamed_1_QueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLUnnamed_1_Query = { __typename?: 'Query', brevoConfig: { __typename?: 'BrevoConfig', updatedAt: any } | null };
