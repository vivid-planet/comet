import { ApolloClient, gql } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { ReplaceDependencyObject } from "@comet/blocks-admin";
import isEqual from "lodash.isequal";
import { v4 as uuid } from "uuid";

import { CmsBlockContext } from "../../../blocks/CmsBlockContextProvider";
import { ContentScopeInterface } from "../../../contentScope/Provider";
import { DocumentInterface, GQLDocument, GQLUpdatePageMutationVariables } from "../../../documents/types";
import { GQLDamFile } from "../../../graphql.generated";
import { PageTreeContext } from "../PageTreeContext";
import { arrayToTreeMap } from "../treemap/TreeMapUtils";
import { PageClipboard, PagesClipboard } from "../useCopyPastePages";
import { createInboxFolder } from "./createInboxFolder";
import {
    GQLCopyFilesToScopeMutation,
    GQLCopyFilesToScopeMutationVariables,
    GQLCreatePageNodeMutation,
    GQLCreatePageNodeMutationVariables,
    GQLDownloadDamFileMutation,
    GQLDownloadDamFileMutationVariables,
    GQLFindCopiesOfFileInScopeQuery,
    GQLFindCopiesOfFileInScopeQueryVariables,
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
    mutation CopyFilesToScope($fileIds: [ID!]!, $inboxFolderId: ID!) {
        copyFilesToScope(fileIds: $fileIds, inboxFolderId: $inboxFolderId) {
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
 *      0. traverses the tree with top-down strategy and find all source scopes of file dependencies
 *      1. traverses the tree with top-down strategy and do the actual creating of documents and page tree nodes
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
    const dependencyReplacements = createPageTreeNodeIdReplacements(pages);
    let inboxFolderIdForCopiedFiles: string | undefined = undefined;
    const hasDamScope = Object.entries(damScope).length > 0;

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
                    id: dependencyReplacements.find((replacement) => replacement.type == "PageTreeNode" && replacement.originalId === node.id)
                        ?.replaceWithId,
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
        const fileIdsToCopyDirectly: string[] = [];
        if (node?.document != null) {
            for (const damFile of fileDependenciesFromDocument(documentType, node.document)) {
                if (dependencyReplacements.some((replacement) => replacement.type == "DamFile" && replacement.originalId === damFile.id)) {
                    //already copied
                } else if (damFile.fileUrl.startsWith(blockContext.damConfig.apiUrl)) {
                    //our own api, no need to download&upload
                    if (!hasDamScope || isEqual(damFile.scope, damScope)) {
                        //same scope, same server, no need to copy
                    } else {
                        //batch copy below
                        fileIdsToCopyDirectly.push(damFile.id);
                    }
                } else {
                    if (!inboxFolderIdForCopiedFiles) throw new Error("inbox folder must be created in step 0 when files need to be copied");
                    if (damFile.fileUrl.match(/^https?:\/\/(localhost|.*\.dev\.vivid-planet\.cloud|192\.168\.\d{1,3}\.\d{1,3}):\d{2,4}/)) {
                        //source is local dev server, download client side and upload
                        const fileResponse = await fetch(damFile.fileUrl);
                        const fileBlob = await fileResponse.blob();
                        const file = new File([fileBlob], damFile.name, { type: damFile.mimetype });
                        const formData = new FormData();
                        formData.append("file", file);
                        if (hasDamScope) formData.append("scope", JSON.stringify(damScope));
                        formData.append("folderId", inboxFolderIdForCopiedFiles);
                        if (damFile.title) formData.append("title", damFile.title);
                        if (damFile.altText) formData.append("altText", damFile.altText);
                        if (damFile.license) formData.append("license", JSON.stringify(damFile.license));
                        if (damFile.image?.cropArea) formData.append("imageCropArea", JSON.stringify(damFile.image.cropArea));

                        const response: { data: { id: string } } = await blockContext.damConfig.apiClient.post(`/dam/files/upload`, formData, {
                            // cancelToken, //TODO support cancel?
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });
                        dependencyReplacements.push({ type: "DamFile", originalId: damFile.id, replaceWithId: response.data.id });
                    } else {
                        //remote source, download server side
                        const { data } = await client.mutate<GQLDownloadDamFileMutation, GQLDownloadDamFileMutationVariables>({
                            mutation: gql`
                                mutation DownloadDamFile($url: String!, $scope: DamScopeInput!, $input: UpdateDamFileInput!) {
                                    importDamFileByDownload(url: $url, scope: $scope, input: $input) {
                                        id
                                    }
                                }
                            `,
                            variables: {
                                url: damFile.fileUrl,
                                scope: damScope,
                                input: {
                                    name: damFile.name,
                                    folderId: inboxFolderIdForCopiedFiles,
                                    title: damFile.title,
                                    altText: damFile.altText,
                                    license: damFile.license,
                                    image: damFile.image ? { cropArea: damFile.image.cropArea } : undefined,
                                },
                            },
                        });
                        if (!data?.importDamFileByDownload.id) {
                            throw Error("Did not receive new id for imported dam file");
                        }
                        dependencyReplacements.push({ type: "DamFile", originalId: damFile.id, replaceWithId: data.importDamFileByDownload.id });
                    }
                }
            }

            if (fileIdsToCopyDirectly.length > 0) {
                if (!inboxFolderIdForCopiedFiles) throw new Error("inbox folder must be created in step 0 when files need to be copied");
                const { data: copiedFiles } = await client.mutate<GQLCopyFilesToScopeMutation, GQLCopyFilesToScopeMutationVariables>({
                    mutation: copyFilesToScopeMutation,
                    variables: { fileIds: fileIdsToCopyDirectly, inboxFolderId: inboxFolderIdForCopiedFiles },
                    update: (cache, result) => {
                        cache.evict({ fieldName: "damItemsList" });
                    },
                });

                if (copiedFiles) {
                    for (const item of copiedFiles.copyFilesToScope.mappedFiles) {
                        dependencyReplacements.push({ type: "DamFile", originalId: item.rootFile.id, replaceWithId: item.copy.id });
                    }
                }
            }
        }

        // 1d. Create new document
        const newDocumentId = uuid();
        if (node?.document != null && documentType.updateMutation && documentType.inputToOutput && documentType.replaceDependenciesInOutput) {
            await client.mutate<unknown, GQLUpdatePageMutationVariables>({
                mutation: documentType.updateMutation,
                variables: {
                    pageId: newDocumentId,
                    input: documentType.replaceDependenciesInOutput(documentType.inputToOutput(node.document), dependencyReplacements),
                    attachedPageTreeNodeId: data.createPageTreeNode.id,
                },
                context: LocalErrorScopeApolloContext,
            });
        }

        return data.createPageTreeNode.id;
    };

    // 0. traverses the tree with top-down strategy and find all source scopes of file dependencies
    {
        const sourceScopes: Record<string, unknown>[] = [];
        const traverse = async (parentId: string): Promise<void> => {
            const nodes = tree.get(parentId) || [];
            for (const node of nodes) {
                const documentType = documentTypes[node.documentType];
                if (!documentType) {
                    throw new Error(`Unknown document type "${documentType}"`);
                }
                if (node?.document != null) {
                    for (const damFile of fileDependenciesFromDocument(documentType, node.document)) {
                        //TODO use damFile.size; to build a progress bar for uploading/downloading files
                        if (dependencyReplacements.some((replacement) => replacement.type == "DamFile" && replacement.originalId === damFile.id)) {
                            //file already handled (same file used multiple times on page)
                        } else if (damFile.fileUrl.startsWith(blockContext.damConfig.apiUrl) && (!hasDamScope || isEqual(damFile.scope, damScope))) {
                            //same scope, same server, no need to copy
                        } else {
                            // TODO eventually handle multiple files in one request for better performance
                            const { data } = await client.query<GQLFindCopiesOfFileInScopeQuery, GQLFindCopiesOfFileInScopeQueryVariables>({
                                query: gql`
                                    query FindCopiesOfFileInScope($id: ID!, $scope: DamScopeInput!, $imageCropArea: ImageCropAreaInput) {
                                        findCopiesOfFileInScope(id: $id, scope: $scope, imageCropArea: $imageCropArea) {
                                            id
                                        }
                                    }
                                `,
                                variables: {
                                    id: damFile.id,
                                    scope: damScope,
                                    imageCropArea: damFile.image?.cropArea,
                                },
                            });
                            if (data.findCopiesOfFileInScope.length > 0) {
                                // use already existing file
                                dependencyReplacements.push({
                                    type: "DamFile",
                                    originalId: damFile.id,
                                    replaceWithId: data.findCopiesOfFileInScope[0].id,
                                });
                            } else {
                                // copying is required
                                if (damFile.scope && !sourceScopes.some((scope) => isEqual(scope, damFile.scope))) {
                                    sourceScopes.push(damFile.scope);
                                }
                            }
                        }
                    }
                }
                await traverse(node.id);
            }
        };
        await traverse("root");

        if (sourceScopes.length > 0) {
            const { id } = await createInboxFolder({
                client,
                targetScope: damScope,
                sourceScopes,
            });
            inboxFolderIdForCopiedFiles = id;
        }
    }

    // 1. traverses the tree with top-down strategy and do the actual creating of documents and page tree nodes
    {
        const traverse = async (parentId: string, newParentId: string | null): Promise<void> => {
            const nodes = tree.get(parentId) || [];
            let posOffset = 0;
            for (const node of nodes) {
                const newPageTreeUUID = await handlePageTreeNode(node, newParentId, posOffset++);

                await traverse(node.id, newPageTreeUUID);
            }
        };
        await traverse("root", parentId);
    }

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

function fileDependenciesFromDocument(documentType: DocumentInterface, document: GQLDocument) {
    return (
        documentType
            .dependencies(document)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((dependency) => dependency.targetGraphqlObjectType === "DamFile" && dependency.data && (dependency.data as any).damFile)
            .map((dependency) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return (dependency.data as any).damFile as GQLDamFile & { scope?: Record<string, unknown> };
            })
    );
}
