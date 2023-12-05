import { ApolloError, gql, TypedDocumentNode, useApolloClient, useQuery } from "@apollo/client";
import { messages, SaveButton, SaveButtonProps, SplitButton, SplitButtonProps, useStackApi } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import {
    BindBlockAdminComponent,
    BlockInterface,
    BlockState,
    DispatchSetStateAction,
    parallelAsyncEvery,
    resolveNewState,
} from "@comet/blocks-admin";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { GQLDocumentInterface } from "../graphql.generated";
import { GQLCheckForChangesQuery, GQLCheckForChangesQueryVariables } from "./createUsePage.generated";
import { LocalPageTreeNodeDocumentAnchorsProvider } from "./LocalPageTreeNodeDocumentAnchors";
import { resolveHasSaveConflict } from "./resolveHasSaveConflict";
import { useSaveConflictQuery } from "./useSaveConflictQuery";

type Output = Record<string, unknown>;
// dictionary of all root-blocks connected to a page
type RootBlocksInterface = Record<string, BlockInterface>;

// Template for the GQL-Query, it must at minimum look like this
interface GQLEditPageQueryInterface<PageType extends string> {
    page: {
        // path: string;
        document:
            | (GQLDocumentInterface & {
                  __typename: PageType | string;
                  [key: string]: unknown;
              })
            | null;
    } | null;
}

// root-blocks connected to a page, in the GQL
type BlockGQLData<T extends RootBlocksInterface> = {
    [K in keyof T]: unknown;
};

// all static configuration options needed to create a usePage hook

interface CreateUsePage {
    <RootBlocks extends RootBlocksInterface, PageType extends string>(outerOptions: { rootBlocks: RootBlocks; pageType: PageType }): <
        GQLEditPageQuery extends GQLEditPageQueryInterface<PageType> | null, // the page state is infered from this
        GQLEditPageQueryVariables extends { id: string } = { id: string }, // for type-safety, query must match this shape
        GQLUpdatePageMutation extends { id: string } & BlockGQLData<RootBlocks> = {
            id: string;
        } & BlockGQLData<RootBlocks>, // for type-safety, mutation must match this shape
        GQLUpdatePageMutationVariables extends {
            pageId: string;
            input: BlockGQLData<RootBlocks>;
            lastUpdatedAt?: string | null;
            attachedPageTreeNodeId?: string | null;
        } = {
            pageId: string;
            input: BlockGQLData<RootBlocks>;
            lastUpdatedAt?: string | null;
            attachedPageTreeNodeId?: string | null;
        }, // for type-safety, api must support those variables
    >(options: {
        getQuery: TypedDocumentNode<GQLEditPageQuery, GQLEditPageQueryVariables>;
        updateMutation: TypedDocumentNode<GQLUpdatePageMutation, GQLUpdatePageMutationVariables>;
    }) => UsePageFn<GQLEditPageQuery, RootBlocks, PageType>;
}

// used to build the page state:
// exchanges the untyped GQL block-types with the block-state from the block-interfaces
type ReplaceBlockInputDataWithBlockState<Doc extends Record<string, unknown> | null, RootBlocks extends RootBlocksInterface> =
    | null
    | {
          [K in keyof Doc]: K extends "id" ? string : K extends keyof RootBlocks ? BlockState<RootBlocks[K]> : Doc[K]; // key id is always a string and never a block
      };

export type PageState<
    GQLEditPageQuery extends GQLEditPageQueryInterface<PageType> | null,
    RootBlocks extends RootBlocksInterface,
    PageType extends string,
> = NonNullable<{
    [K in keyof NonNullable<NonNullable<GQLEditPageQuery>["page"]>]: K extends "document"
        ? ReplaceBlockInputDataWithBlockState<
              Extract<NonNullable<NonNullable<GQLEditPageQuery>["page"]>["document"], { __typename: PageType }>,
              RootBlocks
          >
        : NonNullable<NonNullable<GQLEditPageQuery>["page"]>[K];
}>;

