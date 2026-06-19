import { type ApolloClient, gql } from "@apollo/client";
import { LocalErrorScopeApolloContext } from "@comet/admin";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { v4 as uuid } from "uuid";

import type { ReplaceDependencyObject } from "../../../blocks/types";
import type { ContentScope } from "../../../contentScope/Provider";
import { resolveScopeCopyReplacements } from "../../../dependencies/scopeCopy/resolveScopeCopyReplacements";
import type { ScopeCopyHandler } from "../../../dependencies/scopeCopy/ScopeCopyHandler";
import type { GQLUpdatePageMutationVariables } from "../../../documents/types";
import type { PageTreeConfig } from "../../pageTreeConfig";
import { findAvailableSlug } from "../findAvailableSlug";
import { arrayToTreeMap } from "../treemap/TreeMapUtils";
import type { PageClipboard, PagesClipboard } from "../useCopyPastePages";
import type { GQLCreatePageNodeMutation, GQLCreatePageNodeMutationVariables } from "./sendPages.generated";

const createPageNodeMutation = gql`
    mutation CreatePageNode($input: PageTreeNodeCreateInput!, $contentScope: PageTreeNodeScopeInput!, $category: String!) {
        createPageTreeNode(input: $input, scope: $contentScope, category: $category) {
            id
        }
    }
`;

export interface SendPagesOptions {
    /**
     * The position where the new page(s) should be pasted.
     * If undefined, the page(s) are added at the very end
     * */
    targetPos?: number;

    updateProgress?: (progress: number, message: ReactNode) => void;
}

interface SendPagesDependencies {
    client: ApolloClient<object>;
    scope: ContentScope;
    documentTypes: PageTreeConfig["documentTypes"];
    currentCategory: string;
    handlers: ScopeCopyHandler[];
}

/**
 * Iterates over passed pages synchronous and creates data with mutations
 *
 * Process:
 *      1. traverses the tree with top-down strategy and create page tree nodes
 *          1a. Generate unique slug by adding "{slug}-{uniqueNumber}" to the slug
 *          1b. Create new PageTreeNode with new name "{name} {uniqueNumber}" and new parent
 *      2. resolve dependency replacements (copy referenced entities to the target scope if required)
 *      3. create documents (with replaced dependencies) and attach them to the page tree nodes
 *      4. Refetch Pages query
 *
 **/
export async function sendPages(
    parentId: string | null,
    { pages, scope: sourceContentScope }: PagesClipboard,
    options: SendPagesOptions,
    { client, scope: targetContentScope, documentTypes, currentCategory, handlers }: SendPagesDependencies,
    updateProgress: (progress: number, message: ReactNode) => void,
): Promise<void> {
    const pageTreeNodeIdReplacements = createPageTreeNodeIdReplacements(pages);

    // 1. traverses the tree with top-down strategy and create page tree nodes
    updateProgress(0, <FormattedMessage id="comet.pages.paste.creatingPages" defaultMessage="creating pages" />);

    const handlePageTreeNode = async (node: PageClipboard, newParentId: string | null, posOffset: number): Promise<string> => {
        const documentType = documentTypes[node.documentType];
        if (!documentType) {
            throw new Error(`Unknown document type "${documentType}"`);
        }

        // 1a. Generate unique slug by adding "{slug}-{uniqueNumber}" to the slug
        const { slug, name } = await findAvailableSlug(client, {
            slug: node.slug,
            name: node.name,
            parentId: newParentId,
            scope: targetContentScope,
        });

        // 1b. Create new PageTreeNode with new name "{name} {uniqueNumber}" and new parent
        const { data } = await client.mutate<GQLCreatePageNodeMutation, GQLCreatePageNodeMutationVariables>({
            mutation: createPageNodeMutation,
            variables: {
                input: {
                    id: pageTreeNodeIdReplacements.find((replacement) => replacement.type == "PageTreeNode" && replacement.originalId === node.id)
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
                    (progressPages / pages.length) * 40,
                    <FormattedMessage id="comet.pages.paste.creatingPages" defaultMessage="creating pages" />,
                ); // first 40% of progress is used for creating pages
                await traverse(node.id, newPageTreeUUID);
            }
        };
        await traverse("root", parentId);
    }

    // 2. resolve dependency replacements (copy referenced entities to the target scope if required)
    updateProgress(40, <FormattedMessage id="comet.pages.paste.copyingDependencies" defaultMessage="copying dependencies" />);
    const dependencies = pages.flatMap((sourcePage) => {
        const documentType = documentTypes[sourcePage.documentType];
        if (!documentType) {
            throw new Error(`Unknown document type "${documentType}"`);
        }
        return sourcePage.document != null ? documentType.dependencies(sourcePage.document) : [];
    });

    const dependencyReplacements: ReplaceDependencyObject[] = [
        ...pageTreeNodeIdReplacements,
        ...(await resolveScopeCopyReplacements({
            dependencies,
            handlers,
            context: { client, sourceScope: sourceContentScope, targetScope: targetContentScope },
            existingReplacements: pageTreeNodeIdReplacements,
        })),
    ];

    // 3. create documents (with replaced dependencies) and attach them to the page tree nodes
    {
        updateProgress(50, <FormattedMessage id="comet.pages.paste.creatingDocuments" defaultMessage="creating documents" />);
        let progressPages = 0;
        for (const sourcePage of pages) {
            const documentType = documentTypes[sourcePage.documentType];
            if (!documentType) {
                throw new Error(`Unknown document type "${documentType}"`);
            }
            const newPageTreeNodeId = pageTreeNodeIdReplacements.find(
                (replacement) => replacement.type == "PageTreeNode" && replacement.originalId === sourcePage.id,
            )?.replaceWithId;
            if (!newPageTreeNodeId) {
                throw new Error(`Could not find new page tree node id`);
            }

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
