import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    EmailCampaignForm: 'EmailCampaignForm',
    EmailCampaignFormCheckForChanges: 'EmailCampaignFormCheckForChanges'
  },
  Mutation: {
    CreateEmailCampaign: 'CreateEmailCampaign',
    UpdateEmailCampaign: 'UpdateEmailCampaign'
  },
  Fragment: {
    EmailCampaignForm: 'EmailCampaignForm'
  }
}
export type GQLEmailCampaignFormFragment = { __typename?: 'BrevoEmailCampaign', title: string, subject: string, scheduledAt: any | null, content: any, sendingState: Types.GQLSendingState, brevoTargetGroups: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string }> };

export type GQLEmailCampaignFormQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLEmailCampaignFormQuery = { __typename?: 'Query', brevoEmailCampaign: { __typename?: 'BrevoEmailCampaign', id: string, updatedAt: any, title: string, subject: string, scheduledAt: any | null, content: any, sendingState: Types.GQLSendingState, brevoTargetGroups: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string }> } };

export type GQLEmailCampaignFormCheckForChangesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLEmailCampaignFormCheckForChangesQuery = { __typename?: 'Query', brevoEmailCampaign: { __typename?: 'BrevoEmailCampaign', updatedAt: any } };

export type GQLCreateEmailCampaignMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLEmailCampaignInput;
}>;


export type GQLCreateEmailCampaignMutation = { __typename?: 'Mutation', brevoEmailCampaign: { __typename?: 'BrevoEmailCampaign', id: string, updatedAt: any, title: string, subject: string, scheduledAt: any | null, content: any, sendingState: Types.GQLSendingState, brevoTargetGroups: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string }> } };

export type GQLUpdateEmailCampaignMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.GQLEmailCampaignUpdateInput;
  lastUpdatedAt?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type GQLUpdateEmailCampaignMutation = { __typename?: 'Mutation', brevoEmailCampaign: { __typename?: 'BrevoEmailCampaign', id: string, updatedAt: any, title: string, subject: string, scheduledAt: any | null, content: any, sendingState: Types.GQLSendingState, brevoTargetGroups: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string }> } };
