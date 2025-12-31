import * as Types from '../graphql.generated';

export const namedOperations = {
  Query: {
    TargetGroupForm: 'TargetGroupForm',
    TargetGroupFormCheckForChanges: 'TargetGroupFormCheckForChanges'
  },
  Mutation: {
    CreateTargetGroup: 'CreateTargetGroup',
    UpdateTargetGroup: 'UpdateTargetGroup'
  }
}
export type GQLTargetGroupFormQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLTargetGroupFormQuery = { __typename?: 'Query', brevoTargetGroup: { __typename?: 'BrevoTargetGroup', id: string, title: string, updatedAt: any, brevoId: number, assignedContactsTargetGroupBrevoId: number | null } };

export type GQLTargetGroupFormCheckForChangesQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLTargetGroupFormCheckForChangesQuery = { __typename?: 'Query', brevoTargetGroup: { __typename?: 'BrevoTargetGroup', updatedAt: any } };

export type GQLCreateTargetGroupMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLTargetGroupInput;
}>;


export type GQLCreateTargetGroupMutation = { __typename?: 'Mutation', createBrevoTargetGroup: { __typename?: 'BrevoTargetGroup', id: string, updatedAt: any } };

export type GQLUpdateTargetGroupMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.GQLTargetGroupUpdateInput;
  lastUpdatedAt?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type GQLUpdateTargetGroupMutation = { __typename?: 'Mutation', updateBrevoTargetGroup: { __typename?: 'BrevoTargetGroup', id: string, updatedAt: any } };
