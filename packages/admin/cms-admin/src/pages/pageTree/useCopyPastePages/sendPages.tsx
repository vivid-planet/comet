import { ApolloClient, gql } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import { BlockDependency, ReplaceDependencyObject } from "@comet/blocks-admin";
import isEqual from "lodash.isequal";
import * as React from "react";
import { FormattedMessage } from "react-intl";
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

    updateProgress?: (progress: number, message: React.ReactNode) => void;
}

interface SendPagesDependencies {
    client: ApolloClient<unknown>;
    scope: ContentScopeInterface;
    documentTypes: PageTreeContext["documentTypes"];
    blockContext: CmsBlockContext;
    damScope: Record<string, unknown>;
    currentCategory: string;
}

/**
 * Iterates over passed pages synchronous and creates data with mutations
 *
 * Process:
 *      1. find all source scopes of file dependencies, to create an dam inbox folder if needed
 *      2. traverses the tree with top-down strategy and create page tree nodes
 *          2a. Generate unique slug by adding "{slug}-{uniqueNumber}" to the slug
 *          2b. Create new PageTreeNode with new name "{name} {uniqueNumber}" and new parent
 *      3. create documents (and copy files if required) and attach them to the page tree nodes
 *          3a. Copy all files used on page to target scope
 *          3b.  Replace unhandled dependencies with undefined (when copying to another scope)
 *          3c. Create new document and attach it to new page tree node
 *      4. Refetch Pages query
 *
 **/
