import { type PageTreeNodeInterface, type PageTreeNodeVisibility, type PageTreeService } from "@comet/cms-api";
import { type PageTreeNodeCreateInput, type PageTreeNodeUpdateInput } from "@src/page-tree/dto/page-tree-node.input";
import { type PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";

import { type AiChatTool } from "./tool.interface";

type Input = Record<string, unknown>;

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

export function createPageTreeTools(pageTreeService: PageTreeService): AiChatTool[] {
    const readApi = pageTreeService.createReadApi({ visibility: "all" });

    return [
        {
            definition: {
                name: "list_page_tree_nodes",
                description: "List all CMS page tree nodes with their path and metadata.",
                input_schema: {
                    type: "object",
                    properties: {
                        domain: { type: "string", description: "Filter by domain (e.g. 'main'). Omit to include all domains." },
                        language: { type: "string", description: "Filter by language code (e.g. 'en'). Omit to include all languages." },
                        category: { type: "string", description: "Filter by navigation category (e.g. 'mainNavigation', 'topMenu')." },
                        documentType: { type: "string", description: "Filter by document type (e.g. 'Page', 'Link')." },
                    },
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const scope = i.domain && i.language ? { domain: i.domain as string, language: i.language as string } : undefined;
                const nodes = await readApi.getNodes({
                    ...(scope ? { scope } : {}),
                    ...(i.category ? { category: i.category as PageTreeNodeCategory } : {}),
                    ...(i.documentType ? { documentType: i.documentType as string } : {}),
                });
                return JSON.stringify(await Promise.all(nodes.map((n) => serializeNode(n, readApi))));
            },
        },
        {
            definition: {
                name: "get_page_tree_node",
                description: "Get a single page tree node by ID, including child node IDs and the attached document ID.",
                input_schema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The page tree node UUID." },
                    },
                    required: ["id"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const node = await readApi.getNodeOrFail(i.id as string);
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
        },
        {
            definition: {
                name: "get_page_tree_node_by_path",
                description: "Find a page tree node by its full URL path.",
                input_schema: {
                    type: "object",
                    properties: {
                        path: { type: "string", description: "Full URL path (e.g. '/en/about', '/de/products/widget')." },
                        domain: { type: "string", description: "Site domain (e.g. 'main')." },
                        language: { type: "string", description: "Language code (e.g. 'en')." },
                    },
                    required: ["path"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const scope = i.domain && i.language ? { domain: i.domain as string, language: i.language as string } : undefined;
                const node = await readApi.getNodeByPath(i.path as string, scope ? { scope } : undefined);
                if (!node) return JSON.stringify({ error: "No page tree node found at that path." });
                const attachedDoc = await pageTreeService.getActiveAttachedDocument(node.id, node.documentType);
                return JSON.stringify({
                    ...(await serializeNode(node, readApi)),
                    documentId: attachedDoc?.documentId ?? null,
                });
            },
        },
        {
            definition: {
                name: "create_page_tree_node",
                description:
                    "Create a new CMS page tree node (navigation entry). For nodes with documentType='Page', call save_page afterwards with the returned node ID to create and attach page content.",
                input_schema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Display name." },
                        slug: { type: "string", description: "URL slug (lowercase letters, digits, and hyphens only)." },
                        domain: { type: "string", description: "Site domain (e.g. 'main')." },
                        language: { type: "string", description: "Language code (e.g. 'en')." },
                        documentType: { type: "string", description: "Document type ('Page', 'Link', etc.). Default: 'Page'." },
                        parentId: { type: "string", description: "Parent node UUID for nested pages. Omit for root." },
                        category: { type: "string", description: "Navigation category ('mainNavigation', 'topMenu'). Default: 'mainNavigation'." },
                        hideInMenu: { type: "boolean", description: "Whether to hide in navigation menus." },
                    },
                    required: ["name", "slug", "domain", "language"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const createInput = {
                    name: i.name as string,
                    slug: i.slug as string,
                    attachedDocument: { type: (i.documentType as string) ?? "Page" },
                    parentId: i.parentId as string | undefined,
                    hideInMenu: (i.hideInMenu as boolean) ?? false,
                    userGroup: "all",
                } as unknown as PageTreeNodeCreateInput;
                const scope = { domain: i.domain as string, language: i.language as string };
                const category = ((i.category as string) ?? "mainNavigation") as PageTreeNodeCategory;
                const node = await pageTreeService.createNode(createInput, category, scope);
                return JSON.stringify(await serializeNode(node, readApi));
            },
        },
        {
            definition: {
                name: "update_page_tree_node",
                description: "Update the name, slug, or menu visibility of a page tree node.",
                input_schema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The page tree node UUID." },
                        name: { type: "string", description: "New display name." },
                        slug: { type: "string", description: "New URL slug." },
                        hideInMenu: { type: "boolean", description: "Whether to hide in navigation menus." },
                        createAutomaticRedirectsOnSlugChange: {
                            type: "boolean",
                            description: "Create redirects for old URLs when slug changes. Default: true.",
                        },
                    },
                    required: ["id", "name", "slug"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const updateInput = {
                    name: i.name as string,
                    slug: i.slug as string,
                    hideInMenu: i.hideInMenu as boolean | undefined,
                    createAutomaticRedirectsOnSlugChange: (i.createAutomaticRedirectsOnSlugChange as boolean) ?? true,
                } as unknown as PageTreeNodeUpdateInput;
                const node = await pageTreeService.updateNode(i.id as string, updateInput);
                return JSON.stringify(await serializeNode(node, readApi));
            },
        },
        {
            definition: {
                name: "delete_page_tree_node",
                description:
                    "Permanently delete a page tree node, its children, and all attached documents. IRREVERSIBLE. The node must have visibility 'Archived' before deletion.",
                input_schema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The page tree node UUID to delete." },
                    },
                    required: ["id"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const node = await readApi.getNodeOrFail(i.id as string);
                const success = await pageTreeService.delete(node);
                return JSON.stringify({ success });
            },
        },
        {
            definition: {
                name: "update_page_tree_node_visibility",
                description:
                    "Change the visibility of a page tree node. Published = publicly visible. Unpublished = hidden from public but editable. Archived = soft-deleted (required before deletion).",
                input_schema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "The page tree node UUID." },
                        visibility: {
                            type: "string",
                            enum: ["Published", "Unpublished", "Archived"],
                            description: "New visibility state.",
                        },
                    },
                    required: ["id", "visibility"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                await pageTreeService.updateNodeVisibility(i.id as string, i.visibility as PageTreeNodeVisibility);
                return JSON.stringify({ success: true });
            },
        },
        {
            definition: {
                name: "check_slug_availability",
                description: "Check whether a URL slug is available at a given position in the page tree.",
                input_schema: {
                    type: "object",
                    properties: {
                        slug: { type: "string", description: "The URL slug to check (e.g. 'about-us')." },
                        domain: { type: "string", description: "Site domain." },
                        language: { type: "string", description: "Language code." },
                        parentId: { type: "string", description: "Parent node UUID. Omit for root level." },
                    },
                    required: ["slug", "domain", "language"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const scope = { domain: i.domain as string, language: i.language as string };
                const path = await pageTreeService.pathForParentAndSlug((i.parentId as string) ?? null, i.slug as string);
                const existingNode = await pageTreeService.nodeWithSamePath(path, scope);
                return JSON.stringify({
                    slug: i.slug,
                    path,
                    available: !existingNode,
                    ...(existingNode ? { conflictingNodeId: existingNode.id } : {}),
                });
            },
        },
    ];
}
