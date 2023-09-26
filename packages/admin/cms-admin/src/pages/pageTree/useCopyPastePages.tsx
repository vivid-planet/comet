import { gql, useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { readClipboard, ReplaceDependencyObject, writeClipboard } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { useContentScope } from "../../contentScope/Provider";
import { useDamScope } from "../../dam/config/useDamScope";
import { GQLDocument, GQLPageQuery, GQLPageQueryVariables, GQLUpdatePageMutationVariables } from "../../documents/types";
import { arrayToTreeMap } from "./treemap/TreeMapUtils";
import {
    GQLCopyFilesToScopeMutation,
    GQLCopyFilesToScopeMutationVariables,
    GQLCreatePageNodeMutation,
    GQLCreatePageNodeMutationVariables,
    GQLSlugAvailableQuery,
    GQLSlugAvailableQueryVariables,
} from "./useCopyPastePages.generated";
import { GQLPageTreePageFragment } from "./usePageTree";
import { usePageTreeContext } from "./usePageTreeContext";

const slugAvailableQuery = gql`
    query SlugAvailable($parentId: ID, $slug: String!, $scope: PageTreeNodeScopeInput!) {
        pageTreeNodeSlugAvailable(parentId: $parentId, slug: $slug, scope: $scope)
    }
`;

const createPageNodeMutation = gql`
    mutation CreatePageNode($input: PageTreeNodeCreateInput!, $contentScope: PageTreeNodeScopeInput!, $category: String!) {
        createPageTreeNode(input: $input, scope: $contentScope, category: $category) {
            id
        }
    }
`;

const copyFilesToScopeMutation = gql`
    mutation CopyFilesToScope($fileIds: [ID!]!, $targetScope: DamScopeInput!, $existingInboxFolderId: ID) {
        copyFilesToScope(fileIds: $fileIds, targetScope: $targetScope, existingInboxFolderId: $existingInboxFolderId) {
            numberNewlyCopiedFiles
            inboxFolderId
            mappedFiles {
                rootFile {
                    id
                }
                copy {
                    id
                }
                isNewCopy
            }
        }
    }
`;

type PageClipboard = GQLPageTreePageFragment & { document?: GQLDocument | null };

export interface PagesClipboard {
    pages: PageClipboard[];
}

interface SendPagesOptions {
    /**
     * The position where the new page(s) should be pasted.
     * If undefined, the page(s) are added at the very end
     * */
    targetPos?: number;
}

/**
 * Typeguard to check if an object is a PagesClipboard Type
 * @param pagesClipboard
 */
function isPagesClipboard(pagesClipboard: PagesClipboard): pagesClipboard is PagesClipboard {
    return (pagesClipboard as PagesClipboard).pages !== undefined;
}

/**
 * Union return type from `getFromClipboard` function.
 * The union discriminator `canPaste` returns either a PagesClipboard data if it could be parsed, otherwise an localized error in form of a ReactNode
 */
type GetFromClipboardResponse = { canPaste: true; content: PagesClipboard } | { canPaste: false; error: React.ReactNode };

interface UseCopyPastePagesApi {
    /**
     * parallel fetches missing document data and prepares data for clipboard.
     * @param flatPagesTree
     */
    prepareForClipboard: (pages: GQLPageTreePageFragment[]) => Promise<PagesClipboard>;

    /**
     * writes pages to the clipboard.
     * @param pages Use `prepareForClipboard` function to generate this kind of type
     */
    writeToClipboard: (pages: PagesClipboard) => Promise<void>;

    /**
     * read data from clipboard, validate it and return parsed data.
     */
    getFromClipboard: () => Promise<GetFromClipboardResponse>;

    /**
     * Iterates over passed pages synchronous and creates data with mutations
     *
     * Process:
     *      1. traverses the tree with top-down strategy
     *          1a. Create new document with new id
     *          1b. Generate unique slug by adding "-{uniqueNumber}" to the slug
     *          1c. If the page is copied from one scope to another, copy the files on this page to the new scope
     *          1d. Create new PageTreeNode
     *              - with new name "{name} {uniqueNumber}"
     *              - and new parent id
     *              - new document id (created in step 1a)
     *      2. Refetch Pages query
     *
     * @param parentId Parent Id where the paste should be attached to
     * @param pages all pages which should be pasted
     * @param options customize where the pages are pasted
     */
    sendPages: (parentId: string | null, pages: PagesClipboard, options?: SendPagesOptions) => Promise<void>;
}

/**
 * This hooks provides some helper functions to copy / paste Pages and PageTreeNodes
 */
function useCopyPastePages(): UseCopyPastePagesApi {
    const { documentTypes } = usePageTreeContext();
    const client = useApolloClient();
    const { scope } = useContentScope();
    const damScope = useDamScope();

    const prepareForClipboard = React.useCallback(
        async (pages: GQLPageTreePageFragment[]): Promise<PagesClipboard> => {
            const pagesWithDocuments: Array<PageClipboard> = [];

            await Promise.all(
                pages.map(async (page) => {
                    const documentType = documentTypes[page.documentType];

                    if (!documentType) {
                        throw new Error(`Unknown document type "${documentType}"`);
                    }

                    try {
                        const query = documentType.getQuery;

                        if (query) {
                            const { data } = await client.query<GQLPageQuery, GQLPageQueryVariables>({
                                query,
                                variables: {
                                    id: page.id,
                                },
                                context: LocalErrorScopeApolloContext,
                            });

                            const clipboardPage: PageClipboard = { ...page, document: data?.page?.document };
                            pagesWithDocuments.push(clipboardPage);
                        }
                    } catch (e) {
                        throw new Error(`Error while fetching page`);
                    }
                }),
            );

            const clipboardPages: PagesClipboard = {
                pages: [...pagesWithDocuments],
            };
            return clipboardPages;
        },
        [client, documentTypes],
    );
    const writeToClipboard = React.useCallback(async (pages: PagesClipboard) => {
        return writeClipboard(JSON.stringify(pages));
    }, []);

    const getFromClipboard = async (): Promise<GetFromClipboardResponse> => {
        const text = await readClipboard();

        if (text === undefined) {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.pages.cannotPastePage.messageFailedToReadClipboard"
                        defaultMessage="Can't read clipboard content. Please make sure that clipboard access is given"
                    />
                ),
            };
        }

        if (text.trim() === "") {
            return {
                canPaste: false,
                error: <FormattedMessage id="comet.pages.cannotPastePage.messageEmptyClipboard" defaultMessage="Clipboard is empty" />,
            };
        }

        try {
            const parsedText = JSON.parse(text);
            if (isPagesClipboard(parsedText)) {
                return { canPaste: true, content: parsedText };
            } else {
                return {
                    canPaste: false,
                    error: (
                        <FormattedMessage
                            id="comet.pages.cannotPasteBlock.messageFailedToParseClipboard"
                            defaultMessage="Content from clipboard aren't valid blocks"
                        />
                    ),
                };
            }
        } catch (e) {
            return {
                canPaste: false,
                error: (
                    <FormattedMessage
                        id="comet.pages.cannotPasteBlock.messageFailedToParseClipboard"
                        defaultMessage="Content from clipboard aren't valid blocks"
                    />
                ),
            };
        }
    };
    const sendPages = React.useCallback(
        async (parentId: string | null, { pages }: PagesClipboard, options?: SendPagesOptions): Promise<void> => {
            const tree = arrayToTreeMap<PageClipboard>(pages);
            const pageTreeNodeIdReplacements = createPageTreeNodeIdReplacements(pages);
            let inboxFolderIdForCopiedFiles: string | undefined = undefined;

            const handlePageTreeNode = async (node: PageClipboard, newParentId: string | null, posOffset: number): Promise<string> => {
                const documentType = documentTypes[node.documentType];
                if (!documentType) {
                    throw new Error(`Unknown document type "${documentType}"`);
                }

                // 1a. Generate unique slug by adding "{slug}-{uniqueNumber}" to the slug
                let slug: string = node.slug;
                let name: string = node.name;
                let duplicateNumber = 1;
                let slugAvailable = false;

                do {
                    const { data } = await client.query<GQLSlugAvailableQuery, GQLSlugAvailableQueryVariables>({
                        query: slugAvailableQuery,
                        variables: {
                            parentId: newParentId,
                            slug,
                            scope,
                        },
                        fetchPolicy: "network-only",
                        context: LocalErrorScopeApolloContext,
                    });

                    slugAvailable = data.pageTreeNodeSlugAvailable === "Available";
                    if (!slugAvailable) {
                        ++duplicateNumber;
                        name = `${node.name} ${duplicateNumber}`;
                        slug = `${node.slug}-${duplicateNumber}`;
                    }
                } while (!slugAvailable);

                // 1b. Create new PageTreeNode with new name "{name} {uniqueNumber}" and new parent
                const { data } = await client.mutate<GQLCreatePageNodeMutation, GQLCreatePageNodeMutationVariables>({
                    mutation: createPageNodeMutation,
                    variables: {
                        input: {
                            id: pageTreeNodeIdReplacements.find((replacement) => replacement.originalId === node.id)?.replaceWithId,
                            name,
                            slug,
                            hideInMenu: node.hideInMenu,
                            attachedDocument: {
                                type: node.documentType,
                            },
                            parentId: newParentId,
                            pos: options?.targetPos ? options.targetPos + posOffset : undefined,
                        },
                        contentScope: scope,
                        category: node.category,
                    },
                    context: LocalErrorScopeApolloContext,
                });
                if (!data?.createPageTreeNode.id) {
                    throw Error("Did not receive new uuid for page tree node");
                }

                // 1c. Copy all files used on page to target scope
                let fileIdReplacements: ReplaceDependencyObject[] | undefined;
                if (node?.document != null) {
                    const fileDependencyIds = documentType
                        .dependencies(node.document)
                        .filter((dependency) => dependency.targetGraphqlObjectType === "DamFile")
                        .map((dependency) => dependency.id);

                    if (fileDependencyIds.length > 0) {
                        const { data: copiedFiles } = await client.mutate<GQLCopyFilesToScopeMutation, GQLCopyFilesToScopeMutationVariables>({
                            mutation: copyFilesToScopeMutation,
                            variables: { fileIds: fileDependencyIds, targetScope: damScope, existingInboxFolderId: inboxFolderIdForCopiedFiles },
                            update: (cache, result) => {
                                if (result.data && result.data.copyFilesToScope.numberNewlyCopiedFiles > 0) {
                                    cache.evict({ fieldName: "damItemsList" });
                                }
                            },
                        });

                        inboxFolderIdForCopiedFiles = copiedFiles?.copyFilesToScope.inboxFolderId ?? undefined;

                        if (copiedFiles) {
                            fileIdReplacements = createFileIdReplacements(copiedFiles.copyFilesToScope.mappedFiles);
                        }
                    }
                }

                // 1d. Create new document
                const newDocumentId = uuid();
                const replacements = [...pageTreeNodeIdReplacements, ...(fileIdReplacements ?? [])];
                if (node?.document != null && documentType.updateMutation && documentType.inputToOutput && documentType.replaceDependenciesInOutput) {
                    await client.mutate<unknown, GQLUpdatePageMutationVariables>({
                        mutation: documentType.updateMutation,
                        variables: {
                            pageId: newDocumentId,
                            input: documentType.replaceDependenciesInOutput(documentType.inputToOutput(node.document), replacements),
                            attachedPageTreeNodeId: data.createPageTreeNode.id,
                        },
                        context: LocalErrorScopeApolloContext,
                    });
                }

                return data.createPageTreeNode.id;
            };

            const traverse = async (parentId = "root", newParentId: string | null = null): Promise<void> => {
                const nodes = tree.get(parentId) || [];
                let posOffset = 0;
                for (const node of nodes) {
                    const newPageTreeUUID = await handlePageTreeNode(node, newParentId, posOffset++);

                    await traverse(node.id, newPageTreeUUID);
                }
            };

            // 1. traverses the tree with top-down strategy
            await traverse("root", parentId);

            // 2. Refetch Pages query
            client.refetchQueries({ include: ["Pages"] });
        },
        [client, damScope, documentTypes, scope],
    );

    return { prepareForClipboard, writeToClipboard, getFromClipboard, sendPages };
}

function createFileIdReplacements(mappedIds: Array<{ rootFile: { id: string }; copy: { id: string } }>): ReplaceDependencyObject[] {
    const replacements: ReplaceDependencyObject[] = [];

    for (const item of mappedIds) {
        replacements.push({ type: "DamFile", originalId: item.rootFile.id, replaceWithId: item.copy.id });
    }

    return replacements;
}

/**
 * Creates a mapping between the old page tree node ID and a new page tree ID. Used for rewriting links to internal pages.
 * @param nodes
 */
function createPageTreeNodeIdReplacements(nodes: PageClipboard[]): ReplaceDependencyObject[] {
    const replacements: ReplaceDependencyObject[] = [];

    for (const node of nodes) {
        replacements.push({ type: "PageTreeNode", originalId: node.id, replaceWithId: uuid() });
    }

    return replacements;
}

export { useCopyPastePages };
