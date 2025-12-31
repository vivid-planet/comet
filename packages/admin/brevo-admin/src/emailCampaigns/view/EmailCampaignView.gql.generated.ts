import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    EmailCampaignView: 'EmailCampaignView'
  }
}
export type GQLEmailCampaignViewQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLEmailCampaignViewQuery = { __typename?: 'Query', brevoEmailCampaign: { __typename?: 'BrevoEmailCampaign', id: string, content: any } };
