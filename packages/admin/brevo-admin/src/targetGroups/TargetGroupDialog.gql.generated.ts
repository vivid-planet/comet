import * as Types from '../graphql.generated';

export const namedOperations = {
  Mutation: {
    CreateTargetGroup: 'CreateTargetGroup'
  }
}
export type GQLCreateTargetGroupMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLTargetGroupInput;
}>;


export type GQLCreateTargetGroupMutation = { __typename?: 'Mutation', createBrevoTargetGroup: { __typename?: 'BrevoTargetGroup', id: string } };
