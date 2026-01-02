import * as Types from '../graphql.generated';

export const namedOperations = {
  Query: {
    TargetGroupsGrid: 'TargetGroupsGrid',
    TargetGroupContacts: 'TargetGroupContacts'
  },
  Mutation: {
    DeleteTargetGroup: 'DeleteTargetGroup',
    CreateTargetGroup: 'CreateTargetGroup'
  },
  Fragment: {
    TargetGroupsList: 'TargetGroupsList',
    TargetGroupContactItem: 'TargetGroupContactItem'
  }
}
export type GQLTargetGroupsListFragment = { __typename?: 'BrevoTargetGroup', id: string, title: string, totalSubscribers: number, isMainList: boolean };

export type GQLTargetGroupContactItemFragment = { __typename?: 'BrevoContact', id: number, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean };

export type GQLTargetGroupsGridQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  sort?: Types.InputMaybe<Array<Types.GQLTargetGroupSort> | Types.GQLTargetGroupSort>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filter?: Types.InputMaybe<Types.GQLTargetGroupFilter>;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLTargetGroupsGridQuery = { __typename?: 'Query', brevoTargetGroups: { __typename?: 'PaginatedTargetGroups', totalCount: number, nodes: Array<{ __typename?: 'BrevoTargetGroup', id: string, title: string, totalSubscribers: number, isMainList: boolean }> } };

export type GQLDeleteTargetGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLDeleteTargetGroupMutation = { __typename?: 'Mutation', deleteBrevoTargetGroup: boolean };

export type GQLCreateTargetGroupMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLTargetGroupInput;
}>;


export type GQLCreateTargetGroupMutation = { __typename?: 'Mutation', createBrevoTargetGroup: { __typename?: 'BrevoTargetGroup', id: string } };

export type GQLTargetGroupContactsQueryVariables = Types.Exact<{
  targetGroupId: Types.Scalars['ID']['input'];
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLTargetGroupContactsQuery = { __typename?: 'Query', brevoContacts: { __typename?: 'PaginatedBrevoContacts', totalCount: number, nodes: Array<{ __typename?: 'BrevoContact', id: number, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean }> } };
