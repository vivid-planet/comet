import { type PageTreeNodeInterface, type PageTreeNodeVisibility, type PageTreeService } from "@comet/cms-api";
import { type PageTreeNodeCreateInput, type PageTreeNodeUpdateInput } from "@src/page-tree/dto/page-tree-node.input";
import { type PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { tool } from "ai";
import { z } from "zod";

import { type AiChatTools } from "./tool.interface";

async function serializeNode(node: PageTreeNodeInterface, readApi: { nodePath: (node: PageTreeNodeInterface) => Promise<string> }) {
    return {
        id: node.id,
        name: node.name,
        slug: node.slug,
        path: await readApi.nodePath(node),
        visibility: node.visibility,
        documentType: node.documentType,
        parentId: node.parentId ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: (node as any).category ?? null,
        hideInMenu: node.hideInMenu,
    };
}

export function createPageTreeTools(pageTreeService: PageTreeService): AiChatTools {
    const readApi = pageTreeService.createReadApi({ visibility: "all" });

    return {
        list_page_tree_nodes: tool({
            description: "List all CMS page tree nodes with their path and metadata.",
            inputSchema: z.object({
                domain: z.string().optional().describe("Filter by domain (e.g. 'main'). Omit to include all domains."),
                language: z.string().optional().describe("Filter by language code (e.g. 'en'). Omit to include all languages."),
                category: z.string().optional().describe("Filter by navigation category (e.g. 'mainNavigation', 'topMenu')."),
                documentType: z.string().optional().describe("Filter by document type (e.g. 'Page', 'Link')."),
            }),
            execute: async (input) => {
                const scope = input.domain && input.language ? { domain: input.domain, language: input.language } : undefined;
                const nodes = await readApi.getNodes({
                    ...(scope ? { scope } : {}),
                    ...(input.category ? { category: input.category as PageTreeNodeCategory } : {}),
                    ...(input.documentType ? { documentType: input.documentType } : {}),
                });
                return JSON.stringify(await Promise.all(nodes.map((n) => serializeNode(n, readApi))));
            },
        }),
        get_page_tree_node: tool({
            description: "Get a single page tree node by ID, including child node IDs and the attached document ID.",
            inputSchema: z.object({
                id: z.string().describe("The page tree node UUID."),
            }),
            execute: async (input) => {
                const node = await readApi.getNodeOrFail(input.id);
                const [children, attachedDoc] = await Promise.all([
                    readApi.getChildNodes(node),
                    pageTreeService.getActiveAttachedDocument(node.id, node.documentType),
                ]);
                return JSON.stringify({
                    ...(await serializeNode(node, readApi)),
                    childNodeIds: children.map((c) => c.id),
                    documentId: attachedDoc?.documentId ?? null,
                });
            },
        }),
        get_page_tree_node_by_path: tool({
            description: "Find a page tree node by its full URL path.",
            inputSchema: z.object({
                path: z.string().describe("Full URL path (e.g. '/en/about', '/de/products/widget')."),
                domain: z.string().optional().describe("Site domain (e.g. 'main')."),
                language: z.string().optional().describe("Language code (e.g. 'en')."),
            }),
            execute: async (input) => {
                const scope = input.domain && input.language ? { domain: input.domain, language: input.language } : undefined;
                const node = await readApi.getNodeByPath(input.path, scope ? { scope } : undefined);
                if (!node) return JSON.stringify({ error: "No page tree node found at that path." });
                const attachedDoc = await pageTreeService.getActiveAttachedDocument(node.id, node.documentType);
                return JSON.stringify({
                    ...(await serializeNode(node, readApi)),
                    documentId: attachedDoc?.documentId ?? null,
                });
            },
        }),
        create_page_tree_node: tool({
            description:
                "Create a new CMS page tree node (navigation entry). For nodes with documentType='Page', call save_page afterwards with the returned node ID to create and attach page content.",
            inputSchema: z.object({
                name: z.string().describe("Display name."),
                slug: z.string().describe("URL slug (lowercase letters, digits, and hyphens only)."),
                domain: z.string().describe("Site domain (e.g. 'main')."),
                language: z.string().describe("Language code (e.g. 'en')."),
                documentType: z.string().optional().describe("Document type ('Page', 'Link', etc.). Default: 'Page'."),
                parentId: z.string().optional().describe("Parent node UUID for nested pages. Omit for root."),
                category: z.string().optional().describe("Navigation category ('mainNavigation', 'topMenu'). Default: 'mainNavigation'."),
                hideInMenu: z.boolean().optional().describe("Whether to hide in navigation menus."),
            }),
            execute: async (input) => {
                const createInput = {
                    name: input.name,
                    slug: input.slug,
                    attachedDocument: { type: input.documentType ?? "Page" },
                    parentId: input.parentId,
                    hideInMenu: input.hideInMenu ?? false,
                    userGroup: "all",
                } as unknown as PageTreeNodeCreateInput;
                const scope = { domain: input.domain, language: input.language };
                const category = (input.category ?? "mainNavigation") as PageTreeNodeCategory;
                const node = await pageTreeService.createNode(createInput, category, scope);
                return JSON.stringify(await serializeNode(node, readApi));
            },
        }),
        update_page_tree_node: tool({
            description: "Update the name, slug, or menu visibility of a page tree node.",
            inputSchema: z.object({
                id: z.string().describe("The page tree node UUID."),
                name: z.string().describe("New display name."),
                slug: z.string().describe("New URL slug."),
                hideInMenu: z.boolean().optional().describe("Whether to hide in navigation menus."),
                createAutomaticRedirectsOnSlugChange: z
                    .boolean()
                    .optional()
                    .describe("Create redirects for old URLs when slug changes. Default: true."),
            }),
            execute: async (input) => {
                const updateInput = {
                    name: input.name,
                    slug: input.slug,
                    hideInMenu: input.hideInMenu,
                    createAutomaticRedirectsOnSlugChange: input.createAutomaticRedirectsOnSlugChange ?? true,
                } as unknown as PageTreeNodeUpdateInput;
                const node = await pageTreeService.updateNode(input.id, updateInput);
                return JSON.stringify(await serializeNode(node, readApi));
            },
        }),
        delete_page_tree_node: tool({
            description:
                "Permanently delete a page tree node, its children, and all attached documents. IRREVERSIBLE. The node must have visibility 'Archived' before deletion.",
            inputSchema: z.object({
                id: z.string().describe("The page tree node UUID to delete."),
            }),
            execute: async (input) => {
                const node = await readApi.getNodeOrFail(input.id);
                const success = await pageTreeService.delete(node);
                return JSON.stringify({ success });
            },
        }),
        update_page_tree_node_visibility: tool({
            description:
                "Change the visibility of a page tree node. Published = publicly visible. Unpublished = hidden from public but editable. Archived = soft-deleted (required before deletion).",
            inputSchema: z.object({
                id: z.string().describe("The page tree node UUID."),
                visibility: z.enum(["Published", "Unpublished", "Archived"]).describe("New visibility state."),
            }),
            execute: async (input) => {
                await pageTreeService.updateNodeVisibility(input.id, input.visibility as PageTreeNodeVisibility);
                return JSON.stringify({ success: true });
            },
        }),
        check_slug_availability: tool({
            description: "Check whether a URL slug is available at a given position in the page tree.",
            inputSchema: z.object({
                slug: z.string().describe("The URL slug to check (e.g. 'about-us')."),
                domain: z.string().describe("Site domain."),
                language: z.string().describe("Language code."),
                parentId: z.string().optional().describe("Parent node UUID. Omit for root level."),
            }),
            execute: async (input) => {
                const scope = { domain: input.domain, language: input.language };
                const path = await pageTreeService.pathForParentAndSlug(input.parentId ?? null, input.slug);
                const existingNode = await pageTreeService.nodeWithSamePath(path, scope);
                return JSON.stringify({
                    slug: input.slug,
                    path,
                    available: !existingNode,
                    ...(existingNode ? { conflictingNodeId: existingNode.id } : {}),
                });
            },
        }),
    };
}
