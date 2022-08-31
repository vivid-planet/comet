import { gql, TypedDocumentNode, useMutation, useQuery } from "@apollo/client";
import { ApolloError } from "@apollo/client/errors";
import { messages, SaveButton, SaveButtonProps, SplitButton, useStackApi } from "@comet/admin";
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
import { v4 as uuidv4 } from "uuid";

import { GQLCheckForChangesQuery, GQLCheckForChangesQueryVariables, GQLDocumentInterface } from "../graphql.generated";
import { resolveHasSaveConflict } from "./resolveHasSaveConflict";
import { useSaveConflict } from "./useSaveConflict";

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
            lastUpdatedAt?: string;
            attachedPageTreeNodeId?: string | null;
        } = {
            pageId: string;
            input: BlockGQLData<RootBlocks>;
            lastUpdatedAt?: string;
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
    saving: boolean;
    error: ApolloError | undefined;
    saveError: ApolloError | undefined;
    validating: boolean;
    valid: boolean;
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
            lastUpdatedAt?: string;
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
                id: uuidv4(),
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
            const [pageState, setPageState] = React.useState<undefined | PS>(undefined);
            const [referenceOutput, setReferenceOutput] = React.useState<undefined | Output>(undefined);
            const [valid, setValid] = React.useState(true);
            const [validating, setValidating] = React.useState(false);

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

            const [mutation, { loading: saving, error: saveError }] = useMutation<GQLUpdatePageMutation, GQLUpdatePageMutationVariables>(
                updateMutation,
            );

            const resetPageStateToLatest = async () => {
                //resets the page state by refetch data from server
                await refetch();
            };

            const {
                loading: saveConflictLoading,
                dialogs,
                checkForConflicts: checkForSaveConflict,
                hasConflict,
            } = useSaveConflict<GQLCheckForChangesQuery, GQLCheckForChangesQueryVariables>(
                checkForChangesQuery,
                {
                    variables: {
                        id: pageId,
                    },
                    resolveHasConflict: (data) => {
                        return resolveHasSaveConflict(pageState?.document?.updatedAt, data?.page?.document?.updatedAt);
                    },
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
                    setValidating(true);
                    const isValid = await parallelAsyncEvery(Object.entries(rootBlocks), async ([key, block]) => {
                        return await block.isValid(pageState.document?.[key]);
                    });
                    setValid(isValid);
                    setValidating(false);

                    if (!isValid) {
                        onValidationFailed && onValidationFailed();
                        return;
                    }

                    const hasSaveConflict = await checkForSaveConflict();
                    if (hasSaveConflict) {
                        return; // dialogs open for the user to handle the conflict
                    }

                    await mutation({
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

                    setReferenceOutput(generateOutput(pageState));
                } else if (pageState && pageState.document) {
                    throw new Error(`saving this type of document (type == ${pageState.document.__typename}) is currently not implemented`);
                } else {
                    throw new Error("No page state");
                }
            }, [data, mutation, pageId, pageState, onValidationFailed, checkForSaveConflict]);

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
            const rootBlocksApi: BlockNodeApi<RootBlocks> = React.useMemo(
                () =>
                    Object.entries(rootBlocks).reduce((a, [key, value]) => {
                        const UnboundComponent = value.AdminComponent;
                        const state = pageState && pageState.document ? pageState.document[key] : null;
                        const handleUpdateState = createHandleUpdate(key);

                        return {
                            ...a,
                            [key]: {
                                adminUI: state ? React.createElement(UnboundComponent, { state, updateState: handleUpdateState }) : null,
                                isValid: async () => await value.isValid(state),
                            },
                        };
                    }, {} as BlockNodeApi<RootBlocks>),
                [pageState, createHandleUpdate],
            );

            const pageSaveButton = React.useMemo<JSX.Element>(
                () => (
                    <PageSaveButton
                        hasChanges={hasChanges}
                        handleSavePage={handleSavePage}
                        error={error}
                        saveError={saveError}
                        saving={saving}
                        valid={valid}
                        validating={validating}
                        checkingSaveConflict={saveConflictLoading}
                        hasSaveConflict={hasConflict}
                    />
                ),
                [hasChanges, handleSavePage, error, saveError, saving, valid, validating, saveConflictLoading, hasConflict],
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
                valid,
                validating,
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
    saving: boolean;
    error: ApolloError | undefined;
    saveError: ApolloError | undefined;
    validating: boolean;
    valid: boolean;
    checkingSaveConflict: boolean;
    hasSaveConflict: boolean;
}
function PageSaveButton({
    handleSavePage,
    hasChanges,
    saving,
    saveError,
    validating,
    valid,
    checkingSaveConflict,
    hasSaveConflict,
}: PageSaveButtonProps): JSX.Element {
    const stackApi = useStackApi();

    const saveButtonProps: Omit<SaveButtonProps, "children | onClick"> = {
        color: "primary",
        variant: "contained",
        saving: saving || validating || checkingSaveConflict,
        hasErrors: saveError != null || !valid || hasSaveConflict,
        errorItem: !valid ? (
            <FormattedMessage {...messages.invalidData} />
        ) : hasSaveConflict ? (
            <FormattedMessage {...messages.saveConflict} />
        ) : undefined,
    };

    return (
        <SplitButton localStorageKey="SaveSplitButton" disabled={!hasChanges}>
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
