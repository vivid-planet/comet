import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoContactForm: 'BrevoContactForm',
    BrevoContactFormCheckForChanges: 'BrevoContactFormCheckForChanges'
  },
  Mutation: {
    CreateBrevoTestContact: 'CreateBrevoTestContact',
    UpdateBrevoContact: 'UpdateBrevoContact'
  }
}
export type GQLBrevoContactFormQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoContactFormQuery = { __typename?: 'Query', brevoContact: { __typename?: 'BrevoContact', id: number, modifiedAt: string, email: string, createdAt: string, emailBlacklisted: boolean, smsBlacklisted: boolean } };

export type GQLBrevoContactFormCheckForChangesQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoContactFormCheckForChangesQuery = { __typename?: 'Query', brevoContact: { __typename?: 'BrevoContact', modifiedAt: string } };

export type GQLCreateBrevoTestContactMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLBrevoTestContactInput;
}>;


export type GQLCreateBrevoTestContactMutation = { __typename?: 'Mutation', createBrevoTestContact: Types.GQLSubscribeResponse };

export type GQLUpdateBrevoContactMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  input: Types.GQLBrevoContactUpdateInput;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLUpdateBrevoContactMutation = { __typename?: 'Mutation', updateBrevoContact: { __typename?: 'BrevoContact', id: number, modifiedAt: string, email: string, createdAt: string, emailBlacklisted: boolean, smsBlacklisted: boolean } };
