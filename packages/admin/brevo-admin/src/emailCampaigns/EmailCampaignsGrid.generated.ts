import * as Types from '../graphql.generated';

export const namedOperations = {
  Query: {
    EmailCampaignsGrid: 'EmailCampaignsGrid'
  },
  Mutation: {
    DeleteEmailCampaign: 'DeleteEmailCampaign',
    CreateEmailCampaign: 'CreateEmailCampaign'
  },
  Fragment: {
    EmailCampaignsList: 'EmailCampaignsList'
  }
}
export type GQLEmailCampaignsListFragment = { __typename?: 'BrevoEmailCampaign', id: string, updatedAt: any, createdAt: any, title: string, subject: string, sendingState: Types.GQLSendingState, scheduledAt: any | null, brevoId: number | null, content: any, brevoTargetGroups: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string }> };

export type GQLEmailCampaignsGridQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  sort?: Types.InputMaybe<Array<Types.GQLEmailCampaignSort> | Types.GQLEmailCampaignSort>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filter?: Types.InputMaybe<Types.GQLEmailCampaignFilter>;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLEmailCampaignsGridQuery = { __typename?: 'Query', brevoEmailCampaigns: { __typename?: 'PaginatedEmailCampaigns', totalCount: number, nodes: Array<{ __typename?: 'BrevoEmailCampaign', id: string, updatedAt: any, createdAt: any, title: string, subject: string, sendingState: Types.GQLSendingState, scheduledAt: any | null, brevoId: number | null, content: any, brevoTargetGroups: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string }> }> } };

export type GQLDeleteEmailCampaignMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLDeleteEmailCampaignMutation = { __typename?: 'Mutation', deleteBrevoEmailCampaign: boolean };

export type GQLCreateEmailCampaignMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLEmailCampaignInput;
}>;


export type GQLCreateEmailCampaignMutation = { __typename?: 'Mutation', createBrevoEmailCampaign: { __typename?: 'BrevoEmailCampaign', id: string } };