// hook exposes a block-api
type BlockNodeApi<RootBlocks extends RootBlocksInterface> = {
    [K in keyof RootBlocks]: {
        adminUI: BindBlockAdminComponent<RootBlocks[K]["AdminComponent"]>; // state and updateState props are bound to the state handler of usePageHook
        isValid: () => Promise<boolean>;
    };
};
interface UsePageProps {
    pageId: string;
    onValidationFailed?: () => void;
}
interface UsePageApi<PageState, RootBlocks extends RootBlocksInterface> {
    pageState?: PageState;
    rootBlocksApi: BlockNodeApi<RootBlocks>;
    handleSavePage: () => Promise<void>;
    hasChanges?: boolean;
    loading: boolean;
    error: ApolloError | undefined;
    saving: boolean;
    saveError: "invalid" | "conflict" | "error" | undefined;
    pageSaveButton: JSX.Element;
    dialogs: React.ReactNode;
    resetPageStateToLatest: () => Promise<void>;
}

// signature of the usePage hook
type UsePageFn<
    GQLEditPageQuery extends GQLEditPageQueryInterface<PageType> | null,
    RootBlocks extends RootBlocksInterface,
    PageType extends string,
> = (p: UsePageProps) => UsePageApi<PageState<GQLEditPageQuery, RootBlocks, PageType>, RootBlocks>;

