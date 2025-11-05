import type { DamImageBlockData, FooterContentBlockData, LinkBlockData, NewsContentBlockData, PageContentBlockData, RichTextBlockData, SeoBlockData, StageBlockData } from "./blocks.generated";
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
  /** DamImage root block data */
  DamImageBlockData: { input: DamImageBlockData; output: DamImageBlockData; }
  /** DamImage root block input */
  DamImageBlockInput: { input: any; output: any; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
  /** FooterContent root block data */
  FooterContentBlockData: { input: FooterContentBlockData; output: FooterContentBlockData; }
  /** FooterContent root block input */
  FooterContentBlockInput: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
  /** Link root block data */
  LinkBlockData: { input: LinkBlockData; output: LinkBlockData; }
  /** Link root block input */
  LinkBlockInput: { input: any; output: any; }
  /** A local date string (i.e., with no associated timezone) in `YYYY-MM-DD` format, e.g. `2020-01-01`. */
  LocalDate: { input: string; output: string; }
  /** NewsContent root block data */
  NewsContentBlockData: { input: NewsContentBlockData; output: NewsContentBlockData; }
  /** NewsContent root block input */
  NewsContentBlockInput: { input: any; output: any; }
  /** PageContent root block data */
  PageContentBlockData: { input: PageContentBlockData; output: PageContentBlockData; }
  /** PageContent root block input */
  PageContentBlockInput: { input: any; output: any; }
  /** RichText root block data */
  RichTextBlockData: { input: RichTextBlockData; output: RichTextBlockData; }
  /** RichText root block input */
  RichTextBlockInput: { input: any; output: any; }
  /** Seo root block data */
  SeoBlockData: { input: SeoBlockData; output: SeoBlockData; }
  /** Seo root block input */
  SeoBlockInput: { input: any; output: any; }
  /** Stage root block data */
  StageBlockData: { input: StageBlockData; output: StageBlockData; }
  /** Stage root block input */
  StageBlockInput: { input: any; output: any; }
};

export type GQLAddress = {
  __typename?: 'Address';
  alternativeAddress: Maybe<GQLAlternativeAddress>;
  country: Scalars['String']['output'];
  street: Scalars['String']['output'];
  streetNumber: Maybe<Scalars['Float']['output']>;
  zip: Scalars['String']['output'];
};

export type GQLAddressAsEmbeddable = {
  __typename?: 'AddressAsEmbeddable';
  alternativeAddress: GQLAlternativeAddressAsEmbeddable;
  country: Scalars['String']['output'];
  street: Scalars['String']['output'];
  streetNumber: Maybe<Scalars['Float']['output']>;
  zip: Scalars['String']['output'];
};

export type GQLAddressAsEmbeddableInput = {
  alternativeAddress: GQLAlternativeAddressAsEmbeddableInput;
  country: Scalars['String']['input'];
  street: Scalars['String']['input'];
  streetNumber?: InputMaybe<Scalars['Float']['input']>;
  zip: Scalars['String']['input'];
};

export type GQLAddressInput = {
  alternativeAddress?: InputMaybe<GQLAlternativeAddressInput>;
  country: Scalars['String']['input'];
  street: Scalars['String']['input'];
  streetNumber?: InputMaybe<Scalars['Float']['input']>;
  zip: Scalars['String']['input'];
};

export type GQLAlternativeAddress = {
  __typename?: 'AlternativeAddress';
  country: Scalars['String']['output'];
  street: Scalars['String']['output'];
  streetNumber: Maybe<Scalars['Float']['output']>;
  zip: Scalars['String']['output'];
};

export type GQLAlternativeAddressAsEmbeddable = {
  __typename?: 'AlternativeAddressAsEmbeddable';
  country: Scalars['String']['output'];
  street: Scalars['String']['output'];
  streetNumber: Maybe<Scalars['Float']['output']>;
  zip: Scalars['String']['output'];
};

export type GQLAlternativeAddressAsEmbeddableInput = {
  country: Scalars['String']['input'];
  street: Scalars['String']['input'];
  streetNumber?: InputMaybe<Scalars['Float']['input']>;
  zip: Scalars['String']['input'];
};

export type GQLAlternativeAddressInput = {
  country: Scalars['String']['input'];
  street: Scalars['String']['input'];
  streetNumber?: InputMaybe<Scalars['Float']['input']>;
  zip: Scalars['String']['input'];
};

export type GQLAttachedDocumentInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type GQLAutoBuildStatus = {
  __typename?: 'AutoBuildStatus';
  hasChangesSinceLastBuild: Scalars['Boolean']['output'];
  lastCheck: Maybe<Scalars['DateTime']['output']>;
  nextCheck: Scalars['DateTime']['output'];
};

