import * as Types from '../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoTestContactsGrid: 'BrevoTestContactsGrid'
  },
  Mutation: {
    DeleteBrevoTestContact: 'DeleteBrevoTestContact'
  },
  Fragment: {
    BrevoContactsList: 'BrevoContactsList'
  }
}
export type GQLBrevoContactsListFragment = { __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean };

export type GQLDeleteBrevoTestContactMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLDeleteBrevoTestContactMutation = { __typename?: 'Mutation', deleteBrevoTestContact: boolean };

export type GQLBrevoTestContactsGridQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoTestContactsGridQuery = { __typename?: 'Query', brevoTestContacts: { __typename?: 'PaginatedBrevoContacts', totalCount: number, nodes: Array<{ __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean }> } };
