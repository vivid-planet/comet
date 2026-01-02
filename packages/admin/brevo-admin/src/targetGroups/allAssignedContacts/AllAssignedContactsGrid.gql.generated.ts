import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoContacts: 'BrevoContacts'
  },
  Fragment: {
    TargetGroupBrevoContactsList: 'TargetGroupBrevoContactsList'
  }
}
export type GQLTargetGroupBrevoContactsListFragment = { __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean };

export type GQLBrevoContactsQueryVariables = Types.Exact<{
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
  email?: Types.InputMaybe<Types.Scalars['String']['input']>;
  targetGroupId: Types.Scalars['ID']['input'];
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoContactsQuery = { __typename?: 'Query', brevoContacts: { __typename?: 'PaginatedBrevoContacts', totalCount: number, nodes: Array<{ __typename?: 'BrevoContact', id: number, createdAt: string, modifiedAt: string, email: string, emailBlacklisted: boolean, smsBlacklisted: boolean }> } };