export type GQLBooleanFilter = {
  equal?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GQLBuild = {
  __typename?: 'Build';
  completionTime: Maybe<Scalars['DateTime']['output']>;
  estimatedCompletionTime: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** Human readable label provided by comet-dxp.com/label annotation. Use name as fallback if not present */
  label: Maybe<Scalars['String']['output']>;
  name: Maybe<Scalars['String']['output']>;
  startTime: Maybe<Scalars['DateTime']['output']>;
  status: GQLKubernetesJobStatus;
  trigger: Maybe<Scalars['String']['output']>;
};

export type GQLBuildTemplate = {
  __typename?: 'BuildTemplate';
  id: Scalars['ID']['output'];
  /** Human readable label provided by comet-dxp.com/label annotation. Use name as fallback if not present */
  label: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type GQLContentScopeWithLabel = {
  __typename?: 'ContentScopeWithLabel';
  label: Scalars['JSONObject']['output'];
  scope: Scalars['JSONObject']['output'];
};

export type GQLCoordinates = {
  __typename?: 'Coordinates';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
};

export type GQLCoordinatesInput = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type GQLCopyFilesResponse = {
  __typename?: 'CopyFilesResponse';
  mappedFiles: Array<GQLMappedFile>;
};

export type GQLCreateBuildsInput = {
  names: Array<Scalars['String']['input']>;
};

export type GQLCreateDamFolderInput = {
  isInboxFromOtherScope?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type GQLCurrentUser = {
  __typename?: 'CurrentUser';
  allowedContentScopes: Array<GQLContentScopeWithLabel>;
  authenticatedUser: Maybe<GQLUserPermissionsUser>;
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  impersonated: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  permissions: Array<GQLCurrentUserPermission>;
  permissionsForScope: Array<Scalars['String']['output']>;
};


export type GQLCurrentUserpermissionsForScopeArgs = {
  scope: Scalars['JSONObject']['input'];
};

export type GQLCurrentUserPermission = {
  __typename?: 'CurrentUserPermission';
  contentScopes: Array<Scalars['JSONObject']['output']>;
  permission: GQLPermission;
};

export type GQLDamFile = {
  __typename?: 'DamFile';
  altText: Maybe<Scalars['String']['output']>;
  alternativesForThisFile: Array<GQLDamMediaAlternative>;
  archived: Scalars['Boolean']['output'];
  contentHash: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  damPath: Scalars['String']['output'];
  dependents: GQLPaginatedDependencies;
  duplicates: Array<GQLDamFile>;
  fileUrl: Scalars['String']['output'];
  folder: Maybe<GQLDamFolder>;
  id: Scalars['ID']['output'];
  image: Maybe<GQLDamFileImage>;
  importSourceId: Maybe<Scalars['String']['output']>;
  importSourceType: Maybe<Scalars['String']['output']>;
  license: Maybe<GQLDamFileLicense>;
  mimetype: Scalars['String']['output'];
  name: Scalars['String']['output'];
  scope: GQLDamScope;
  size: Scalars['Int']['output'];
  thisFileIsAlternativeFor: Array<GQLDamMediaAlternative>;
  title: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};


export type GQLDamFiledependentsArgs = {
  filter?: InputMaybe<GQLDependentFilter>;
  forceRefresh?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type GQLDamFileImage = {
  __typename?: 'DamFileImage';
  cropArea: GQLImageCropArea;
  dominantColor: Maybe<Scalars['String']['output']>;
  exif: Maybe<Scalars['JSONObject']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  url: Maybe<Scalars['String']['output']>;
  width: Scalars['Int']['output'];
};


export type GQLDamFileImageurlArgs = {
  height: Scalars['Int']['input'];
  width: Scalars['Int']['input'];
};

export type GQLDamFileLicense = {
  __typename?: 'DamFileLicense';
  author: Maybe<Scalars['String']['output']>;
  details: Maybe<Scalars['String']['output']>;
  durationFrom: Maybe<Scalars['DateTime']['output']>;
  durationTo: Maybe<Scalars['DateTime']['output']>;
  /** The expirationDate is the durationTo + 1 day */
  expirationDate: Maybe<Scalars['DateTime']['output']>;
  expiresWithinThirtyDays: Scalars['Boolean']['output'];
  hasExpired: Scalars['Boolean']['output'];
  isNotValidYet: Scalars['Boolean']['output'];
  isValid: Scalars['Boolean']['output'];
  type: Maybe<GQLLicenseType>;
};

export type GQLDamFolder = {
  __typename?: 'DamFolder';
  archived: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isInboxFromOtherScope: Scalars['Boolean']['output'];
  mpath: Array<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  numberOfChildFolders: Scalars['Int']['output'];
  numberOfFiles: Scalars['Int']['output'];
  parent: Maybe<GQLDamFolder>;
  parents: Array<GQLDamFolder>;
  scope: GQLDamScope;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLDamItem = GQLDamFile | GQLDamFolder;

export type GQLDamItemFilterInput = {
  mimetypes?: InputMaybe<Array<Scalars['String']['input']>>;
  searchText?: InputMaybe<Scalars['String']['input']>;
};

export type GQLDamItemType =
  | 'File'
  | 'Folder';

export type GQLDamMediaAlternative = {
  __typename?: 'DamMediaAlternative';
  alternative: GQLDamFile;
  for: GQLDamFile;
  id: Scalars['ID']['output'];
  language: Scalars['String']['output'];
  type: GQLDamMediaAlternativeType;
};

export type GQLDamMediaAlternativeInput = {
  language: Scalars['String']['input'];
  type: GQLDamMediaAlternativeType;
};

export type GQLDamMediaAlternativeSort = {
  direction?: GQLSortDirection;
  field: GQLDamMediaAlternativeSortField;
};

export type GQLDamMediaAlternativeSortField =
  | 'alternative'
  | 'for'
  | 'id'
  | 'language'
  | 'type';

export type GQLDamMediaAlternativeType =
  | 'captions';

export type GQLDamMediaAlternativeUpdateInput = {
  alternative?: InputMaybe<Scalars['ID']['input']>;
  for?: InputMaybe<Scalars['ID']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<GQLDamMediaAlternativeType>;
};

export type GQLDamScope = {
  __typename?: 'DamScope';
  domain: Scalars['String']['output'];
};

export type GQLDamScopeInput = {
  domain: Scalars['String']['input'];
};

export type GQLDateFilter = {
  equal?: InputMaybe<Scalars['LocalDate']['input']>;
  greaterThan?: InputMaybe<Scalars['LocalDate']['input']>;
  greaterThanEqual?: InputMaybe<Scalars['LocalDate']['input']>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  isNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  lowerThan?: InputMaybe<Scalars['LocalDate']['input']>;
  lowerThanEqual?: InputMaybe<Scalars['LocalDate']['input']>;
  notEqual?: InputMaybe<Scalars['LocalDate']['input']>;
};

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

export type GQLDependencyFilter = {
  rootColumnName?: InputMaybe<Scalars['String']['input']>;
  targetGraphqlObjectType?: InputMaybe<Scalars['String']['input']>;
  targetId?: InputMaybe<Scalars['String']['input']>;
};

export type GQLDependentFilter = {
  rootColumnName?: InputMaybe<Scalars['String']['input']>;
  rootGraphqlObjectType?: InputMaybe<Scalars['String']['input']>;
  rootId?: InputMaybe<Scalars['String']['input']>;
};

export type GQLDocumentInterface = {
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLEntityInfo = {
  __typename?: 'EntityInfo';
  name: Scalars['String']['output'];
  secondaryInformation: Maybe<Scalars['String']['output']>;
};

export type GQLFileFilterInput = {
  mimetypes?: InputMaybe<Array<Scalars['String']['input']>>;
  searchText?: InputMaybe<Scalars['String']['input']>;
};

export type GQLFileUpload = {
  __typename?: 'FileUpload';
  contentHash: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  downloadUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  mimetype: Scalars['String']['output'];
  name: Scalars['String']['output'];
  previewUrl: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type GQLFileUploadimageUrlArgs = {
  resizeWidth: Scalars['Int']['input'];
};

export type GQLFilenameInput = {
  folderId?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

export type GQLFilenameResponse = {
  __typename?: 'FilenameResponse';
  folderId: Maybe<Scalars['ID']['output']>;
  isOccupied: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type GQLFocalPoint =
  | 'CENTER'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'SMART'
  | 'SOUTHEAST'
  | 'SOUTHWEST';

export type GQLFolderFilterInput = {
  searchText?: InputMaybe<Scalars['String']['input']>;
};

export type GQLFooter = {
  __typename?: 'Footer';
  content: Scalars['FooterContentBlockData']['output'];
  createdAt: Scalars['DateTime']['output'];
  dependencies: GQLPaginatedDependencies;
  id: Scalars['ID']['output'];
  scope: GQLFooterScope;
  updatedAt: Scalars['DateTime']['output'];
};


export type GQLFooterdependenciesArgs = {
  filter?: InputMaybe<GQLDependencyFilter>;
  forceRefresh?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type GQLFooterInput = {
  content: Scalars['FooterContentBlockInput']['input'];
};

export type GQLFooterScope = {
  __typename?: 'FooterScope';
  domain: Scalars['String']['output'];
  language: Scalars['String']['output'];
};

export type GQLFooterScopeInput = {
  domain: Scalars['String']['input'];
  language: Scalars['String']['input'];
};

export type GQLIdFilter = {
  equal?: InputMaybe<Scalars['ID']['input']>;
  isAnyOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  notEqual?: InputMaybe<Scalars['ID']['input']>;
};

export type GQLImageCropArea = {
  __typename?: 'ImageCropArea';
  focalPoint: GQLFocalPoint;
  height: Maybe<Scalars['Float']['output']>;
  width: Maybe<Scalars['Float']['output']>;
  x: Maybe<Scalars['Float']['output']>;
  y: Maybe<Scalars['Float']['output']>;
};

export type GQLImageCropAreaInput = {
  focalPoint: GQLFocalPoint;
  height?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type GQLKubernetesCronJob = {
  __typename?: 'KubernetesCronJob';
  id: Scalars['ID']['output'];
  /** Human readable label provided by comet-dxp.com/label annotation. Use name as fallback if not present */
  label: Maybe<Scalars['String']['output']>;
  lastJobRun: Maybe<GQLKubernetesJob>;
  lastScheduledAt: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  schedule: Scalars['String']['output'];
};

export type GQLKubernetesJob = {
  __typename?: 'KubernetesJob';
  completionTime: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  /** Human readable label provided by comet-dxp.com/label annotation. Use name as fallback if not present */
  label: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  startTime: Maybe<Scalars['DateTime']['output']>;
  status: GQLKubernetesJobStatus;
};

export type GQLKubernetesJobStatus =
  | 'active'
  | 'failed'
  | 'pending'
  | 'succeeded';

export type GQLLicenseInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  details?: InputMaybe<Scalars['String']['input']>;
  durationFrom?: InputMaybe<Scalars['DateTime']['input']>;
  durationTo?: InputMaybe<Scalars['DateTime']['input']>;
  type?: InputMaybe<GQLLicenseType>;
};

export type GQLLicenseType =
  | 'RIGHTS_MANAGED'
  | 'ROYALTY_FREE';

export type GQLLink = GQLDocumentInterface & {
  __typename?: 'Link';
  content: Scalars['LinkBlockData']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  pageTreeNode: Maybe<GQLPageTreeNode>;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLLinkInput = {
  content: Scalars['LinkBlockInput']['input'];
};

export type GQLMainMenu = {
  __typename?: 'MainMenu';
  items: Array<GQLMainMenuItem>;
};

export type GQLMainMenuItem = {
  __typename?: 'MainMenuItem';
  content: Maybe<Scalars['RichTextBlockData']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dependencies: GQLPaginatedDependencies;
  id: Scalars['ID']['output'];
  node: GQLPageTreeNode;
  updatedAt: Scalars['DateTime']['output'];
};


export type GQLMainMenuItemdependenciesArgs = {
  filter?: InputMaybe<GQLDependencyFilter>;
  forceRefresh?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type GQLMainMenuItemInput = {
  content?: InputMaybe<Scalars['RichTextBlockInput']['input']>;
};

export type GQLManufacturer = {
  __typename?: 'Manufacturer';
  address: Maybe<GQLAddress>;
  addressAsEmbeddable: GQLAddressAsEmbeddable;
  coordinates: Maybe<GQLCoordinates>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLManufacturerCountry = {
  __typename?: 'ManufacturerCountry';
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
  used: Scalars['Float']['output'];
};

export type GQLManufacturerCountryFilter = {
  and?: InputMaybe<Array<GQLManufacturerCountryFilter>>;
  id?: InputMaybe<GQLStringFilter>;
  label?: InputMaybe<GQLStringFilter>;
  or?: InputMaybe<Array<GQLManufacturerCountryFilter>>;
  used?: InputMaybe<GQLNumberFilter>;
};

export type GQLManufacturerFilter = {
  addressAsEmbeddable_alternativeAddress_country?: InputMaybe<GQLStringFilter>;
  addressAsEmbeddable_alternativeAddress_street?: InputMaybe<GQLStringFilter>;
  addressAsEmbeddable_alternativeAddress_streetNumber?: InputMaybe<GQLNumberFilter>;
  addressAsEmbeddable_alternativeAddress_zip?: InputMaybe<GQLStringFilter>;
  addressAsEmbeddable_country?: InputMaybe<GQLStringFilter>;
  addressAsEmbeddable_street?: InputMaybe<GQLStringFilter>;
  addressAsEmbeddable_streetNumber?: InputMaybe<GQLNumberFilter>;
  addressAsEmbeddable_zip?: InputMaybe<GQLStringFilter>;
  and?: InputMaybe<Array<GQLManufacturerFilter>>;
  id?: InputMaybe<GQLIdFilter>;
  name?: InputMaybe<GQLStringFilter>;
  or?: InputMaybe<Array<GQLManufacturerFilter>>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLManufacturerInput = {
  address?: InputMaybe<GQLAddressInput>;
  addressAsEmbeddable: GQLAddressAsEmbeddableInput;
  coordinates?: InputMaybe<GQLCoordinatesInput>;
  name: Scalars['String']['input'];
};

export type GQLManufacturerSort = {
  direction?: GQLSortDirection;
  field: GQLManufacturerSortField;
};

export type GQLManufacturerSortField =
  | 'addressAsEmbeddable_alternativeAddress_country'
  | 'addressAsEmbeddable_alternativeAddress_street'
  | 'addressAsEmbeddable_alternativeAddress_streetNumber'
  | 'addressAsEmbeddable_alternativeAddress_zip'
  | 'addressAsEmbeddable_country'
  | 'addressAsEmbeddable_street'
  | 'addressAsEmbeddable_streetNumber'
  | 'addressAsEmbeddable_zip'
  | 'name'
  | 'updatedAt';

export type GQLManufacturerUpdateInput = {
  address?: InputMaybe<GQLAddressInput>;
  addressAsEmbeddable?: InputMaybe<GQLAddressAsEmbeddableInput>;
  coordinates?: InputMaybe<GQLCoordinatesInput>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GQLManyToManyFilter = {
  contains?: InputMaybe<Scalars['ID']['input']>;
  isAnyOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GQLManyToOneFilter = {
  equal?: InputMaybe<Scalars['ID']['input']>;
  isAnyOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  notEqual?: InputMaybe<Scalars['ID']['input']>;
};

export type GQLMappedFile = {
  __typename?: 'MappedFile';
  copy: GQLDamFile;
  rootFile: GQLDamFile;
};

export type GQLMovePageTreeNodesByNeighbourInput = {
  afterId?: InputMaybe<Scalars['String']['input']>;
  beforeId?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
};

export type GQLMovePageTreeNodesByPosInput = {
  parentId?: InputMaybe<Scalars['String']['input']>;
  pos: Scalars['Int']['input'];
};

export type GQLMutation = {
  __typename?: 'Mutation';
  archiveDamFile: GQLDamFile;
  archiveDamFiles: Array<GQLDamFile>;
  copyFilesToScope: GQLCopyFilesResponse;
  createBuilds: Scalars['Boolean']['output'];
  createDamFolder: GQLDamFolder;
  createDamMediaAlternative: GQLDamMediaAlternative;
  createManufacturer: GQLManufacturer;
  createNews: GQLNews;
  createNewsComment: GQLNewsComment;
  createPageTreeNode: GQLPageTreeNode;
  createProduct: GQLProduct;
  createProductCategory: GQLProductCategory;
  createProductCategoryType: GQLProductCategoryType;
  createProductHighlight: GQLProductHighlight;
  createProductTag: GQLProductTag;
  createProductVariant: GQLProductVariant;
  createRedirect: GQLRedirect;
  currentUserSignOut: Scalars['String']['output'];
  deleteDamFile: Scalars['Boolean']['output'];
  deleteDamFolder: Scalars['Boolean']['output'];
  deleteDamMediaAlternative: Scalars['Boolean']['output'];
  deleteManufacturer: Scalars['Boolean']['output'];
  deleteNews: Scalars['Boolean']['output'];
  deleteNewsComment: Scalars['Boolean']['output'];
  deletePageTreeNode: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteProductCategory: Scalars['Boolean']['output'];
  deleteProductCategoryType: Scalars['Boolean']['output'];
  deleteProductHighlight: Scalars['Boolean']['output'];
  deleteProductTag: Scalars['Boolean']['output'];
  deleteProductVariant: Scalars['Boolean']['output'];
  deleteRedirect: Scalars['Boolean']['output'];
  importDamFileByDownload: GQLDamFile;
  moveDamFiles: Array<GQLDamFile>;
  moveDamFolders: Array<GQLDamFolder>;
  movePageTreeNodesByNeighbour: Array<GQLPageTreeNode>;
  movePageTreeNodesByPos: Array<GQLPageTreeNode>;
  publishAllProducts: Scalars['Boolean']['output'];
  restoreDamFile: GQLDamFile;
  restoreDamFiles: Array<GQLDamFile>;
  saveFooter: GQLFooter;
  saveLink: GQLLink;
  savePage: GQLPage;
  savePredefinedPage: GQLPredefinedPage;
  triggerKubernetesCronJob: GQLKubernetesJob;
  updateDamFile: GQLDamFile;
  updateDamFolder: GQLDamFolder;
  updateDamMediaAlternative: GQLDamMediaAlternative;
  updateMainMenuItem: GQLMainMenuItem;
  updateManufacturer: GQLManufacturer;
  updateNews: GQLNews;
  updateNewsComment: GQLNewsComment;
  updatePageTreeNode: GQLPageTreeNode;
  updatePageTreeNodeCategory: GQLPageTreeNode;
  updatePageTreeNodeSlug: GQLPageTreeNode;
  updatePageTreeNodeVisibility: GQLPageTreeNode;
  updateProduct: GQLProduct;
  updateProductCategory: GQLProductCategory;
  updateProductCategoryType: GQLProductCategoryType;
  updateProductHighlight: GQLProductHighlight;
  updateProductTag: GQLProductTag;
  updateProductVariant: GQLProductVariant;
  updateRedirect: GQLRedirect;
  updateRedirectActiveness: GQLRedirect;
  userPermissionsCreatePermission: GQLUserPermission;
  userPermissionsDeletePermission: Scalars['Boolean']['output'];
  userPermissionsUpdateContentScopes: Scalars['Boolean']['output'];
  userPermissionsUpdateOverrideContentScopes: GQLUserPermission;
  userPermissionsUpdatePermission: GQLUserPermission;
};


export type GQLMutationarchiveDamFileArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationarchiveDamFilesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type GQLMutationcopyFilesToScopeArgs = {
  fileIds: Array<Scalars['ID']['input']>;
  inboxFolderId: Scalars['ID']['input'];
};


export type GQLMutationcreateBuildsArgs = {
  input: GQLCreateBuildsInput;
};


export type GQLMutationcreateDamFolderArgs = {
  input: GQLCreateDamFolderInput;
  scope: GQLDamScopeInput;
};


export type GQLMutationcreateDamMediaAlternativeArgs = {
  alternative: Scalars['ID']['input'];
  for: Scalars['ID']['input'];
  input: GQLDamMediaAlternativeInput;
};


export type GQLMutationcreateManufacturerArgs = {
  input: GQLManufacturerInput;
};


export type GQLMutationcreateNewsArgs = {
  input: GQLNewsInput;
  scope: GQLNewsContentScopeInput;
};


export type GQLMutationcreateNewsCommentArgs = {
  input: GQLNewsCommentInput;
  newsId: Scalars['ID']['input'];
};


export type GQLMutationcreatePageTreeNodeArgs = {
  category: Scalars['String']['input'];
  input: GQLPageTreeNodeCreateInput;
  scope: GQLPageTreeNodeScopeInput;
};


export type GQLMutationcreateProductArgs = {
  input: GQLProductInput;
};


export type GQLMutationcreateProductCategoryArgs = {
  input: GQLProductCategoryInput;
};


export type GQLMutationcreateProductCategoryTypeArgs = {
  input: GQLProductCategoryTypeInput;
};


export type GQLMutationcreateProductHighlightArgs = {
  input: GQLProductHighlightInput;
};


export type GQLMutationcreateProductTagArgs = {
  input: GQLProductTagInput;
};


export type GQLMutationcreateProductVariantArgs = {
  input: GQLProductVariantInput;
  product: Scalars['ID']['input'];
};


export type GQLMutationcreateRedirectArgs = {
  input: GQLRedirectInput;
  scope: GQLRedirectScopeInput;
};


export type GQLMutationdeleteDamFileArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteDamFolderArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteDamMediaAlternativeArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteManufacturerArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteNewsArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteNewsCommentArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeletePageTreeNodeArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteProductCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteProductCategoryTypeArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteProductHighlightArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteProductTagArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationdeleteRedirectArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationimportDamFileByDownloadArgs = {
  input: GQLUpdateDamFileInput;
  scope: GQLDamScopeInput;
  url: Scalars['String']['input'];
};


export type GQLMutationmoveDamFilesArgs = {
  fileIds: Array<Scalars['ID']['input']>;
  targetFolderId?: InputMaybe<Scalars['ID']['input']>;
};


export type GQLMutationmoveDamFoldersArgs = {
  folderIds: Array<Scalars['ID']['input']>;
  scope: GQLDamScopeInput;
  targetFolderId?: InputMaybe<Scalars['ID']['input']>;
};


export type GQLMutationmovePageTreeNodesByNeighbourArgs = {
  ids: Array<Scalars['ID']['input']>;
  input: GQLMovePageTreeNodesByNeighbourInput;
};


export type GQLMutationmovePageTreeNodesByPosArgs = {
  ids: Array<Scalars['ID']['input']>;
  input: GQLMovePageTreeNodesByPosInput;
};


export type GQLMutationrestoreDamFileArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationrestoreDamFilesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type GQLMutationsaveFooterArgs = {
  input: GQLFooterInput;
  scope: GQLFooterScopeInput;
};


export type GQLMutationsaveLinkArgs = {
  attachedPageTreeNodeId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  input: GQLLinkInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type GQLMutationsavePageArgs = {
  attachedPageTreeNodeId?: InputMaybe<Scalars['ID']['input']>;
  input: GQLPageInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  pageId: Scalars['ID']['input'];
};


export type GQLMutationsavePredefinedPageArgs = {
  attachedPageTreeNodeId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  input: GQLPredefinedPageInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type GQLMutationtriggerKubernetesCronJobArgs = {
  name: Scalars['String']['input'];
};


export type GQLMutationupdateDamFileArgs = {
  id: Scalars['ID']['input'];
  input: GQLUpdateDamFileInput;
};


export type GQLMutationupdateDamFolderArgs = {
  id: Scalars['ID']['input'];
  input: GQLUpdateDamFolderInput;
};


export type GQLMutationupdateDamMediaAlternativeArgs = {
  id: Scalars['ID']['input'];
  input: GQLDamMediaAlternativeUpdateInput;
};


export type GQLMutationupdateMainMenuItemArgs = {
  input: GQLMainMenuItemInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
  pageTreeNodeId: Scalars['ID']['input'];
};


export type GQLMutationupdateManufacturerArgs = {
  id: Scalars['ID']['input'];
  input: GQLManufacturerUpdateInput;
};


export type GQLMutationupdateNewsArgs = {
  id: Scalars['ID']['input'];
  input: GQLNewsUpdateInput;
};


export type GQLMutationupdateNewsCommentArgs = {
  id: Scalars['ID']['input'];
  input: GQLNewsCommentInput;
};


export type GQLMutationupdatePageTreeNodeArgs = {
  id: Scalars['ID']['input'];
  input: GQLPageTreeNodeUpdateInput;
};


export type GQLMutationupdatePageTreeNodeCategoryArgs = {
  category: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type GQLMutationupdatePageTreeNodeSlugArgs = {
  id: Scalars['ID']['input'];
  slug: Scalars['String']['input'];
};


export type GQLMutationupdatePageTreeNodeVisibilityArgs = {
  id: Scalars['ID']['input'];
  input: GQLPageTreeNodeUpdateVisibilityInput;
};


export type GQLMutationupdateProductArgs = {
  id: Scalars['ID']['input'];
  input: GQLProductUpdateInput;
};


export type GQLMutationupdateProductCategoryArgs = {
  id: Scalars['ID']['input'];
  input: GQLProductCategoryUpdateInput;
};


export type GQLMutationupdateProductCategoryTypeArgs = {
  id: Scalars['ID']['input'];
  input: GQLProductCategoryTypeUpdateInput;
};


export type GQLMutationupdateProductHighlightArgs = {
  id: Scalars['ID']['input'];
  input: GQLProductHighlightUpdateInput;
};


export type GQLMutationupdateProductTagArgs = {
  id: Scalars['ID']['input'];
  input: GQLProductTagUpdateInput;
};


export type GQLMutationupdateProductVariantArgs = {
  id: Scalars['ID']['input'];
  input: GQLProductVariantUpdateInput;
};


export type GQLMutationupdateRedirectArgs = {
  id: Scalars['ID']['input'];
  input: GQLRedirectInput;
  lastUpdatedAt?: InputMaybe<Scalars['DateTime']['input']>;
};


export type GQLMutationupdateRedirectActivenessArgs = {
  id: Scalars['ID']['input'];
  input: GQLRedirectUpdateActivenessInput;
};


export type GQLMutationuserPermissionsCreatePermissionArgs = {
  input: GQLUserPermissionInput;
  userId: Scalars['String']['input'];
};


export type GQLMutationuserPermissionsDeletePermissionArgs = {
  id: Scalars['ID']['input'];
};


export type GQLMutationuserPermissionsUpdateContentScopesArgs = {
  input: GQLUserContentScopesInput;
  userId: Scalars['String']['input'];
};


export type GQLMutationuserPermissionsUpdateOverrideContentScopesArgs = {
  input: GQLUserPermissionOverrideContentScopesInput;
};


export type GQLMutationuserPermissionsUpdatePermissionArgs = {
  id: Scalars['String']['input'];
  input: GQLUserPermissionInput;
};

export type GQLNews = {
  __typename?: 'News';
  category: GQLNewsCategory;
  comments: Array<GQLNewsComment>;
  content: Scalars['NewsContentBlockData']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  dependencies: GQLPaginatedDependencies;
  dependents: GQLPaginatedDependencies;
  id: Scalars['ID']['output'];
  image: Scalars['DamImageBlockData']['output'];
  scope: GQLNewsContentScope;
  slug: Scalars['String']['output'];
  status: GQLNewsStatus;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type GQLNewsdependenciesArgs = {
  filter?: InputMaybe<GQLDependencyFilter>;
  forceRefresh?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type GQLNewsdependentsArgs = {
  filter?: InputMaybe<GQLDependentFilter>;
  forceRefresh?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type GQLNewsCategory =
  | 'awards'
  | 'company'
  | 'events';

export type GQLNewsCategoryEnumFilter = {
  equal?: InputMaybe<GQLNewsCategory>;
  isAnyOf?: InputMaybe<Array<GQLNewsCategory>>;
  notEqual?: InputMaybe<GQLNewsCategory>;
};

export type GQLNewsComment = {
  __typename?: 'NewsComment';
  comment: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLNewsCommentInput = {
  comment: Scalars['String']['input'];
};

export type GQLNewsContentScope = {
  __typename?: 'NewsContentScope';
  domain: Scalars['String']['output'];
  language: Scalars['String']['output'];
};

export type GQLNewsContentScopeInput = {
  domain: Scalars['String']['input'];
  language: Scalars['String']['input'];
};

export type GQLNewsFilter = {
  and?: InputMaybe<Array<GQLNewsFilter>>;
  category?: InputMaybe<GQLNewsCategoryEnumFilter>;
  comments?: InputMaybe<GQLOneToManyFilter>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  date?: InputMaybe<GQLDateTimeFilter>;
  id?: InputMaybe<GQLIdFilter>;
  or?: InputMaybe<Array<GQLNewsFilter>>;
  slug?: InputMaybe<GQLStringFilter>;
  status?: InputMaybe<GQLNewsStatusEnumFilter>;
  title?: InputMaybe<GQLStringFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLNewsInput = {
  category: GQLNewsCategory;
  content: Scalars['NewsContentBlockInput']['input'];
  date: Scalars['DateTime']['input'];
  image: Scalars['DamImageBlockInput']['input'];
  slug: Scalars['String']['input'];
  status?: GQLNewsStatus;
  title: Scalars['String']['input'];
};

export type GQLNewsSort = {
  direction?: GQLSortDirection;
  field: GQLNewsSortField;
};

export type GQLNewsSortField =
  | 'category'
  | 'createdAt'
  | 'date'
  | 'slug'
  | 'status'
  | 'title'
  | 'updatedAt';

export type GQLNewsStatus =
  | 'active'
  | 'deleted';

export type GQLNewsStatusEnumFilter = {
  equal?: InputMaybe<GQLNewsStatus>;
  isAnyOf?: InputMaybe<Array<GQLNewsStatus>>;
  notEqual?: InputMaybe<GQLNewsStatus>;
};

export type GQLNewsUpdateInput = {
  category?: InputMaybe<GQLNewsCategory>;
  content?: InputMaybe<Scalars['NewsContentBlockInput']['input']>;
  date?: InputMaybe<Scalars['DateTime']['input']>;
  image?: InputMaybe<Scalars['DamImageBlockInput']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<GQLNewsStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLNumberFilter = {
  equal?: InputMaybe<Scalars['Float']['input']>;
  greaterThan?: InputMaybe<Scalars['Float']['input']>;
  greaterThanEqual?: InputMaybe<Scalars['Float']['input']>;
  isAnyOf?: InputMaybe<Array<Scalars['Float']['input']>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  isNotEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  lowerThan?: InputMaybe<Scalars['Float']['input']>;
  lowerThanEqual?: InputMaybe<Scalars['Float']['input']>;
  notEqual?: InputMaybe<Scalars['Float']['input']>;
};

export type GQLOneToManyFilter = {
  contains?: InputMaybe<Scalars['ID']['input']>;
  isAnyOf?: InputMaybe<Array<Scalars['ID']['input']>>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GQLPage = GQLDocumentInterface & {
  __typename?: 'Page';
  content: Scalars['PageContentBlockData']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  pageTreeNode: Maybe<GQLPageTreeNode>;
  seo: Scalars['SeoBlockData']['output'];
  stage: Scalars['StageBlockData']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLPageContentUnion = GQLLink | GQLPage | GQLPredefinedPage;

export type GQLPageInput = {
  content: Scalars['PageContentBlockInput']['input'];
  seo: Scalars['SeoBlockInput']['input'];
  stage: Scalars['StageBlockInput']['input'];
};

export type GQLPageTreeNode = {
  __typename?: 'PageTreeNode';
  category: GQLPageTreeNodeCategory;
  childNodes: Array<GQLPageTreeNode>;
  dependents: GQLPaginatedDependencies;
  document: Maybe<GQLPageContentUnion>;
  documentType: Scalars['String']['output'];
  hideInMenu: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  numberOfDescendants: Scalars['Int']['output'];
  parentId: Maybe<Scalars['String']['output']>;
  parentNode: Maybe<GQLPageTreeNode>;
  parentNodes: Array<GQLPageTreeNode>;
  path: Scalars['String']['output'];
  pos: Scalars['Int']['output'];
  scope: GQLPageTreeNodeScope;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userGroup: GQLUserGroup;
  visibility: GQLPageTreeNodeVisibility;
};


export type GQLPageTreeNodedependentsArgs = {
  filter?: InputMaybe<GQLDependentFilter>;
  forceRefresh?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type GQLPageTreeNodeCategory =
  | 'mainNavigation'
  | 'topMenu';

export type GQLPageTreeNodeCreateInput = {
  attachedDocument: GQLAttachedDocumentInput;
  hideInMenu?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['String']['input']>;
  pos?: InputMaybe<Scalars['Int']['input']>;
  slug: Scalars['String']['input'];
  userGroup?: GQLUserGroup;
};

export type GQLPageTreeNodeScope = {
  __typename?: 'PageTreeNodeScope';
  domain: Scalars['String']['output'];
  language: Scalars['String']['output'];
};

export type GQLPageTreeNodeScopeInput = {
  domain: Scalars['String']['input'];
  language: Scalars['String']['input'];
};

export type GQLPageTreeNodeSort = {
  direction?: GQLSortDirection;
  field: GQLPageTreeNodeSortField;
};

export type GQLPageTreeNodeSortField =
  | 'pos'
  | 'updatedAt';

export type GQLPageTreeNodeUpdateInput = {
  attachedDocument?: InputMaybe<GQLAttachedDocumentInput>;
  createAutomaticRedirectsOnSlugChange?: InputMaybe<Scalars['Boolean']['input']>;
  hideInMenu?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  userGroup?: GQLUserGroup;
};

export type GQLPageTreeNodeUpdateVisibilityInput = {
  visibility: GQLPageTreeNodeVisibility;
};

export type GQLPageTreeNodeVisibility =
  | 'Archived'
  | 'Published'
  | 'Unpublished';

export type GQLPaginatedDamFiles = {
  __typename?: 'PaginatedDamFiles';
  nodes: Array<GQLDamFile>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedDamFolders = {
  __typename?: 'PaginatedDamFolders';
  nodes: Array<GQLDamFolder>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedDamItems = {
  __typename?: 'PaginatedDamItems';
  nodes: Array<GQLDamItem>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedDamMediaAlternatives = {
  __typename?: 'PaginatedDamMediaAlternatives';
  nodes: Array<GQLDamMediaAlternative>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedDependencies = {
  __typename?: 'PaginatedDependencies';
  nodes: Array<GQLDependency>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedManufacturerCountries = {
  __typename?: 'PaginatedManufacturerCountries';
  nodes: Array<GQLManufacturerCountry>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedManufacturers = {
  __typename?: 'PaginatedManufacturers';
  nodes: Array<GQLManufacturer>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedNews = {
  __typename?: 'PaginatedNews';
  nodes: Array<GQLNews>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedPageTreeNodes = {
  __typename?: 'PaginatedPageTreeNodes';
  nodes: Array<GQLPageTreeNode>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedProductCategories = {
  __typename?: 'PaginatedProductCategories';
  nodes: Array<GQLProductCategory>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedProductCategoryTypes = {
  __typename?: 'PaginatedProductCategoryTypes';
  nodes: Array<GQLProductCategoryType>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedProductHighlights = {
  __typename?: 'PaginatedProductHighlights';
  nodes: Array<GQLProductHighlight>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedProductTags = {
  __typename?: 'PaginatedProductTags';
  nodes: Array<GQLProductTag>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedProductVariants = {
  __typename?: 'PaginatedProductVariants';
  nodes: Array<GQLProductVariant>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedProducts = {
  __typename?: 'PaginatedProducts';
  nodes: Array<GQLProduct>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedRedirects = {
  __typename?: 'PaginatedRedirects';
  nodes: Array<GQLRedirect>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPaginatedWarnings = {
  __typename?: 'PaginatedWarnings';
  nodes: Array<GQLWarning>;
  totalCount: Scalars['Int']['output'];
};

export type GQLPermission =
  | 'builds'
  | 'cronJobs'
  | 'dam'
  | 'dependencies'
  | 'fileUploads'
  | 'impersonation'
  | 'manufacturers'
  | 'news'
  | 'pageTree'
  | 'prelogin'
  | 'products'
  | 'translation'
  | 'userPermissions'
  | 'warnings';

export type GQLPermissionFilter = {
  equal?: InputMaybe<GQLPermission>;
  isAnyOf?: InputMaybe<Array<GQLPermission>>;
  notEqual?: InputMaybe<GQLPermission>;
};

export type GQLPredefinedPage = GQLDocumentInterface & {
  __typename?: 'PredefinedPage';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  type: Maybe<GQLPredefinedPageType>;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLPredefinedPageInput = {
  type?: InputMaybe<GQLPredefinedPageType>;
};

export type GQLPredefinedPageType =
  | 'news';

export type GQLProduct = {
  __typename?: 'Product';
  additionalTypes: Array<GQLProductType>;
  articleNumbers: Array<Scalars['String']['output']>;
  availableSince: Maybe<Scalars['LocalDate']['output']>;
  category: Maybe<GQLProductCategory>;
  colors: Array<GQLProductColor>;
  createdAt: Scalars['DateTime']['output'];
  datasheets: Array<GQLFileUpload>;
  description: Maybe<Scalars['String']['output']>;
  dimensions: Maybe<GQLProductDimensions>;
  discounts: Array<GQLProductDiscounts>;
  id: Scalars['ID']['output'];
  image: Scalars['DamImageBlockData']['output'];
  inStock: Scalars['Boolean']['output'];
  lastCheckedAt: Maybe<Scalars['DateTime']['output']>;
  manufacturer: Maybe<GQLManufacturer>;
  price: Maybe<Scalars['Float']['output']>;
  priceList: Maybe<GQLFileUpload>;
  priceRange: Maybe<GQLProductPriceRange>;
  slug: Scalars['String']['output'];
  soldCount: Maybe<Scalars['Int']['output']>;
  statistics: Maybe<GQLProductStatistics>;
  status: GQLProductStatus;
  tags: Array<GQLProductTag>;
  tagsWithStatus: Array<GQLProductToTag>;
  title: Scalars['String']['output'];
  type: GQLProductType;
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<GQLProductVariant>;
};

export type GQLProductCategory = {
  __typename?: 'ProductCategory';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  products: Array<GQLProduct>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Maybe<GQLProductCategoryType>;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLProductCategoryFilter = {
  and?: InputMaybe<Array<GQLProductCategoryFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  id?: InputMaybe<GQLIdFilter>;
  or?: InputMaybe<Array<GQLProductCategoryFilter>>;
  products?: InputMaybe<GQLOneToManyFilter>;
  slug?: InputMaybe<GQLStringFilter>;
  title?: InputMaybe<GQLStringFilter>;
  type?: InputMaybe<GQLManyToOneFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLProductCategoryInput = {
  position?: InputMaybe<Scalars['Int']['input']>;
  products?: Array<Scalars['ID']['input']>;
  slug: Scalars['String']['input'];
  title: Scalars['String']['input'];
  type?: InputMaybe<Scalars['ID']['input']>;
};

export type GQLProductCategorySort = {
  direction?: GQLSortDirection;
  field: GQLProductCategorySortField;
};

export type GQLProductCategorySortField =
  | 'createdAt'
  | 'position'
  | 'slug'
  | 'title'
  | 'type'
  | 'type_title'
  | 'updatedAt';

export type GQLProductCategoryType = {
  __typename?: 'ProductCategoryType';
  categories: Array<GQLProductCategory>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type GQLProductCategoryTypeFilter = {
  and?: InputMaybe<Array<GQLProductCategoryTypeFilter>>;
  categories?: InputMaybe<GQLOneToManyFilter>;
  id?: InputMaybe<GQLIdFilter>;
  or?: InputMaybe<Array<GQLProductCategoryTypeFilter>>;
  title?: InputMaybe<GQLStringFilter>;
};

export type GQLProductCategoryTypeInput = {
  categories?: Array<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export type GQLProductCategoryTypeSort = {
  direction?: GQLSortDirection;
  field: GQLProductCategoryTypeSortField;
};

export type GQLProductCategoryTypeSortField =
  | 'title';

export type GQLProductCategoryTypeUpdateInput = {
  categories?: InputMaybe<Array<Scalars['ID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLProductCategoryUpdateInput = {
  position?: InputMaybe<Scalars['Int']['input']>;
  products?: InputMaybe<Array<Scalars['ID']['input']>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['ID']['input']>;
};

export type GQLProductColor = GQLDocumentInterface & {
  __typename?: 'ProductColor';
  createdAt: Scalars['DateTime']['output'];
  hexCode: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  product: GQLProduct;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLProductDimensions = {
  __typename?: 'ProductDimensions';
  depth: Scalars['Float']['output'];
  height: Scalars['Float']['output'];
  width: Scalars['Float']['output'];
};

export type GQLProductDimensionsInput = {
  depth: Scalars['Float']['input'];
  height: Scalars['Float']['input'];
  width: Scalars['Float']['input'];
};

export type GQLProductDiscounts = {
  __typename?: 'ProductDiscounts';
  price: Scalars['Float']['output'];
  quantity: Scalars['Float']['output'];
};

export type GQLProductDiscountsInput = {
  price: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
};

export type GQLProductFilter = {
  additionalTypes?: InputMaybe<GQLProductTypeEnumsFilter>;
  and?: InputMaybe<Array<GQLProductFilter>>;
  availableSince?: InputMaybe<GQLDateFilter>;
  category?: InputMaybe<GQLManyToOneFilter>;
  colors?: InputMaybe<GQLOneToManyFilter>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  datasheets?: InputMaybe<GQLManyToManyFilter>;
  description?: InputMaybe<GQLStringFilter>;
  id?: InputMaybe<GQLIdFilter>;
  inStock?: InputMaybe<GQLBooleanFilter>;
  lastCheckedAt?: InputMaybe<GQLDateTimeFilter>;
  manufacturer?: InputMaybe<GQLManyToOneFilter>;
  or?: InputMaybe<Array<GQLProductFilter>>;
  price?: InputMaybe<GQLNumberFilter>;
  priceList?: InputMaybe<GQLManyToOneFilter>;
  slug?: InputMaybe<GQLStringFilter>;
  soldCount?: InputMaybe<GQLNumberFilter>;
  status?: InputMaybe<GQLProductStatusEnumFilter>;
  tags?: InputMaybe<GQLManyToManyFilter>;
  tagsWithStatus?: InputMaybe<GQLOneToManyFilter>;
  title?: InputMaybe<GQLStringFilter>;
  type?: InputMaybe<GQLProductTypeEnumFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
  variants?: InputMaybe<GQLOneToManyFilter>;
};

export type GQLProductHighlight = {
  __typename?: 'ProductHighlight';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  product: GQLProduct;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLProductHighlightFilter = {
  and?: InputMaybe<Array<GQLProductHighlightFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  description?: InputMaybe<GQLStringFilter>;
  id?: InputMaybe<GQLIdFilter>;
  or?: InputMaybe<Array<GQLProductHighlightFilter>>;
  product?: InputMaybe<GQLManyToOneFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLProductHighlightInput = {
  description: Scalars['String']['input'];
  product: Scalars['ID']['input'];
};

export type GQLProductHighlightSort = {
  direction?: GQLSortDirection;
  field: GQLProductHighlightSortField;
};

export type GQLProductHighlightSortField =
  | 'createdAt'
  | 'description'
  | 'product'
  | 'product_additionalTypes'
  | 'product_availableSince'
  | 'product_category'
  | 'product_createdAt'
  | 'product_description'
  | 'product_inStock'
  | 'product_lastCheckedAt'
  | 'product_manufacturer'
  | 'product_price'
  | 'product_priceList'
  | 'product_slug'
  | 'product_soldCount'
  | 'product_status'
  | 'product_title'
  | 'product_type'
  | 'product_updatedAt'
  | 'updatedAt';

export type GQLProductHighlightUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  product?: InputMaybe<Scalars['ID']['input']>;
};

export type GQLProductInput = {
  additionalTypes?: Array<GQLProductType>;
  articleNumbers?: Array<Scalars['String']['input']>;
  availableSince?: InputMaybe<Scalars['LocalDate']['input']>;
  category?: InputMaybe<Scalars['ID']['input']>;
  colors?: Array<GQLProductNestedProductColorInput>;
  datasheets?: Array<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dimensions?: InputMaybe<GQLProductDimensionsInput>;
  discounts?: Array<GQLProductDiscountsInput>;
  image: Scalars['DamImageBlockInput']['input'];
  inStock?: Scalars['Boolean']['input'];
  lastCheckedAt?: InputMaybe<Scalars['DateTime']['input']>;
  manufacturer?: InputMaybe<Scalars['ID']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  priceList?: InputMaybe<Scalars['ID']['input']>;
  priceRange?: InputMaybe<GQLProductPriceRangeInput>;
  slug: Scalars['String']['input'];
  statistics?: InputMaybe<GQLProductNestedProductStatisticsInput>;
  status?: GQLProductStatus;
  tags?: Array<Scalars['ID']['input']>;
  tagsWithStatus?: Array<GQLProductNestedProductToTagInput>;
  title: Scalars['String']['input'];
  type: GQLProductType;
};

export type GQLProductNestedProductColorInput = {
  hexCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type GQLProductNestedProductStatisticsInput = {
  views: Scalars['Int']['input'];
};

export type GQLProductNestedProductToTagInput = {
  exampleStatus?: Scalars['Boolean']['input'];
  tag: Scalars['ID']['input'];
};

export type GQLProductPriceRange = {
  __typename?: 'ProductPriceRange';
  max: Scalars['Float']['output'];
  min: Scalars['Float']['output'];
};

export type GQLProductPriceRangeInput = {
  max: Scalars['Float']['input'];
  min: Scalars['Float']['input'];
};

export type GQLProductSort = {
  direction?: GQLSortDirection;
  field: GQLProductSortField;
};

export type GQLProductSortField =
  | 'additionalTypes'
  | 'availableSince'
  | 'category'
  | 'category_createdAt'
  | 'category_position'
  | 'category_slug'
  | 'category_title'
  | 'category_type'
  | 'category_updatedAt'
  | 'createdAt'
  | 'description'
  | 'inStock'
  | 'lastCheckedAt'
  | 'manufacturer'
  | 'manufacturer_addressAsEmbeddable_alternativeAddress_country'
  | 'manufacturer_addressAsEmbeddable_alternativeAddress_street'
  | 'manufacturer_addressAsEmbeddable_alternativeAddress_streetNumber'
  | 'manufacturer_addressAsEmbeddable_alternativeAddress_zip'
  | 'manufacturer_addressAsEmbeddable_country'
  | 'manufacturer_addressAsEmbeddable_street'
  | 'manufacturer_addressAsEmbeddable_streetNumber'
  | 'manufacturer_addressAsEmbeddable_zip'
  | 'manufacturer_name'
  | 'manufacturer_updatedAt'
  | 'price'
  | 'priceList'
  | 'priceList_contentHash'
  | 'priceList_createdAt'
  | 'priceList_id'
  | 'priceList_mimetype'
  | 'priceList_name'
  | 'priceList_updatedAt'
  | 'slug'
  | 'soldCount'
  | 'statistics_createdAt'
  | 'statistics_updatedAt'
  | 'statistics_views'
  | 'status'
  | 'title'
  | 'type'
  | 'updatedAt';

export type GQLProductStatistics = {
  __typename?: 'ProductStatistics';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  views: Scalars['Int']['output'];
};

export type GQLProductStatus =
  | 'Deleted'
  | 'Published'
  | 'Unpublished';

export type GQLProductStatusEnumFilter = {
  equal?: InputMaybe<GQLProductStatus>;
  isAnyOf?: InputMaybe<Array<GQLProductStatus>>;
  notEqual?: InputMaybe<GQLProductStatus>;
};

export type GQLProductTag = {
  __typename?: 'ProductTag';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  products: Array<GQLProduct>;
  productsWithStatus: Array<GQLProductToTag>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLProductTagFilter = {
  and?: InputMaybe<Array<GQLProductTagFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  id?: InputMaybe<GQLIdFilter>;
  or?: InputMaybe<Array<GQLProductTagFilter>>;
  products?: InputMaybe<GQLManyToManyFilter>;
  productsWithStatus?: InputMaybe<GQLOneToManyFilter>;
  title?: InputMaybe<GQLStringFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLProductTagInput = {
  products?: Array<Scalars['ID']['input']>;
  productsWithStatus?: Array<GQLProductTagNestedProductToTagInput>;
  title: Scalars['String']['input'];
};

export type GQLProductTagNestedProductToTagInput = {
  exampleStatus?: Scalars['Boolean']['input'];
  product: Scalars['ID']['input'];
};

export type GQLProductTagSort = {
  direction?: GQLSortDirection;
  field: GQLProductTagSortField;
};

export type GQLProductTagSortField =
  | 'createdAt'
  | 'title'
  | 'updatedAt';

export type GQLProductTagUpdateInput = {
  products?: InputMaybe<Array<Scalars['ID']['input']>>;
  productsWithStatus?: InputMaybe<Array<GQLProductTagNestedProductToTagInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLProductToTag = {
  __typename?: 'ProductToTag';
  exampleStatus: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  product: GQLProduct;
  tag: GQLProductTag;
};

export type GQLProductType =
  | 'cap'
  | 'shirt'
  | 'tie';

export type GQLProductTypeEnumFilter = {
  equal?: InputMaybe<GQLProductType>;
  isAnyOf?: InputMaybe<Array<GQLProductType>>;
  notEqual?: InputMaybe<GQLProductType>;
};

export type GQLProductTypeEnumsFilter = {
  contains?: InputMaybe<Array<GQLProductType>>;
};

export type GQLProductUpdateInput = {
  additionalTypes?: InputMaybe<Array<GQLProductType>>;
  articleNumbers?: InputMaybe<Array<Scalars['String']['input']>>;
  availableSince?: InputMaybe<Scalars['LocalDate']['input']>;
  category?: InputMaybe<Scalars['ID']['input']>;
  colors?: InputMaybe<Array<GQLProductNestedProductColorInput>>;
  datasheets?: InputMaybe<Array<Scalars['ID']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  dimensions?: InputMaybe<GQLProductDimensionsInput>;
  discounts?: InputMaybe<Array<GQLProductDiscountsInput>>;
  image?: InputMaybe<Scalars['DamImageBlockInput']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  lastCheckedAt?: InputMaybe<Scalars['DateTime']['input']>;
  manufacturer?: InputMaybe<Scalars['ID']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  priceList?: InputMaybe<Scalars['ID']['input']>;
  priceRange?: InputMaybe<GQLProductPriceRangeInput>;
  slug?: InputMaybe<Scalars['String']['input']>;
  statistics?: InputMaybe<GQLProductNestedProductStatisticsInput>;
  status?: InputMaybe<GQLProductStatus>;
  tags?: InputMaybe<Array<Scalars['ID']['input']>>;
  tagsWithStatus?: InputMaybe<Array<GQLProductNestedProductToTagInput>>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<GQLProductType>;
};

export type GQLProductVariant = {
  __typename?: 'ProductVariant';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['DamImageBlockData']['output'];
  name: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  product: GQLProduct;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLProductVariantFilter = {
  and?: InputMaybe<Array<GQLProductVariantFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  id?: InputMaybe<GQLIdFilter>;
  name?: InputMaybe<GQLStringFilter>;
  or?: InputMaybe<Array<GQLProductVariantFilter>>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLProductVariantInput = {
  image: Scalars['DamImageBlockInput']['input'];
  name: Scalars['String']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
};

export type GQLProductVariantSort = {
  direction?: GQLSortDirection;
  field: GQLProductVariantSortField;
};

export type GQLProductVariantSortField =
  | 'createdAt'
  | 'name'
  | 'position'
  | 'product'
  | 'product_additionalTypes'
  | 'product_availableSince'
  | 'product_category'
  | 'product_createdAt'
  | 'product_description'
  | 'product_inStock'
  | 'product_lastCheckedAt'
  | 'product_manufacturer'
  | 'product_price'
  | 'product_priceList'
  | 'product_slug'
  | 'product_soldCount'
  | 'product_status'
  | 'product_title'
  | 'product_type'
  | 'product_updatedAt'
  | 'updatedAt';

export type GQLProductVariantUpdateInput = {
  image?: InputMaybe<Scalars['DamImageBlockInput']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
};

export type GQLQuery = {
  __typename?: 'Query';
  autoBuildStatus: GQLAutoBuildStatus;
  blockPreviewJwt: Scalars['String']['output'];
  buildTemplates: Array<GQLBuildTemplate>;
  builds: Array<GQLBuild>;
  currentUser: GQLCurrentUser;
  damAreFilenamesOccupied: Array<GQLFilenameResponse>;
  damFile: GQLDamFile;
  damFilesList: GQLPaginatedDamFiles;
  damFolder: GQLDamFolder;
  damFolderByNameAndParentId: Maybe<GQLDamFolder>;
  damFoldersFlat: Array<GQLDamFolder>;
  damFoldersList: GQLPaginatedDamFolders;
  damIsFilenameOccupied: Scalars['Boolean']['output'];
  damItemListPosition: Scalars['Int']['output'];
  damItemsList: GQLPaginatedDamItems;
  damMediaAlternative: GQLDamMediaAlternative;
  damMediaAlternatives: GQLPaginatedDamMediaAlternatives;
  findCopiesOfFileInScope: Array<GQLDamFile>;
  footer: Maybe<GQLFooter>;
  kubernetesCronJob: GQLKubernetesCronJob;
  kubernetesCronJobs: Array<GQLKubernetesCronJob>;
  kubernetesJob: GQLKubernetesJob;
  kubernetesJobLogs: Scalars['String']['output'];
  kubernetesJobs: Array<GQLKubernetesJob>;
  link: Maybe<GQLLink>;
  mainMenu: GQLMainMenu;
  mainMenuItem: GQLMainMenuItem;
  manufacturer: GQLManufacturer;
  manufacturerCountries: GQLPaginatedManufacturerCountries;
  manufacturers: GQLPaginatedManufacturers;
  news: GQLNews;
  newsBySlug: Maybe<GQLNews>;
  newsList: GQLPaginatedNews;
  newsListByIds: Array<GQLNews>;
  page: GQLPage;
  pageTreeNode: Maybe<GQLPageTreeNode>;
  pageTreeNodeByPath: Maybe<GQLPageTreeNode>;
  pageTreeNodeList: Array<GQLPageTreeNode>;
  pageTreeNodeSlugAvailable: GQLSlugAvailability;
  paginatedPageTreeNodes: GQLPaginatedPageTreeNodes;
  paginatedRedirects: GQLPaginatedRedirects;
  predefinedPage: GQLPredefinedPage;
  product: GQLProduct;
  productBySlug: Maybe<GQLProduct>;
  productCategories: GQLPaginatedProductCategories;
  productCategory: GQLProductCategory;
  productCategoryBySlug: Maybe<GQLProductCategory>;
  productCategoryType: GQLProductCategoryType;
  productCategoryTypes: GQLPaginatedProductCategoryTypes;
  productHighlight: GQLProductHighlight;
  productHighlights: GQLPaginatedProductHighlights;
  productTag: GQLProductTag;
  productTags: GQLPaginatedProductTags;
  productVariant: GQLProductVariant;
  productVariants: GQLPaginatedProductVariants;
  products: GQLPaginatedProducts;
  redirect: GQLRedirect;
  redirectBySource: Maybe<GQLRedirect>;
  redirectSourceAvailable: Scalars['Boolean']['output'];
  /** @deprecated Use paginatedRedirects instead. Will be removed in the next version. */
  redirects: Array<GQLRedirect>;
  sitePreviewJwt: Scalars['String']['output'];
  topMenu: Array<GQLPageTreeNode>;
  userPermissionsAvailableContentScopes: Array<GQLContentScopeWithLabel>;
  userPermissionsAvailablePermissions: Array<Scalars['String']['output']>;
  userPermissionsContentScopes: Array<Scalars['JSONObject']['output']>;
  userPermissionsPermission: GQLUserPermission;
  userPermissionsPermissionList: Array<GQLUserPermission>;
  userPermissionsUserById: GQLUserPermissionsUser;
  userPermissionsUsers: GQLUserPermissionPaginatedUserList;
  warning: GQLWarning;
  warnings: GQLPaginatedWarnings;
};


export type GQLQueryblockPreviewJwtArgs = {
  includeInvisible: Scalars['Boolean']['input'];
  scope: Scalars['JSONObject']['input'];
  url: Scalars['String']['input'];
};


export type GQLQuerybuildsArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
};


export type GQLQuerydamAreFilenamesOccupiedArgs = {
  filenames: Array<GQLFilenameInput>;
  scope: GQLDamScopeInput;
};


export type GQLQuerydamFileArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerydamFilesListArgs = {
  filter?: InputMaybe<GQLFileFilterInput>;
  folderId?: InputMaybe<Scalars['ID']['input']>;
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLDamScopeInput;
  sortColumnName?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: GQLSortDirection;
};


export type GQLQuerydamFolderArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerydamFolderByNameAndParentIdArgs = {
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  scope: GQLDamScopeInput;
};


export type GQLQuerydamFoldersFlatArgs = {
  scope: GQLDamScopeInput;
};


export type GQLQuerydamFoldersListArgs = {
  filter?: InputMaybe<GQLFolderFilterInput>;
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  scope: GQLDamScopeInput;
  sortColumnName?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: GQLSortDirection;
};


export type GQLQuerydamIsFilenameOccupiedArgs = {
  filename: Scalars['String']['input'];
  folderId?: InputMaybe<Scalars['String']['input']>;
  scope: GQLDamScopeInput;
};


export type GQLQuerydamItemListPositionArgs = {
  filter?: InputMaybe<GQLDamItemFilterInput>;
  folderId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  scope: GQLDamScopeInput;
  sortColumnName?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: GQLSortDirection;
  type: GQLDamItemType;
};


export type GQLQuerydamItemsListArgs = {
  filter?: InputMaybe<GQLDamItemFilterInput>;
  folderId?: InputMaybe<Scalars['ID']['input']>;
  includeArchived?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLDamScopeInput;
  sortColumnName?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: GQLSortDirection;
};


export type GQLQuerydamMediaAlternativeArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerydamMediaAlternativesArgs = {
  alternative?: InputMaybe<Scalars['ID']['input']>;
  for?: InputMaybe<Scalars['ID']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLDamMediaAlternativeSort>>;
  type?: InputMaybe<GQLDamMediaAlternativeType>;
};


export type GQLQueryfindCopiesOfFileInScopeArgs = {
  id: Scalars['ID']['input'];
  imageCropArea?: InputMaybe<GQLImageCropAreaInput>;
  scope: GQLDamScopeInput;
};


export type GQLQueryfooterArgs = {
  scope: GQLFooterScopeInput;
};


export type GQLQuerykubernetesCronJobArgs = {
  name: Scalars['String']['input'];
};


export type GQLQuerykubernetesJobArgs = {
  name: Scalars['String']['input'];
};


export type GQLQuerykubernetesJobLogsArgs = {
  name: Scalars['String']['input'];
};


export type GQLQuerykubernetesJobsArgs = {
  cronJobName: Scalars['String']['input'];
};


export type GQLQuerylinkArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerymainMenuArgs = {
  scope: GQLPageTreeNodeScopeInput;
};


export type GQLQuerymainMenuItemArgs = {
  pageTreeNodeId: Scalars['ID']['input'];
};


export type GQLQuerymanufacturerArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerymanufacturerCountriesArgs = {
  filter?: InputMaybe<GQLManufacturerCountryFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};


export type GQLQuerymanufacturersArgs = {
  filter?: InputMaybe<GQLManufacturerFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLManufacturerSort>>;
};


export type GQLQuerynewsArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerynewsBySlugArgs = {
  scope: GQLNewsContentScopeInput;
  slug: Scalars['String']['input'];
};


export type GQLQuerynewsListArgs = {
  filter?: InputMaybe<GQLNewsFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLNewsContentScopeInput;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLNewsSort>>;
};


export type GQLQuerynewsListByIdsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type GQLQuerypageArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerypageTreeNodeArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerypageTreeNodeByPathArgs = {
  path: Scalars['String']['input'];
  scope: GQLPageTreeNodeScopeInput;
};


export type GQLQuerypageTreeNodeListArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  scope: GQLPageTreeNodeScopeInput;
};


export type GQLQuerypageTreeNodeSlugAvailableArgs = {
  parentId?: InputMaybe<Scalars['ID']['input']>;
  scope: GQLPageTreeNodeScopeInput;
  slug: Scalars['String']['input'];
};


export type GQLQuerypaginatedPageTreeNodesArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  documentType?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLPageTreeNodeScopeInput;
  sort?: InputMaybe<Array<GQLPageTreeNodeSort>>;
};


export type GQLQuerypaginatedRedirectsArgs = {
  filter?: InputMaybe<GQLRedirectFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scope: GQLRedirectScopeInput;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLRedirectSort>>;
};


export type GQLQuerypredefinedPageArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryproductArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryproductBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type GQLQueryproductCategoriesArgs = {
  filter?: InputMaybe<GQLProductCategoryFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLProductCategorySort>>;
};


export type GQLQueryproductCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryproductCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type GQLQueryproductCategoryTypeArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryproductCategoryTypesArgs = {
  filter?: InputMaybe<GQLProductCategoryTypeFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLProductCategoryTypeSort>>;
};


export type GQLQueryproductHighlightArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryproductHighlightsArgs = {
  filter?: InputMaybe<GQLProductHighlightFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLProductHighlightSort>>;
};


export type GQLQueryproductTagArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryproductTagsArgs = {
  filter?: InputMaybe<GQLProductTagFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLProductTagSort>>;
};


export type GQLQueryproductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryproductVariantsArgs = {
  filter?: InputMaybe<GQLProductVariantFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  product: Scalars['ID']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLProductVariantSort>>;
};


export type GQLQueryproductsArgs = {
  filter?: InputMaybe<GQLProductFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLProductSort>>;
};


export type GQLQueryredirectArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQueryredirectBySourceArgs = {
  scope: GQLRedirectScopeInput;
  source: Scalars['String']['input'];
  sourceType: GQLRedirectSourceTypeValues;
};


export type GQLQueryredirectSourceAvailableArgs = {
  scope: GQLRedirectScopeInput;
  source: Scalars['String']['input'];
};


export type GQLQueryredirectsArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  scope: GQLRedirectScopeInput;
  sortColumnName?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: GQLSortDirection;
  type?: InputMaybe<GQLRedirectGenerationType>;
};


export type GQLQuerysitePreviewJwtArgs = {
  includeInvisible: Scalars['Boolean']['input'];
  path: Scalars['String']['input'];
  scope: Scalars['JSONObject']['input'];
};


export type GQLQuerytopMenuArgs = {
  scope: GQLPageTreeNodeScopeInput;
};


export type GQLQueryuserPermissionsContentScopesArgs = {
  skipManual?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['String']['input'];
};


export type GQLQueryuserPermissionsPermissionArgs = {
  id: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type GQLQueryuserPermissionsPermissionListArgs = {
  userId: Scalars['String']['input'];
};


export type GQLQueryuserPermissionsUserByIdArgs = {
  id: Scalars['String']['input'];
};


export type GQLQueryuserPermissionsUsersArgs = {
  filter?: InputMaybe<GQLUserPermissionsUserFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLUserPermissionsUserSort>>;
};


export type GQLQuerywarningArgs = {
  id: Scalars['ID']['input'];
};


export type GQLQuerywarningsArgs = {
  filter?: InputMaybe<GQLWarningFilter>;
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  scopes: Array<Scalars['JSONObject']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<GQLWarningSort>>;
  status?: Array<GQLWarningStatus>;
};

export type GQLRedirect = {
  __typename?: 'Redirect';
  activatedAt: Maybe<Scalars['DateTime']['output']>;
  active: Scalars['Boolean']['output'];
  comment: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dependencies: GQLPaginatedDependencies;
  generationType: GQLRedirectGenerationType;
  id: Scalars['ID']['output'];
  scope: GQLRedirectScope;
  source: Scalars['String']['output'];
  sourceType: GQLRedirectSourceTypeValues;
  target: Scalars['JSONObject']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type GQLRedirectdependenciesArgs = {
  filter?: InputMaybe<GQLDependencyFilter>;
  forceRefresh?: Scalars['Boolean']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};

export type GQLRedirectFilter = {
  active?: InputMaybe<GQLBooleanFilter>;
  and?: InputMaybe<Array<GQLRedirectFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  generationType?: InputMaybe<GQLStringFilter>;
  or?: InputMaybe<Array<GQLRedirectFilter>>;
  source?: InputMaybe<GQLStringFilter>;
  target?: InputMaybe<GQLStringFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLRedirectGenerationType =
  | 'automatic'
  | 'manual';

export type GQLRedirectInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  comment?: InputMaybe<Scalars['String']['input']>;
  generationType: GQLRedirectGenerationType;
  source: Scalars['String']['input'];
  sourceType: GQLRedirectSourceTypeValues;
  target: Scalars['JSONObject']['input'];
};

export type GQLRedirectScope = {
  __typename?: 'RedirectScope';
  domain: Scalars['String']['output'];
};

export type GQLRedirectScopeInput = {
  domain: Scalars['String']['input'];
};

export type GQLRedirectSort = {
  direction?: GQLSortDirection;
  field: GQLRedirectSortField;
};

export type GQLRedirectSortField =
  | 'createdAt'
  | 'source'
  | 'updatedAt';

export type GQLRedirectSourceTypeValues =
  | 'path';

export type GQLRedirectUpdateActivenessInput = {
  active: Scalars['Boolean']['input'];
};

export type GQLScopeFilter = {
  equal?: InputMaybe<Scalars['JSONObject']['input']>;
  isAnyOf?: InputMaybe<Array<Scalars['JSONObject']['input']>>;
  notEqual?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type GQLSlugAvailability =
  | 'Available'
  | 'Reserved'
  | 'Taken';

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

export type GQLUpdateDamFileInput = {
  altText?: InputMaybe<Scalars['String']['input']>;
  folderId?: InputMaybe<Scalars['ID']['input']>;
  image?: InputMaybe<GQLUpdateImageFileInput>;
  license?: InputMaybe<GQLLicenseInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type GQLUpdateDamFolderInput = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type GQLUpdateImageFileInput = {
  cropArea?: InputMaybe<GQLImageCropAreaInput>;
};

export type GQLUserContentScopesInput = {
  contentScopes?: Array<Scalars['JSONObject']['input']>;
};

export type GQLUserGroup =
  | 'admin'
  | 'all'
  | 'editor';

export type GQLUserPermission = {
  __typename?: 'UserPermission';
  approvedBy: Maybe<Scalars['String']['output']>;
  contentScopes: Array<Scalars['JSONObject']['output']>;
  id: Scalars['ID']['output'];
  overrideContentScopes: Scalars['Boolean']['output'];
  permission: GQLPermission;
  reason: Maybe<Scalars['String']['output']>;
  requestedBy: Maybe<Scalars['String']['output']>;
  source: GQLUserPermissionSource;
  validFrom: Maybe<Scalars['DateTime']['output']>;
  validTo: Maybe<Scalars['DateTime']['output']>;
};

export type GQLUserPermissionInput = {
  approvedBy?: InputMaybe<Scalars['String']['input']>;
  permission: GQLPermission;
  reason?: InputMaybe<Scalars['String']['input']>;
  requestedBy?: InputMaybe<Scalars['String']['input']>;
  validFrom?: InputMaybe<Scalars['DateTime']['input']>;
  validTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type GQLUserPermissionOverrideContentScopesInput = {
  contentScopes?: Array<Scalars['JSONObject']['input']>;
  overrideContentScopes: Scalars['Boolean']['input'];
  permissionId: Scalars['ID']['input'];
};

export type GQLUserPermissionPaginatedUserList = {
  __typename?: 'UserPermissionPaginatedUserList';
  nodes: Array<GQLUserPermissionsUser>;
  totalCount: Scalars['Int']['output'];
};

export type GQLUserPermissionSource =
  | 'BY_RULE'
  | 'MANUAL';

export type GQLUserPermissionsUser = {
  __typename?: 'UserPermissionsUser';
  contentScopesCount: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  impersonationAllowed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  permissionsCount: Scalars['Int']['output'];
};

export type GQLUserPermissionsUserFilter = {
  and?: InputMaybe<Array<GQLUserPermissionsUserFilter>>;
  email?: InputMaybe<GQLStringFilter>;
  name?: InputMaybe<GQLStringFilter>;
  or?: InputMaybe<Array<GQLUserPermissionsUserFilter>>;
  permission?: InputMaybe<GQLPermissionFilter>;
  status?: InputMaybe<GQLStringFilter>;
};

export type GQLUserPermissionsUserSort = {
  direction?: GQLSortDirection;
  field: GQLUserPermissionsUserSortField;
};

export type GQLUserPermissionsUserSortField =
  | 'email'
  | 'name'
  | 'status';

export type GQLWarning = {
  __typename?: 'Warning';
  createdAt: Scalars['DateTime']['output'];
  entityInfo: Maybe<GQLEntityInfo>;
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  scope: Maybe<Scalars['JSONObject']['output']>;
  severity: GQLWarningSeverity;
  sourceInfo: GQLWarningSourceInfo;
  status: GQLWarningStatus;
  updatedAt: Scalars['DateTime']['output'];
};

export type GQLWarningFilter = {
  and?: InputMaybe<Array<GQLWarningFilter>>;
  createdAt?: InputMaybe<GQLDateTimeFilter>;
  message?: InputMaybe<GQLStringFilter>;
  or?: InputMaybe<Array<GQLWarningFilter>>;
  scope?: InputMaybe<GQLScopeFilter>;
  severity?: InputMaybe<GQLWarningSeverityEnumFilter>;
  status?: InputMaybe<GQLWarningStatusEnumFilter>;
  type?: InputMaybe<GQLStringFilter>;
  updatedAt?: InputMaybe<GQLDateTimeFilter>;
};

export type GQLWarningSeverity =
  | 'high'
  | 'low'
  | 'medium';

export type GQLWarningSeverityEnumFilter = {
  equal?: InputMaybe<GQLWarningSeverity>;
  isAnyOf?: InputMaybe<Array<GQLWarningSeverity>>;
  notEqual?: InputMaybe<GQLWarningSeverity>;
};

export type GQLWarningSort = {
  direction?: GQLSortDirection;
  field: GQLWarningSortField;
};

export type GQLWarningSortField =
  | 'createdAt'
  | 'message'
  | 'severity'
  | 'status'
  | 'type'
  | 'updatedAt';

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

export type GQLWarningStatusEnumFilter = {
  equal?: InputMaybe<GQLWarningStatus>;
  isAnyOf?: InputMaybe<Array<GQLWarningStatus>>;
  notEqual?: InputMaybe<GQLWarningStatus>;
};
