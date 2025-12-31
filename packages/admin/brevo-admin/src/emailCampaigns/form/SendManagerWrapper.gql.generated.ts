import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    IsBrevoConfigDefined: 'IsBrevoConfigDefined'
  }
}
export type GQLIsBrevoConfigDefinedQueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLIsBrevoConfigDefinedQuery = { __typename?: 'Query', isBrevoConfigDefined: boolean };
