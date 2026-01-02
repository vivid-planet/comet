import * as Types from '../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoContactsGrid: 'BrevoContactsGrid'
  },
  Mutation: {
    DeleteBrevoContact: 'DeleteBrevoContact',
    UpdateBrevoContact: 'UpdateBrevoContact'
  },
  Fragment: {
    BrevoContactsList: 'BrevoContactsList'
  }
}
export type GQLBrevoContactsListFragment = { __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean };

export type GQLDeleteBrevoContactMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLDeleteBrevoContactMutation = { __typename?: 'Mutation', deleteBrevoContact: boolean };

export type GQLUpdateBrevoContactMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  input: Types.GQLBrevoContactUpdateInput;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLUpdateBrevoContactMutation = { __typename?: 'Mutation', updateBrevoContact: { __typename?: 'BrevoContact', id: number } };

export type GQLBrevoContactsGridQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoContactsGridQuery = { __typename?: 'Query', brevoContacts: { __typename?: 'PaginatedBrevoContacts', totalCount: number, nodes: Array<{ __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean }> } };
