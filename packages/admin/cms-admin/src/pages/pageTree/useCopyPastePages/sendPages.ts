import { ApolloClient, gql } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { ReplaceDependencyObject } from "@comet/blocks-admin";
import isEqual from "lodash.isequal";
import { v4 as uuid } from "uuid";

import { CmsBlockContext } from "../../../blocks/CmsBlockContextProvider";
import { ContentScopeInterface } from "../../../contentScope/Provider";
import { GQLUpdatePageMutationVariables } from "../../../documents/types";
import { PageTreeContext } from "../PageTreeContext";
import { arrayToTreeMap } from "../treemap/TreeMapUtils";
import { PageClipboard, PagesClipboard } from "../useCopyPastePages";
import { createIncomingFolder } from "./createIncomingFolder";
import {
    GQLCopyFilesToScopeMutation,
    GQLCopyFilesToScopeMutationVariables,
    GQLCreatePageNodeMutation,
    GQLCreatePageNodeMutationVariables,
    GQLSlugAvailableQuery,
    GQLSlugAvailableQueryVariables,
} from "./sendPages.generated";

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
    mutation CopyFilesToScope($fileIds: [ID!]!, $targetFolderId: ID!) {
        copyFilesToScope(fileIds: $fileIds, targetFolderId: $targetFolderId) {
            numberNewlyCopiedFiles
            mappedFiles {
                rootFile {
                    id
                }
                copy {
                    id
                }
            }
        }
    }
`;

export interface SendPagesOptions {
    /**
     * The position where the new page(s) should be pasted.
     * If undefined, the page(s) are added at the very end
     * */
    targetPos?: number;
}

interface SendPagesDependencies {
    client: ApolloClient<unknown>;
    scope: ContentScopeInterface;
    documentTypes: PageTreeContext["documentTypes"];
    blockContext: CmsBlockContext;
    damScope: Record<string, unknown>;
}

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
 **/
export async function sendPages(
    parentId: string | null,
    { pages }: PagesClipboard,
    options: SendPagesOptions,
    { client, scope, documentTypes, blockContext, damScope }: SendPagesDependencies,
): Promise<void> {
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
                    pos: options.targetPos ? options.targetPos + posOffset : undefined,
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
        const fileIdReplacements: ReplaceDependencyObject[] = [];
        const fileIdsToCopyDirectly: string[] = [];
        if (node?.document != null) {
            const fileDependencies = documentType
                .dependencies(node.document)
                .filter((dependency) => dependency.targetGraphqlObjectType === "DamFile");
            for (const fileDependency of fileDependencies) {
                if (fileDependency.data && (fileDependency.data as any).damFile) {
                    const { damFile } = fileDependency.data as any; // TODO typing
                    if (damFile.fileUrl) {
                        if (damFile.fileUrl.startsWith(blockContext.damConfig.apiUrl)) {
                            //our own api, no need to download&upload
                            if (isEqual(damFile.scope, damScope)) {
                                //same scope, same server, no need to copy
                            } else {
                                //batch copy below
                                fileIdsToCopyDirectly.push(damFile.id);
                            }
                        } else {
                            {
                                const fileResponse = await fetch(damFile.fileUrl);
                                const fileBlob = await fileResponse.blob();
                                const file = new File([fileBlob], damFile.name, { type: damFile.mimetype });
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("scope", JSON.stringify(damScope));
                                if (!inboxFolderIdForCopiedFiles) {
                                    const { id } = await createIncomingFolder({
                                        client,
                                        targetScope: damScope,
                                        sourceScopes: [], //TODO collect target scopes
                                    });
                                    inboxFolderIdForCopiedFiles = id;
                                }
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                formData.append("folderId", inboxFolderIdForCopiedFiles!);
                                //TODO attach other dam file data (altText, cropping, etc.)
                                const response: { data: { id: string } } = await blockContext.damConfig.apiClient.post(
                                    `/dam/files/upload`,
                                    formData,
                                    {
                                        // cancelToken, //TODO support cancel?
                                        headers: {
                                            "Content-Type": "multipart/form-data",
                                        },
                                    },
                                );
                                fileIdReplacements.push({ type: "DamFile", originalId: fileDependency.id, replaceWithId: response.data.id });
                            }
                        }
                    }
                }
            }

            if (fileIdsToCopyDirectly.length > 0) {
                if (!inboxFolderIdForCopiedFiles) {
                    const { id } = await createIncomingFolder({
                        client,
                        targetScope: damScope,
                        sourceScopes: [], //TODO collect target scopes
                    });
                    inboxFolderIdForCopiedFiles = id;
                }
                const { data: copiedFiles } = await client.mutate<GQLCopyFilesToScopeMutation, GQLCopyFilesToScopeMutationVariables>({
                    mutation: copyFilesToScopeMutation,
                    variables: { fileIds: fileIdsToCopyDirectly, targetFolderId: inboxFolderIdForCopiedFiles },
                    update: (cache, result) => {
                        if (result.data && result.data.copyFilesToScope.numberNewlyCopiedFiles > 0) {
                            cache.evict({ fieldName: "damItemsList" });
                        }
                    },
                });

                if (copiedFiles) {
                    for (const item of copiedFiles.copyFilesToScope.mappedFiles) {
                        fileIdReplacements.push({ type: "DamFile", originalId: item.rootFile.id, replaceWithId: item.copy.id });
                    }
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

    /*
    TODO if nothing was copied/uploaded delete incoming folder again
    */

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