export const createUsePage: CreateUsePage =
    <RootBlocks extends RootBlocksInterface, PageType extends string>({
        rootBlocks,
        pageType: gqlPageType,
    }: {
        rootBlocks: RootBlocks;
        pageType: PageType;
    }) =>
    <
        GQLEditPageQuery extends GQLEditPageQueryInterface<PageType> | null,
        GQLEditPageQueryVariables extends { id: string },
        GQLUpdatePageMutation extends {
            id: string;
        } & BlockGQLData<RootBlocks>,
        GQLUpdatePageMutationVariables extends {
            pageId: string;
            input: BlockGQLData<RootBlocks>;
            lastUpdatedAt?: string | null;
            attachedPageTreeNodeId?: string | null;
        },
    >({
        getQuery,
        updateMutation,
    }: {
        getQuery: TypedDocumentNode<GQLEditPageQuery, GQLEditPageQueryVariables>;
        updateMutation: TypedDocumentNode<GQLUpdatePageMutation, GQLUpdatePageMutationVariables>;
    }) => {
        // internal PageState alias
        type PS = PageState<GQLEditPageQuery, RootBlocks, PageType>;
        function createEmptyPageDocument(): PS["document"] {
            return {
                id: uuid(),
                __typename: gqlPageType,
                ...Object.entries(rootBlocks).reduce(
                    (a, [key, value]) => ({
                        ...a,
                        [key]: value.defaultValues(),
                    }),
                    {},
                ),
            } as PS["document"];
        }

        return function usePage({
            pageId,
            onValidationFailed,
        }: UsePageProps): UsePageApi<PageState<GQLEditPageQuery, RootBlocks, PageType>, RootBlocks> {
            const client = useApolloClient();
            const [pageState, setPageState] = React.useState<undefined | PS>(undefined);
            const [referenceOutput, setReferenceOutput] = React.useState<undefined | Output>(undefined);
            const [saving, setSaving] = React.useState(false);
            const [saveError, setSaveError] = React.useState<"invalid" | "conflict" | "error" | undefined>();

            const generateOutput = (ps: PS): Output => {
                return {
                    ...Object.entries(rootBlocks).reduce(
                        (a, [key, value]) => ({
                            ...a,
                            [key]: value.state2Output(ps.document?.[key]),
                        }),
                        {},
                    ),
                };
            };

            let hasChanges: boolean | undefined = undefined;

            try {
                if (pageState) {
                    hasChanges = !isEqual(referenceOutput, generateOutput(pageState));
                }
            } catch {
                // Can't generate the output. This is likely to be caused by adding new blocks which have an invalid output upon creation (for instance
                // the image block, as it requires a file to be selected). We assume that the user made some changes to the page content.
                hasChanges = true;
            }

            const { loading, data, error, refetch } = useQuery<GQLEditPageQuery, GQLEditPageQueryVariables>(getQuery, {
                variables: {
                    id: pageId,
                } as GQLEditPageQueryVariables,
            });

            const resetPageStateToLatest = async () => {
                //resets the page state by refetch data from server
                await refetch();
            };

            const {
                dialogs,
                checkForConflicts: checkForSaveConflict,
                hasConflict,
            } = useSaveConflictQuery<GQLCheckForChangesQuery, GQLCheckForChangesQueryVariables>(
                checkForChangesQuery,
                {
                    variables: {
                        id: pageId,
                    },
                    resolveHasConflict: (data) => {
                        return resolveHasSaveConflict(pageState?.document?.updatedAt, data?.page?.document?.updatedAt);
                    },
                    skip: saving,
                },
                {
                    hasChanges: hasChanges ?? false,
                    loadLatestVersion: async () => {
                        await resetPageStateToLatest();
                    },
                    onDiscardButtonPressed: async () => {
                        await resetPageStateToLatest();
                    },
                },
            );

            // manage sync of page state and gql-api
            React.useEffect(() => {
                if (data?.page) {
                    const page = {
                        ...data.page,
                        document:
                            data.page.document && data.page.document.__typename === gqlPageType
                                ? {
                                      ...data.page.document,

                                      ...Object.entries(rootBlocks).reduce(
                                          (a, [key, value]) => ({
                                              ...a,
                                              [key]: value.input2State(data.page?.document?.[key]),
                                          }),
                                          {},
                                      ),
                                  }
                                : createEmptyPageDocument(),
                    } as unknown as PS;
                    setPageState(page);
                    setReferenceOutput(generateOutput(page));
                }
            }, [data, pageId]);

            const handleSavePage = React.useCallback(async () => {
                // TODO show progress and error handling
                if (pageState && pageState.document && pageState.document.__typename === gqlPageType && pageState.document.id) {
                    setSaving(true);
                    setSaveError(undefined);

                    const isValid = await parallelAsyncEvery(Object.entries(rootBlocks), async ([key, block]) => {
                        return block.isValid(pageState.document?.[key]);
                    });

                    if (!isValid) {
                        onValidationFailed && onValidationFailed();
                        setSaving(false);
                        setSaveError("invalid");
                        return;
                    }

                    const hasSaveConflict = await checkForSaveConflict();
                    if (hasSaveConflict) {
                        setSaving(false);
                        setSaveError("conflict");
                        return; // dialogs open for the user to handle the conflict
                    }

                    try {
                        await client.mutate<GQLUpdatePageMutation, GQLUpdatePageMutationVariables>({
                            mutation: updateMutation,
                            variables: {
                                pageId: pageState.document.id,
                                lastUpdatedAt: data?.page?.document?.updatedAt,
                                input: {
                                    ...Object.entries(rootBlocks).reduce(
                                        (a, [key, value]) => ({
                                            ...a,
                                            [key]: value.state2Output(pageState.document?.[key]),
                                        }),
                                        {},
                                    ),
                                    // stage: pageState.document.stage ? StageBlock.state2Output(pageState.document.stage) : null, refactor stage to optional block
                                },
                                attachedPageTreeNodeId: pageId,
                            } as GQLUpdatePageMutationVariables,
                            refetchQueries: [getQuery],
                            awaitRefetchQueries: true,
                            update(cache) {
                                // update reference to pageTreeNode
                                // needed for newly created pageTreeNodes
                                cache.writeFragment({
                                    id: cache.identify({ __typename: "PageTreeNode", id: pageId }),
                                    fragment: gql`
                                        fragment UpdateReferencePageTree on PageTreeNode {
                                            document {
                                                ... on DocumentInterface {
                                                    id
                                                }
                                            }
                                        }
                                    `,
                                    data: {
                                        document: {}, // reference to document is somehow magically updated without providing a value
                                    },
                                });
                            },
                        });
                    } catch (error) {
                        console.error(error);
                        setSaveError("error");
                    } finally {
                        setSaving(false);
                    }

                    setReferenceOutput(generateOutput(pageState));
                    setSaving(false);
                } else if (pageState && pageState.document) {
                    throw new Error(`saving this type of document (type == ${pageState.document.__typename}) is currently not implemented`);
                } else {
                    throw new Error("No page state");
                }
            }, [data, client, pageId, pageState, onValidationFailed, checkForSaveConflict]);

            // allow to create an updateHandler for each block-node
            const createHandleUpdate = React.useCallback((key: string) => {
                const handleUpdateState: DispatchSetStateAction<BlockInterface> = (setStateAction) => {
                    setPageState((s) => {
                        if (!s || !s.document) {
                            return;
                        }
                        const relevantOldState: BlockState<BlockInterface> = s.document[key] as BlockState<BlockInterface>;
                        const newBlockState = resolveNewState({ prevState: relevantOldState, setStateAction });

                        const newState: PS = {
                            ...s,
                            document: {
                                ...s?.document,
                                [key]: newBlockState,
                            },
                        };

                        return newState;
                    });
                };
                return handleUpdateState;
            }, []);

            // create block-api
            // - bind state, updatehandler to admin-component
            const rootBlocksApi: BlockNodeApi<RootBlocks> = React.useMemo(() => {
                const localAnchors =
                    pageState?.document === undefined
                        ? {}
                        : {
                              [pageId]: Array.from(
                                  new Set(
                                      Object.entries(rootBlocks).reduce(
                                          (anchors, [key, block]) => [...anchors, ...(block.anchors?.(pageState?.document?.[key]) ?? [])],
                                          [] as string[],
                                      ),
                                  ),
                              ),
                          };
                return Object.entries(rootBlocks).reduce((a, [key, value]) => {
                    const UnboundComponent = value.AdminComponent;
                    const state = pageState && pageState.document ? pageState.document[key] : null;
                    const handleUpdateState = createHandleUpdate(key);

                    return {
                        ...a,
                        [key]: {
                            adminUI: state ? (
                                <LocalPageTreeNodeDocumentAnchorsProvider localAnchors={localAnchors}>
                                    {React.createElement(UnboundComponent, { state, updateState: handleUpdateState })}
                                </LocalPageTreeNodeDocumentAnchorsProvider>
                            ) : null,
                            isValid: async () => value.isValid(state),
                        },
                    };
                }, {} as BlockNodeApi<RootBlocks>);
            }, [pageState, createHandleUpdate, pageId]);

            const pageSaveButton = React.useMemo<JSX.Element>(
                () => (
                    <PageSaveButton
                        hasConflict={hasConflict}
                        hasChanges={hasChanges}
                        handleSavePage={handleSavePage}
                        saveError={saveError}
                        saving={saving}
                    />
                ),
                [hasConflict, hasChanges, handleSavePage, saveError, saving],
            );

            return {
                hasChanges,
                handleSavePage,
                pageState,
                rootBlocksApi,
                loading,
                error,
                saveError,
                saving,
                pageSaveButton,
                resetPageStateToLatest,
                dialogs,
            };
        };
    };

