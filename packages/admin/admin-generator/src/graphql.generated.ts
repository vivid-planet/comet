import {  } from "@src/blocks.generated";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type GQLInquirySortField =
  | 'sample';

export type GQLMutation = {
  __typename?: 'Mutation';
  createSample: GQLSample;
  deleteSample: Scalars['Boolean']['output'];
  updateSample: GQLSample;
};


export type GQLMutationcreateSampleArgs = {
  input: GQLSampleInput;
};


export type GQLMutationdeleteSampleArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationupdateSampleArgs = {
  id: Scalars['ID']['input'];
  input: GQLSampleUpdateInput;
};

export type GQLPaginatedSamples = {
  __typename?: 'PaginatedSamples';
  nodes: Array<GQLSample>;
  totalCount: Scalars['Int']['output'];
};

export type GQLQuery = {
  __typename?: 'Query';
  sample: GQLSample;
  samples: GQLPaginatedSamples;
};


export type GQLQuerysamplesArgs = {
  filter?: InputMaybe<GQLSampleFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLSampleSort>>;
};

export type GQLSample = {
  __typename?: 'Sample';
  id: Scalars['ID']['output'];
  sample: Scalars['String']['output'];
};

export type GQLSampleFilter = {
  and?: InputMaybe<Array<GQLSampleFilter>>;
  or?: InputMaybe<Array<GQLSampleFilter>>;
  sample?: InputMaybe<GQLStringFilter>;
};

export type GQLSampleInput = {
  sample: Scalars['String']['input'];
};

export type GQLSampleSort = {
  direction?: GQLSortDirection;
  field: GQLInquirySortField;
};

export type GQLSampleUpdateInput = {
  sample: Scalars['String']['input'];
};

export type GQLSortDirection =
  | 'ASC'
  | 'DESC';

export type GQLStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};
