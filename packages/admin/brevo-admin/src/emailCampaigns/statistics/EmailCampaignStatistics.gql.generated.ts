import * as Types from '../../graphql.generated';

export const namedOperations = {
  Query: {
    EmailCampaignStatistics: 'EmailCampaignStatistics'
  }
}
export type GQLEmailCampaignStatisticsQueryVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLEmailCampaignStatisticsQuery = { __typename?: 'Query', brevoEmailCampaignStatistics: { __typename?: 'BrevoApiCampaignStatistics', uniqueClicks: number, unsubscriptions: number, delivered: number, sent: number, softBounces: number, hardBounces: number, uniqueViews: number } | null };
