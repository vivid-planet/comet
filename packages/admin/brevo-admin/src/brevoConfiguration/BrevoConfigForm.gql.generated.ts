import * as Types from '../graphql.generated';

export const namedOperations = {
  Query: {
    BrevoConfigForm: 'BrevoConfigForm',
    BrevoConfigFormCheckForChanges: 'BrevoConfigFormCheckForChanges',
    SendersSelect: 'SendersSelect',
    DoubleOptInTemplatesSelect: 'DoubleOptInTemplatesSelect'
  },
  Mutation: {
    CreateBrevoConfig: 'CreateBrevoConfig',
    UpdateBrevoConfig: 'UpdateBrevoConfig'
  },
  Fragment: {
    BrevoConfigForm: 'BrevoConfigForm'
  }
}
export type GQLBrevoConfigFormFragment = { __typename?: 'BrevoConfig', senderMail: string, senderName: string, doubleOptInTemplateId: number, folderId: number, allowedRedirectionUrl: string, unsubscriptionPageId: string };

export type GQLBrevoConfigFormQueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoConfigFormQuery = { __typename?: 'Query', brevoConfig: { __typename?: 'BrevoConfig', id: string, updatedAt: any, senderMail: string, senderName: string, doubleOptInTemplateId: number, folderId: number, allowedRedirectionUrl: string, unsubscriptionPageId: string } | null };

export type GQLBrevoConfigFormCheckForChangesQueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLBrevoConfigFormCheckForChangesQuery = { __typename?: 'Query', brevoConfig: { __typename?: 'BrevoConfig', updatedAt: any } | null };

export type GQLCreateBrevoConfigMutationVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
  input: Types.GQLBrevoConfigInput;
}>;


export type GQLCreateBrevoConfigMutation = { __typename?: 'Mutation', createBrevoConfig: { __typename?: 'BrevoConfig', id: string, updatedAt: any, senderMail: string, senderName: string, doubleOptInTemplateId: number, folderId: number, allowedRedirectionUrl: string, unsubscriptionPageId: string } };

export type GQLUpdateBrevoConfigMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  input: Types.GQLBrevoConfigUpdateInput;
  lastUpdatedAt?: Types.InputMaybe<Types.Scalars['DateTime']['input']>;
}>;


export type GQLUpdateBrevoConfigMutation = { __typename?: 'Mutation', updateBrevoConfig: { __typename?: 'BrevoConfig', id: string, updatedAt: any, senderMail: string, senderName: string, doubleOptInTemplateId: number, folderId: number, allowedRedirectionUrl: string, unsubscriptionPageId: string } };

export type GQLSendersSelectQueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLSendersSelectQuery = { __typename?: 'Query', brevoSenders: Array<{ __typename?: 'BrevoApiSender', id: string, name: string, email: string }> | null };

export type GQLDoubleOptInTemplatesSelectQueryVariables = Types.Exact<{
  scope: Types.GQLEmailCampaignContentScopeInput;
}>;


export type GQLDoubleOptInTemplatesSelectQuery = { __typename?: 'Query', brevoDoubleOptInTemplates: Array<{ __typename?: 'BrevoApiEmailTemplate', id: string, name: string }> | null };