const checkForChangesQuery = gql`
    query CheckForChanges($id: ID!) {
        page: pageTreeNode(id: $id) {
            document {
                ... on DocumentInterface {
                    updatedAt
                }
            }
        }
    }
`;

interface PageSaveButtonProps {
    handleSavePage: () => Promise<void>;
    hasChanges?: boolean;
    hasConflict: boolean;
    saving: boolean;
    saveError: "invalid" | "conflict" | "error" | undefined;
}
function PageSaveButton({ handleSavePage, hasChanges, hasConflict, saving, saveError }: PageSaveButtonProps): JSX.Element {
    const stackApi = useStackApi();

    const saveButtonProps: Omit<SaveButtonProps, "children | onClick"> = {
        color: "primary",
        variant: "contained",
        saving,
        hasErrors: !!saveError,
        hasConflict,
        errorItem:
            saveError == "invalid" ? (
                <FormattedMessage {...messages.invalidData} />
            ) : saveError == "conflict" ? (
                <FormattedMessage {...messages.saveConflict} />
            ) : undefined,
    };

    const splitButtonProps: Partial<SplitButtonProps> = {};
    if (hasConflict) {
        // setting the color to "error" is only necessary for the SplitButton and doesn't affect the SaveButton
        saveButtonProps.color = "error";
        splitButtonProps.selectIcon = <ChevronDown sx={{ color: (theme) => theme.palette.error.contrastText }} />;
    }

    return (
        <SplitButton {...splitButtonProps} localStorageKey="SaveSplitButton" disabled={!hasChanges}>
            <SaveButton onClick={handleSavePage} {...saveButtonProps}>
                <FormattedMessage {...messages.save} />
            </SaveButton>
            <SaveButton
                onClick={async () => {
                    await handleSavePage();
                    stackApi?.goBack();
                }}
                {...saveButtonProps}
            >
                <FormattedMessage {...messages.saveAndGoBack} />
            </SaveButton>
        </SplitButton>
    );
}
