import { gql, useApolloClient } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { readClipboard, writeClipboard } from "@comet/blocks-admin";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import { useContentScope } from "../../contentScope/Provider";
import { GQLDocument, GQLPageQuery, GQLPageQueryVariables, GQLUpdatePageMutationVariables, IdsMap } from "../../documents/types";
import {
    GQLCreatePageNodeMutation,
    GQLCreatePageNodeMutationVariables,
    GQLPageTreePageFragment,
    GQLSlugAvailableQuery,
    GQLSlugAvailableQueryVariables,
    namedOperations,
} from "../../graphql.generated";
import { arrayToTreeMap } from "./treemap/TreeMapUtils";
import { usePageTreeContext } from "./usePageTreeContext";

const slugAvailableQuery = gql`
    query SlugAvailable($parentId: ID, $slug: String!, $scope: PageTreeNodeScopeInput!) {
        pageTreeNodeSlugAvailable(parentId: $parentId, slug: $slug, scope: $scope)
    }
`;

const createPageNodeMutation = gql`
    mutation CreatePageNode($input: PageTreeNodeCreateInput!, $contentScope: PageTreeNodeScopeInput!, $category: PageTreeNodeCategory!) {
        createPageTreeNode(input: $input, scope: $contentScope, category: $category) {
            id
        }
    }
`;

type PageClipboard = GQLPageTreePageFragment & { document?: GQLDocument | null };

export interface PagesClipboard {
    pages: PageClipboard[];
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
     *          1c. Create new PageTreeNode
     *              - with new name "{name} {uniqueNumber}"
     *              - and new parent id
     *              - new document id (created in step 1a)
     *      2. Refetch Pages query
     *
     * @param parentId Parent Id where the paste should be attached to
     * @param pages all pages which should be pasted
     */
    sendPages: (parentId: string | null, pages: PagesClipboard) => Promise<void>;
}

/**
 * This hooks provides some helper functions to copy / paste Pages and PageTreeNodes
 */
function useCopyPastePages(): UseCopyPastePagesApi {
    const { documentTypes } = usePageTreeContext();
    const client = useApolloClient();
    const { scope } = useContentScope();

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
        async (parentId: string | null, { pages }: PagesClipboard): Promise<void> => {
            const tree = arrayToTreeMap<PageClipboard>(pages);
            const idsMap = createIdsMap(pages);

            const handlePageTreeNode = async (node: PageClipboard, newParentId: string | null): Promise<string> => {
                // 1a. Create new document
                const newDocumentId = uuid();
                const documentType = documentTypes[node.documentType];
                if (!documentType) {
                    throw new Error(`Unknown document type "${documentType}"`);
                }

                if (node?.document != null && documentType.updateMutation && documentType.inputToOutput) {
                    await client.mutate<unknown, GQLUpdatePageMutationVariables>({
                        mutation: documentType.updateMutation,
                        variables: {
                            pageId: newDocumentId,
                            input: documentType.inputToOutput(node.document, { idsMap }),
                        },
                        context: LocalErrorScopeApolloContext,
                    });
                }

                // 1b. Generate unique slug by adding "{slug}-{uniqueNumber}" to the slug
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

                // 1c. Create new PageTreeNode with new name "{name} {uniqueNumber}" and new parent
                const { data } = await client.mutate<GQLCreatePageNodeMutation, GQLCreatePageNodeMutationVariables>({
                    mutation: createPageNodeMutation,
                    variables: {
                        input: {
                            id: idsMap.get(node.id),
                            name,
                            slug,
                            hideInMenu: node.hideInMenu,
                            attachedDocument: {
                                id: newDocumentId,
                                type: node.documentType,
                            },
                            parentId: newParentId,
                            pos: node.pos + 1,
                        },
                        contentScope: scope,
                        category: node.category,
                    },
                    context: LocalErrorScopeApolloContext,
                });
                if (!data?.createPageTreeNode.id) {
                    throw Error("Did not receive new uuid for page tree node");
                }
                return data.createPageTreeNode.id;
            };

            const traverse = async (parentId = "root", newParentId: string | null = null): Promise<void> => {
                const nodes = tree.get(parentId) || [];
                for (const node of nodes) {
                    const newPageTreeUUID = await handlePageTreeNode(node, newParentId);

                    await traverse(node.id, newPageTreeUUID);
                }
            };

            // 1. traverses the tree with top-down strategy
            await traverse("root", parentId);

            // 2. Refetch Pages query
            client.refetchQueries({ include: [namedOperations.Query.Pages] });
        },
        [client, documentTypes, scope],
    );

    return { prepareForClipboard, writeToClipboard, getFromClipboard, sendPages };
}

/**
 * Creates a mapping between the old page tree node ID and a new page tree ID. Used for rewriting links to internal pages.
 * @param nodes
 */
function createIdsMap(nodes: PageClipboard[]): IdsMap {
    const idsMap = new Map<string, string>();

    nodes.forEach((node) => {
        idsMap.set(node.id, uuid());
    });

    return idsMap;
}

export { useCopyPastePages };
