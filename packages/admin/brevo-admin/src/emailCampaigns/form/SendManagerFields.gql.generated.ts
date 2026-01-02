import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    TargetGroupsSelect: 'TargetGroupsSelect'
  },
  Mutation: {
    SendEmailCampaignNow: 'SendEmailCampaignNow'
  },
  Fragment: {
    TargetGroupSelect: 'TargetGroupSelect'
  }
}
export type GQLTargetGroupSelectFragment = { __typename?: 'BrevoTargetGroup', id: string, title: string };

export type GQLTargetGroupsSelectQueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLTargetGroupsSelectQuery = { __typename?: 'Query', brevoTargetGroups: { __typename?: 'PaginatedTargetGroups', nodes: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string }> } };

export type GQLSendEmailCampaignNowMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLSendEmailCampaignNowMutation = { __typename?: 'Mutation', sendBrevoEmailCampaignNow: boolean };
