import * as Types from '../../graphql.generated';

export const namedOperations = {
  Mutation: {
    StartBrevoContactImport: 'StartBrevoContactImport'
  }
}
export type GQLStartBrevoContactImportMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  fileId: Types.Scalars['ID']['input'];
  sendDoubleOptIn: Types.Scalars['Boolean']['input'];
  targetGroupIds?: Types.InputMaybe<Array<Types.Scalars['ID']['input']> | Types.Scalars['ID']['input']>;
}>;


export type GQLStartBrevoContactImportMutation = { __typename?: 'Mutation', startBrevoContactImport: { __typename?: 'CsvImportInformation', created: number, updated: number, failed: number, blacklisted: number, failedColumns: Array<any> | null, blacklistedColumns: Array<any> | null, errorMessage: string | null } };
