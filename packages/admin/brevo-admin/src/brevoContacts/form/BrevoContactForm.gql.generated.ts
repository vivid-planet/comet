import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoContactForm: 'BrevoContactForm',
    BrevoContactFormCheckForChanges: 'BrevoContactFormCheckForChanges'
  },
  Mutation: {
    CreateBrevoContact: 'CreateBrevoContact',
    UpdateBrevoContact: 'UpdateBrevoContact'
  }
}
export type GQLBrevoContactFormQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoContactFormQuery = { __typename?: 'Query', brevoContact: { __typename?: 'BrevoContact', id: number, modifiedAt: string, email: string } };

export type GQLBrevoContactFormCheckForChangesQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoContactFormCheckForChangesQuery = { __typename?: 'Query', brevoContact: { __typename?: 'BrevoContact', modifiedAt: string } };

export type GQLCreateBrevoContactMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLBrevoContactInput;
}>;


export type GQLCreateBrevoContactMutation = { __typename?: 'Mutation', createBrevoContact: Types.GQLSubscribeResponse };

export type GQLUpdateBrevoContactMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  input: Types.GQLBrevoContactUpdateInput;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLUpdateBrevoContactMutation = { __typename?: 'Mutation', updateBrevoContact: { __typename?: 'BrevoContact', id: number, modifiedAt: string, email: string } };
