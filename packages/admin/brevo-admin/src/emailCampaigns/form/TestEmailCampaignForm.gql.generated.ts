import * as Types from '../../graphql.generated';

export const namedOperations = {
  Mutation: {
    SendEmailCampaignToTestEmails: 'SendEmailCampaignToTestEmails'
  }
}
export type GQLSendEmailCampaignToTestEmailsMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
  data: Types.GQLSendTestEmailCampaignArgs;
}>;


export type GQLSendEmailCampaignToTestEmailsMutation = { __typename?: 'Mutation', sendBrevoEmailCampaignToTestEmails: boolean };