export async function sendPages(
    parentId: string | null,
    { pages, scope: sourceContentScope }: PagesClipboard,
    options: SendPagesOptions,
    { client, scope: targetContentScope, documentTypes, blockContext, damScope: targetDamScope, currentCategory }: SendPagesDependencies,
    updateProgress: (progress: number, message: React.ReactNode) => void,
): Promise<void> {
    const dependencyReplacements = createPageTreeNodeIdReplacements(pages);
    let inboxFolderIdForCopiedFiles: string | undefined = undefined;
    const hasDamScope = Object.entries(targetDamScope).length > 0;

    // 1. find all source scopes of file dependencies, to create an dam inbox folder if needed
    updateProgress(0, <FormattedMessage id="comet.pages.paste.analyzingPages" defaultMessage="analyzing pages" />);
    {
        let progressPages = 0;
        const sourceScopes: Record<string, unknown>[] = [];
        for (const sourcePage of pages) {
            const documentType = documentTypes[sourcePage.documentType];
            if (!documentType) {
                throw new Error(`Unknown document type "${documentType}"`);
            }
            if (sourcePage?.document != null) {
                for (const damFile of fileDependenciesFromDocument(documentType, sourcePage.document)) {
                    //TODO use damFile.size; to build a progress bar for uploading/downloading files
                    if (dependencyReplacements.some((replacement) => replacement.type == "DamFile" && replacement.originalId === damFile.id)) {
                        //file already handled (same file used multiple times on page)
                    } else if (
                        damFile.fileUrl.startsWith(blockContext.damConfig.apiUrl) &&
                        (!hasDamScope || isEqual(damFile.scope, targetDamScope))
                    ) {
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
                                scope: targetDamScope,
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
            progressPages++;
            updateProgress(
                (progressPages / pages.length) * 10,
                <FormattedMessage id="comet.pages.paste.analyzingPages" defaultMessage="analyzing pages" />,
            ); // 10% of progress is used for analyzing pages
        }

        if (sourceScopes.length > 0) {
            const { id } = await createInboxFolder({
                client,
                targetScope: targetDamScope,
                sourceScopes,
            });
            inboxFolderIdForCopiedFiles = id;
        }
    }

    // 2. traverses the tree with top-down strategy and create page tree nodes
    updateProgress(10, <FormattedMessage id="comet.pages.paste.creatingPages" defaultMessage="creating pages" />);

    const handlePageTreeNode = async (node: PageClipboard, newParentId: string | null, posOffset: number): Promise<string> => {
        const documentType = documentTypes[node.documentType];
        if (!documentType) {
            throw new Error(`Unknown document type "${documentType}"`);
        }

        // 2a. Generate unique slug by adding "{slug}-{uniqueNumber}" to the slug
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
                    scope: targetContentScope,
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

        // 2b. Create new PageTreeNode with new name "{name} {uniqueNumber}" and new parent
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
                contentScope: targetContentScope,
                category: currentCategory,
            },
            context: LocalErrorScopeApolloContext,
        });
        if (!data?.createPageTreeNode.id) {
            throw Error("Did not receive new uuid for page tree node");
        }

        return data.createPageTreeNode.id;
    };
    {
        const tree = arrayToTreeMap<PageClipboard>(pages);
        let progressPages = 0;
        const traverse = async (parentId: string, newParentId: string | null): Promise<void> => {
            const nodes = tree.get(parentId) || [];
            let posOffset = 0;
            for (const node of nodes) {
                const newPageTreeUUID = await handlePageTreeNode(node, newParentId, posOffset++);

                progressPages++;
                updateProgress(
                    10 + (progressPages / pages.length) * 40,
                    <FormattedMessage id="comet.pages.paste.creatingPages" defaultMessage="creating pages" />,
                ); // next 40% of progress is used for creating pages
                await traverse(node.id, newPageTreeUUID);
            }
        };
        await traverse("root", parentId);
    }

    // 3. create documents (and copy files if required) and attach them to the page tree nodes
    // no top-down strategy needed
    {
        updateProgress(50, <FormattedMessage id="comet.pages.paste.creatingDocuments" defaultMessage="creating documents" />);
        let progressPages = 0;
        for (const sourcePage of pages) {
            const documentType = documentTypes[sourcePage.documentType];
            if (!documentType) {
                throw new Error(`Unknown document type "${documentType}"`);
            }
            const newPageTreeNodeId = dependencyReplacements.find(
                (replacement) => replacement.type == "PageTreeNode" && replacement.originalId === sourcePage.id,
            )?.replaceWithId;
            if (!newPageTreeNodeId) {
                throw new Error(`Could not find new page tree node id`);
            }

            // 3a. Copy all files used on page to target scope
            const fileIdsToCopyDirectly: string[] = [];
            if (sourcePage?.document != null) {
                for (const damFile of fileDependenciesFromDocument(documentType, sourcePage.document)) {
                    if (dependencyReplacements.some((replacement) => replacement.type == "DamFile" && replacement.originalId === damFile.id)) {
                        //already copied
                    } else if (damFile.fileUrl.startsWith(blockContext.damConfig.apiUrl)) {
                        //our own api, no need to download&upload
                        if (!hasDamScope || isEqual(damFile.scope, targetDamScope)) {
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
                            if (hasDamScope) formData.append("scope", JSON.stringify(targetDamScope));
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
                                    scope: targetDamScope,
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

            // 3b. Replace unhandled dependencies with undefined (when copying to another scope)
            if (sourcePage.document && !isEqual(sourceContentScope, targetContentScope)) {
                const unhandledDependencies = unhandledDependenciesFromDocument(documentType, sourcePage.document, {
                    existingReplacements: dependencyReplacements,
                });
                const replacementsForUnhandledDependencies = createUndefinedReplacementsForDependencies(unhandledDependencies);
                dependencyReplacements.push(...replacementsForUnhandledDependencies);
            }

            // 3c. Create new document and attach it to new page tree node
            const newDocumentId = uuid();
            if (
                sourcePage?.document != null &&
                documentType.updateMutation &&
                documentType.inputToOutput &&
                documentType.replaceDependenciesInOutput
            ) {
                await client.mutate<unknown, GQLUpdatePageMutationVariables>({
                    mutation: documentType.updateMutation,
                    variables: {
                        pageId: newDocumentId,
                        input: documentType.replaceDependenciesInOutput(documentType.inputToOutput(sourcePage.document), dependencyReplacements),
                        attachedPageTreeNodeId: newPageTreeNodeId,
                    },
                    context: LocalErrorScopeApolloContext,
                });
            }
            progressPages++;
            updateProgress(
                50 + (progressPages / pages.length) * 50,
                <FormattedMessage id="comet.pages.paste.creatingDocuments" defaultMessage="creating documents" />,
            ); // last 50% of progress is used for creating documents
        }
    }

    updateProgress(100, <FormattedMessage id="comet.pages.paste.reloadingPages" defaultMessage="reloading pages" />);

    // 4. Refetch Pages query
    await client.refetchQueries({ include: ["Pages"] });
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

function unhandledDependenciesFromDocument(
    documentType: DocumentInterface,
    document: GQLDocument,
    { existingReplacements }: { existingReplacements: ReplaceDependencyObject[] },
) {
    const unhandledDependencies = documentType
        .dependencies(document)
        .filter(
            (dependency) =>
                !existingReplacements.some(
                    (replacement) => replacement.originalId === dependency.id && replacement.type === dependency.targetGraphqlObjectType,
                ),
        );

    return unhandledDependencies;
}

function createUndefinedReplacementsForDependencies(dependencies: BlockDependency[]) {
    const existingReplacements = new Set();
    const replacements: ReplaceDependencyObject[] = [];

    for (const dependency of dependencies) {
        const key = `${dependency.targetGraphqlObjectType}#${dependency.id}`;

        if (!existingReplacements.has(key)) {
            replacements.push({ type: dependency.targetGraphqlObjectType, originalId: dependency.id, replaceWithId: undefined });
            existingReplacements.add(key);
        }
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
