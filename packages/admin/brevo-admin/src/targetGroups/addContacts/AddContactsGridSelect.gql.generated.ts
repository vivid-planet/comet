import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    ManuallyAssignedBrevoContactsGrid: 'ManuallyAssignedBrevoContactsGrid',
    AllBrevoContactsGrid: 'AllBrevoContactsGrid'
  },
  Mutation: {
    AddBrevoContactsToTargetGroup: 'AddBrevoContactsToTargetGroup',
    RemoveBrevoContactFromTargetGroup: 'RemoveBrevoContactFromTargetGroup'
  },
  Fragment: {
    TargetGroupBrevoContactsList: 'TargetGroupBrevoContactsList'
  }
}
export type GQLTargetGroupBrevoContactsListFragment = { __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean };

export type GQLManuallyAssignedBrevoContactsGridQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  targetGroupId: Types.Scalars['ID']['input'];
}>;


export type GQLManuallyAssignedBrevoContactsGridQuery = { __typename?: 'Query', manuallyAssignedBrevoContacts: { __typename?: 'PaginatedBrevoContacts', totalCount: number, nodes: Array<{ __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean }> } };

export type GQLAllBrevoContactsGridQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLAllBrevoContactsGridQuery = { __typename?: 'Query', brevoContacts: { __typename?: 'PaginatedBrevoContacts', totalCount: number, nodes: Array<{ __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean }> } };

export type GQLAddBrevoContactsToTargetGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.GQLAddBrevoContactsInput;
}>;


export type GQLAddBrevoContactsToTargetGroupMutation = { __typename?: 'Mutation', addBrevoContactsToTargetGroup: boolean };

export type GQLRemoveBrevoContactFromTargetGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.GQLRemoveBrevoContactInput;
}>;


export type GQLRemoveBrevoContactFromTargetGroupMutation = { __typename?: 'Mutation', removeBrevoContactFromTargetGroup: boolean };
