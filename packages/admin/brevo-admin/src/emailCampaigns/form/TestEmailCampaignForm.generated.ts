import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoTestContactsGridSelect: 'BrevoTestContactsGridSelect'
  },
  Fragment: {
    BrevoTestContactsSelectList: 'BrevoTestContactsSelectList'
  }
}
export type GQLBrevoTestContactsSelectListFragment = { __typename?: 'BrevoContact', id: number, email: string };

export type GQLBrevoTestContactsGridSelectQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoTestContactsGridSelectQuery = { __typename?: 'Query', brevoTestContacts: { __typename?: 'PaginatedBrevoContacts', totalCount: number, nodes: Array<{ __typename?: 'BrevoContact', id: number, email: string }> } };
