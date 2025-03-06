import * as Types from '../../graphql.generated';

import {  } from "@src/blocks.generated";
export const namedOperations = {
  Query: {
    SamplesGrid: 'SamplesGrid'
  },
  Mutation: {
    DeleteSample: 'DeleteSample',
    CreateSample: 'CreateSample'
  },
  Fragment: {
    SamplesForm: 'SamplesForm'
  }
}
export type GQLSamplesFormFragment = { __typename?: 'Sample', id: string, sample: string };

export type GQLSamplesGridQueryVariables = Types.Exact<{
  offset: Types.Scalars['Int']['input'];
  limit: Types.Scalars['Int']['input'];
  sort?: Types.InputMaybe<Array<Types.GQLSampleSort> | Types.GQLSampleSort>;
  search?: Types.InputMaybe<Types.Scalars['String']['input']>;
  filter?: Types.InputMaybe<Types.GQLSampleFilter>;
}>;


export type GQLSamplesGridQuery = { __typename?: 'Query', samples: { __typename?: 'PaginatedSamples', totalCount: number, nodes: Array<{ __typename?: 'Sample', id: string, sample: string }> } };

export type GQLDeleteSampleMutationVariables = Types.Exact<{
  id: Types.Scalars['ID']['input'];
}>;


export type GQLDeleteSampleMutation = { __typename?: 'Mutation', deleteSample: boolean };

export type GQLCreateSampleMutationVariables = Types.Exact<{
  input: Types.GQLSampleInput;
}>;


export type GQLCreateSampleMutation = { __typename?: 'Mutation', createSample: { __typename?: 'Sample', id: string } };
