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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
  /** EmailCampaignContent root block data */
  EmailCampaignContentBlockData: { input: any; output: any; }
  /** EmailCampaignContent root block input */
  EmailCampaignContentBlockInput: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export type GQLAddBrevoContactsInput = {
  brevoContactIds: Array<Scalars['Int']['input']>;
};

export type GQLBooleanFilter = {
  equal?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GQLBrevoApiCampaignStatistics = {
  __typename?: 'BrevoApiCampaignStatistics';
  /** Number of total clicks for the campaign */
  clickers: Scalars['Int']['output'];
  /** Number of complaints (Spam reports) for the campaign */
  complaints: Scalars['Int']['output'];
  /** Number of delivered emails for the campaign */
  delivered: Scalars['Int']['output'];
  /** Rate of recipients without any privacy protection option enabled in their email client, applied to all delivered emails */
  estimatedViews: Scalars['Int']['output'];
  /** Number of hardbounces for the campaign */
  hardBounces: Scalars['Int']['output'];
  /** Number of sent emails for the campaign */
  sent: Scalars['Int']['output'];
  /** Number of softbounce for the campaign */
  softBounces: Scalars['Int']['output'];
  /** Number of unique openings for the campaign */
  trackableViews: Scalars['Int']['output'];
  /** Number of unique clicks for the campaign */
  uniqueClicks: Scalars['Int']['output'];
  /** Number of unique openings for the campaign */
  uniqueViews: Scalars['Int']['output'];
  /** Number of unsubscription for the campaign */
  unsubscriptions: Scalars['Int']['output'];
  /** Number of openings for the campaign */
  viewed: Scalars['Int']['output'];
};

export type GQLBrevoApiEmailTemplate = {
  __typename?: 'BrevoApiEmailTemplate';
  createdAt: Scalars['String']['output'];
  htmlContent: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  modifiedAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  replyTo: Scalars['String']['output'];
  sender: GQLBrevoApiEmailTemplateSender;
  subject: Scalars['String']['output'];
  tag: Scalars['String']['output'];
  testSent: Scalars['Boolean']['output'];
  toField: Scalars['String']['output'];
};

export type GQLBrevoApiEmailTemplateSender = {
  __typename?: 'BrevoApiEmailTemplateSender';
  email: Scalars['String']['output'];
  id: Maybe<Scalars['String']['output']>;
  subject: Maybe<Scalars['String']['output']>;
};

export type GQLBrevoApiSender = {
  __typename?: 'BrevoApiSender';
  active: Scalars['Boolean']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ips: Maybe<Array<GQLBrevoIp>>;
  name: Scalars['String']['output'];
};

export type GQLBrevoConfig = GQLDocumentInterface & {
  __typename?: 'BrevoConfig';
  allowedRedirectionUrl: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  doubleOptInTemplateId: Scalars['Int']['output'];
  folderId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  scope: GQLEmailCampaignContentScope;
  senderMail: Scalars['String']['output'];
  senderName: Scalars['String']['output'];
  unsubscriptionPageId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLBrevoConfigInput = {
  allowedRedirectionUrl: Scalars['String']['input'];
  doubleOptInTemplateId: Scalars['Int']['input'];
  folderId: Scalars['Int']['input'];
  senderMail: Scalars['String']['input'];
  senderName: Scalars['String']['input'];
  unsubscriptionPageId: Scalars['String']['input'];
};

export type GQLBrevoConfigUpdateInput = {
  allowedRedirectionUrl?: InputMaybe<Scalars['String']['input']>;
  doubleOptInTemplateId?: InputMaybe<Scalars['Int']['input']>;
  folderId?: InputMaybe<Scalars['Int']['input']>;
  senderMail?: InputMaybe<Scalars['String']['input']>;
  senderName?: InputMaybe<Scalars['String']['input']>;
  unsubscriptionPageId?: InputMaybe<Scalars['String']['input']>;
};

export type GQLBrevoContact = {
  __typename?: 'BrevoContact';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  emailBlacklisted: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  listIds: Array<Scalars['Int']['output']>;
  listUnsubscribed: Array<Scalars['Int']['output']>;
  modifiedAt: Scalars['String']['output'];
  smsBlacklisted: Scalars['Boolean']['output'];
};

export type GQLBrevoContactFilterAttributesInput = {
  thisFilterHasNoFields____?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GQLBrevoContactInput = {
  blocked: Scalars['Boolean']['input'];
  email: Scalars['String']['input'];
  redirectionUrl: Scalars['String']['input'];
  sendDoubleOptIn?: Scalars['Boolean']['input'];
};

export type GQLBrevoContactUpdateInput = {
  blocked: Scalars['Boolean']['input'];
};

export type GQLBrevoEmailCampaign = GQLDocumentInterface & {
  __typename?: 'BrevoEmailCampaign';
  brevoId: Maybe<Scalars['Int']['output']>;
  brevoTargetGroups: Array<GQLBrevoTargetGroup>;
  content: Scalars['EmailCampaignContentBlockData']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  scheduledAt: Maybe<Scalars['DateTime']['output']>;
  scope: GQLEmailCampaignContentScope;
  sendingState: GQLSendingState;
  subject: Scalars['String']['output'];
  targetGroups: Array<GQLBrevoTargetGroup>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLBrevoIp = {
  __typename?: 'BrevoIp';
  domain: Scalars['String']['output'];
  ip: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
};

export type GQLBrevoTargetGroup = GQLDocumentInterface & {
  __typename?: 'BrevoTargetGroup';
  assignedContactsTargetGroupBrevoId: Maybe<Scalars['Int']['output']>;
  brevoId: Scalars['Int']['output'];
  brevoTotalSubscribers: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isMainList: Scalars['Boolean']['output'];
  isTestList: Scalars['Boolean']['output'];
  scope: GQLEmailCampaignContentScope;
  title: Scalars['String']['output'];
  totalSubscribers: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLBrevoTestContactInput = {
  blocked: Scalars['Boolean']['input'];
  email: Scalars['String']['input'];
};

export type GQLCsvImportInformation = {
  __typename?: 'CsvImportInformation';
  blacklisted: Scalars['Int']['output'];
  blacklistedColumns: Maybe<Array<Scalars['JSONObject']['output']>>;
  created: Scalars['Int']['output'];
  errorMessage: Maybe<Scalars['String']['output']>;
  failed: Scalars['Int']['output'];
  failedColumns: Maybe<Array<Scalars['JSONObject']['output']>>;
  updated: Scalars['Int']['output'];
};

export type GQLCurrentUserPermission = {
  __typename?: 'CurrentUserPermission';
  contentScopes: Array<Scalars['JSONObject']['output']>;
  permission: GQLPermission;
};

export type GQLDamMediaAlternative = {
  __typename?: 'DamMediaAlternative';
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  type: GQLDamMediaAlternativeType;
};

export type GQLDamMediaAlternativeType =
  | 'captions';

export type GQLDateTimeFilter = {
  equal?: InputMaybe<Scalars['DateTime']['input']>;
  greaterThan?: InputMaybe<Scalars['DateTime']['input']>;
  greaterThanEqual?: InputMaybe<Scalars['DateTime']['input']>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  isNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  lowerThan?: InputMaybe<Scalars['DateTime']['input']>;
  lowerThanEqual?: InputMaybe<Scalars['DateTime']['input']>;
  notEqual?: InputMaybe<Scalars['DateTime']['input']>;
};

export type GQLDependency = {
  __typename?: 'Dependency';
  jsonPath: Scalars['String']['output'];
  name: Maybe<Scalars['String']['output']>;
  rootColumnName: Scalars['String']['output'];
  rootGraphqlObjectType: Scalars['String']['output'];
  rootId: Scalars['String']['output'];
  secondaryInformation: Maybe<Scalars['String']['output']>;
  targetGraphqlObjectType: Scalars['String']['output'];
  targetId: Scalars['String']['output'];
  visible: Scalars['Boolean']['output'];
};

export type GQLDocumentInterface = {
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLEmailCampaignContentScope = {
  __typename?: 'EmailCampaignContentScope';
  thisScopeHasNoFields____: Maybe<Scalars['String']['output']>;
};

export type GQLEmailCampaignContentScopeInput = {
  thisScopeHasNoFields____?: InputMaybe<Scalars['String']['input']>;
};

export type GQLEmailCampaignFilter = {
  and?: InputMaybe<Array<GQLEmailCampaignFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  or?: InputMaybe<Array<GQLEmailCampaignFilter>>;
  scheduledAt?: InputMaybe<GQLDateTimeFilter>;
  sendingState?: InputMaybe<GQLSendingStateEnumFilter>;
  subject?: InputMaybe<GQLStringFilter>;
  title?: InputMaybe<GQLStringFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLEmailCampaignInput = {
  brevoTargetGroups: Array<Scalars['ID']['input']>;
  content: Scalars['EmailCampaignContentBlockInput']['input'];
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  subject: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type GQLEmailCampaignSort = {
  direction?: GQLSortDirection;
  field: GQLEmailCampaignSortField;
};

export type GQLEmailCampaignSortField =
  | 'createdAt'
  | 'scheduledAt'
  | 'subject'
  | 'title'
  | 'updatedAt';

export type GQLEmailCampaignUpdateInput = {
  brevoTargetGroups?: InputMaybe<Array<Scalars['ID']['input']>>;
  content?: InputMaybe<Scalars['EmailCampaignContentBlockInput']['input']>;
  scheduledAt?: InputMaybe<Scalars['DateTime']['input']>;
  subject?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLFocalPoint =
  | 'CENTER'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'SMART'
  | 'SOUTHEAST'
  | 'SOUTHWEST';

export type GQLImageCropArea = {
  __typename?: 'ImageCropArea';
  focalPoint: GQLFocalPoint;
  height: Maybe<Scalars['Float']['output']>;
  width: Maybe<Scalars['Float']['output']>;
  x: Maybe<Scalars['Float']['output']>;
  y: Maybe<Scalars['Float']['output']>;
};

export type GQLMutation = {
  __typename?: 'Mutation';
  addBrevoContactsToTargetGroup: Scalars['Boolean']['output'];
  createBrevoConfig: GQLBrevoConfig;
  createBrevoContact: GQLSubscribeResponse;
  createBrevoEmailCampaign: GQLBrevoEmailCampaign;
  createBrevoTargetGroup: GQLBrevoTargetGroup;
  createBrevoTestContact: GQLSubscribeResponse;
  deleteBrevoContact: Scalars['Boolean']['output'];
  deleteBrevoEmailCampaign: Scalars['Boolean']['output'];
  deleteBrevoTargetGroup: Scalars['Boolean']['output'];
  deleteBrevoTestContact: Scalars['Boolean']['output'];
  removeBrevoContactFromTargetGroup: Scalars['Boolean']['output'];
  sendBrevoEmailCampaignNow: Scalars['Boolean']['output'];
  sendBrevoEmailCampaignToTestEmails: Scalars['Boolean']['output'];
  startBrevoContactImport: GQLCsvImportInformation;
  subscribeBrevoContact: GQLSubscribeResponse;
  updateBrevoConfig: GQLBrevoConfig;
  updateBrevoContact: GQLBrevoContact;
  updateBrevoEmailCampaign: GQLBrevoEmailCampaign;
  updateBrevoTargetGroup: GQLBrevoTargetGroup;
};


export type GQLMutationaddBrevoContactsToTargetGroupArgs = {
  id: Scalars['ID']['input'];
  input: GQLAddBrevoContactsInput;
};


export type GQLMutationcreateBrevoConfigArgs = {
  input: GQLBrevoConfigInput;
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationcreateBrevoContactArgs = {
  input: GQLBrevoContactInput;
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationcreateBrevoEmailCampaignArgs = {
  input: GQLEmailCampaignInput;
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationcreateBrevoTargetGroupArgs = {
  input: GQLTargetGroupInput;
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationcreateBrevoTestContactArgs = {
  input: GQLBrevoTestContactInput;
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationdeleteBrevoContactArgs = {
  id: Scalars['Int']['input'];
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationdeleteBrevoEmailCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteBrevoTargetGroupArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteBrevoTestContactArgs = {
  id: Scalars['Int']['input'];
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationremoveBrevoContactFromTargetGroupArgs = {
  id: Scalars['ID']['input'];
  input: GQLRemoveBrevoContactInput;
};


export type GQLMutationsendBrevoEmailCampaignNowArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationsendBrevoEmailCampaignToTestEmailsArgs = {
  data: GQLSendTestEmailCampaignArgs;
  id: Scalars['ID']['input'];
};


export type GQLMutationstartBrevoContactImportArgs = {
  fileId: Scalars['ID']['input'];
  scope: GQLEmailCampaignContentScopeInput;
  sendDoubleOptIn: Scalars['Boolean']['input'];
  targetGroupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type GQLMutationsubscribeBrevoContactArgs = {
  input: GQLSubscribeInput;
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationupdateBrevoConfigArgs = {
  id: Scalars['ID']['input'];
  input: GQLBrevoConfigUpdateInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type GQLMutationupdateBrevoContactArgs = {
  id: Scalars['Int']['input'];
  input: GQLBrevoContactUpdateInput;
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLMutationupdateBrevoEmailCampaignArgs = {
  id: Scalars['ID']['input'];
  input: GQLEmailCampaignUpdateInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type GQLMutationupdateBrevoTargetGroupArgs = {
  id: Scalars['ID']['input'];
  input: GQLTargetGroupUpdateInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};

export type GQLPaginatedBrevoContacts = {
  __typename?: 'PaginatedBrevoContacts';
  nodes: Array<GQLBrevoContact>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedEmailCampaigns = {
  __typename?: 'PaginatedEmailCampaigns';
  nodes: Array<GQLBrevoEmailCampaign>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedTargetGroups = {
  __typename?: 'PaginatedTargetGroups';
  nodes: Array<GQLBrevoTargetGroup>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPermission =
  | 'blockPreview'
  | 'brevoNewsletter'
  | 'brevoNewsletterConfig'
  | 'builds'
  | 'cronJobs'
  | 'dam'
  | 'dependencies'
  | 'fileUploads'
  | 'impersonation'
  | 'pageTree'
  | 'prelogin'
  | 'sitePreview'
  | 'translation'
  | 'userPermissions'
  | 'warnings';

export type GQLQuery = {
  __typename?: 'Query';
  brevoConfig: Maybe<GQLBrevoConfig>;
  brevoContact: GQLBrevoContact;
  brevoContacts: GQLPaginatedBrevoContacts;
  brevoDoubleOptInTemplates: Maybe<Array<GQLBrevoApiEmailTemplate>>;
  brevoEmailCampaign: GQLBrevoEmailCampaign;
  brevoEmailCampaignStatistics: Maybe<GQLBrevoApiCampaignStatistics>;
  brevoEmailCampaigns: GQLPaginatedEmailCampaigns;
  brevoSenders: Maybe<Array<GQLBrevoApiSender>>;
  brevoTargetGroup: GQLBrevoTargetGroup;
  brevoTargetGroups: GQLPaginatedTargetGroups;
  brevoTestContacts: GQLPaginatedBrevoContacts;
  isBrevoConfigDefined: Scalars['Boolean']['output'];
  manuallyAssignedBrevoContacts: GQLPaginatedBrevoContacts;
};


export type GQLQuerybrevoConfigArgs = {
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLQuerybrevoContactArgs = {
  id: Scalars['Int']['input'];
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLQuerybrevoContactsArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLEmailCampaignContentScopeInput;
  targetGroupId?: InputMaybe<Scalars['ID']['input']>;
};


export type GQLQuerybrevoDoubleOptInTemplatesArgs = {
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLQuerybrevoEmailCampaignArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerybrevoEmailCampaignStatisticsArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerybrevoEmailCampaignsArgs = {
  filter?: InputMaybe<GQLEmailCampaignFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLEmailCampaignContentScopeInput;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLEmailCampaignSort>>;
};


export type GQLQuerybrevoSendersArgs = {
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLQuerybrevoTargetGroupArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerybrevoTargetGroupsArgs = {
  filter?: InputMaybe<GQLTargetGroupFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLEmailCampaignContentScopeInput;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLTargetGroupSort>>;
};


export type GQLQuerybrevoTestContactsArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLEmailCampaignContentScopeInput;
  targetGroupId?: InputMaybe<Scalars['ID']['input']>;
};


export type GQLQueryisBrevoConfigDefinedArgs = {
  scope: GQLEmailCampaignContentScopeInput;
};


export type GQLQuerymanuallyAssignedBrevoContactsArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  targetGroupId: Scalars['ID']['input'];
};

export type GQLRemoveBrevoContactInput = {
  brevoContactId: Scalars['Int']['input'];
};

export type GQLSendTestEmailCampaignArgs = {
  emails: Array<Scalars['String']['input']>;
};

export type GQLSendingState =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'SENT';

export type GQLSendingStateEnumFilter = {
  equal?: InputMaybe<GQLSendingState>;
  isAnyOf?: InputMaybe<Array<GQLSendingState>>;
  notEqual?: InputMaybe<GQLSendingState>;
};

export type GQLSortDirection =
  | 'ASC'
  | 'DESC';

export type GQLStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equal?: InputMaybe<Scalars['String']['input']>;
  isAnyOf?: InputMaybe<Array<Scalars['String']['input']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  isNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notEqual?: InputMaybe<Scalars['String']['input']>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type GQLSubscribeInput = {
  email: Scalars['String']['input'];
  redirectionUrl: Scalars['String']['input'];
};

export type GQLSubscribeResponse =
  | 'ERROR_CONTACT_ALREADY_EXISTS'
  | 'ERROR_CONTACT_IS_BLACKLISTED'
  | 'ERROR_CONTAINED_IN_ECG_RTR_LIST'
  | 'ERROR_MAXIMAL_NUMBER_OF_TEST_CONTACTS_REACHED'
  | 'ERROR_UNKNOWN'
  | 'SUCCESSFUL';

export type GQLTargetGroupFilter = {
  and?: InputMaybe<Array<GQLTargetGroupFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  isTestList?: InputMaybe<GQLBooleanFilter>;
  or?: InputMaybe<Array<GQLTargetGroupFilter>>;
  title?: InputMaybe<GQLStringFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLTargetGroupInput = {
  filters?: InputMaybe<GQLBrevoContactFilterAttributesInput>;
  title: Scalars['String']['input'];
};

export type GQLTargetGroupSort = {
  direction?: GQLSortDirection;
  field: GQLTargetGroupSortField;
};

export type GQLTargetGroupSortField =
  | 'createdAt'
  | 'title'
  | 'updatedAt';

export type GQLTargetGroupUpdateInput = {
  filters?: InputMaybe<GQLBrevoContactFilterAttributesInput>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLUserPermissionsUser = {
  __typename?: 'UserPermissionsUser';
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type GQLWarning = {
  __typename?: 'Warning';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  scope: Maybe<Scalars['JSONObject']['output']>;
  severity: GQLWarningSeverity;
  sourceInfo: GQLWarningSourceInfo;
  status: GQLWarningStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLWarningSeverity =
  | 'high'
  | 'low'
  | 'medium';

export type GQLWarningSourceInfo = {
  __typename?: 'WarningSourceInfo';
  jsonPath: Maybe<Scalars['String']['output']>;
  rootColumnName: Maybe<Scalars['String']['output']>;
  rootEntityName: Scalars['String']['output'];
  rootPrimaryKey: Scalars['String']['output'];
  targetId: Scalars['String']['output'];
};

export type GQLWarningSourceInfoInput = {
  jsonPath?: InputMaybe<Scalars['String']['input']>;
  rootColumnName?: InputMaybe<Scalars['String']['input']>;
  rootEntityName: Scalars['String']['input'];
  rootPrimaryKey: Scalars['String']['input'];
  targetId: Scalars['String']['input'];
};

export type GQLWarningStatus =
  | 'ignored'
  | 'open'
  | 'resolved';
