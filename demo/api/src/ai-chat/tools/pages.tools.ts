import { getSearchTextFromBlock, PageTreeNodeVisibility, type PageTreeService } from "@comet/cms-api";
import { type EntityManager } from "@mikro-orm/postgresql";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";
import { SeoBlock } from "@src/documents/pages/blocks/seo.block";
import { StageBlock } from "@src/documents/pages/blocks/stage.block";
import { Page } from "@src/documents/pages/entities/page.entity";
import { validate, type ValidationError } from "class-validator";
import { readFile } from "fs/promises";
import { join } from "path";

import { blockMetaToTypeScript } from "./block-meta-to-typescript";
import { type AiChatTool } from "./tool.interface";

type Input = Record<string, unknown>;

function formatValidationErrors(errors: ValidationError[], prefix = ""): string[] {
    return errors.flatMap((e) => {
        const path = prefix ? `${prefix}.${e.property}` : e.property;
        const messages = Object.values(e.constraints ?? {}).map((msg) => `${path}: ${msg}`);
        const childMessages = e.children ? formatValidationErrors(e.children, path) : [];
        return [...messages, ...childMessages];
    });
}

function createBlockInputs(i: Input) {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: PageContentBlock.blockInputFactory(i.content as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        seo: SeoBlock.blockInputFactory(i.seo as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stage: StageBlock.blockInputFactory(i.stage as any),
    };
}

async function validatePageBlocks(i: Input): Promise<string[] | null> {
    console.log("validatePageBlocks", i);
    const blocks = createBlockInputs(i);
    const errors = (await Promise.all([validate(blocks.content), validate(blocks.seo), validate(blocks.stage)])).flat();
    return errors.length > 0 ? formatValidationErrors(errors) : null;
}

let blockTypesCache: string | null = null;

const PAGE_BLOCK_INPUT_SCHEMA = {
    type: "object" as const,
    properties: {
        pageId: { type: "string", description: "The Page document UUID. For a new page, generate a UUID." },
        content: { type: "object", description: "Main page content block data, must match PageContentBlockInputData from get_block_input_types" },
        seo: { type: "object", description: "SEO block data, must match SeoBlockInputData from get_block_input_types" },
        stage: { type: "object", description: "Stage/hero block data, must match StageBlockInputData from get_block_input_types" },
        attachedPageTreeNodeId: { type: "string", description: "Page tree node UUID this page belongs to." },
    },
    required: ["pageId", "content", "seo", "stage"],
};

export function createPagesTools(pageTreeService: PageTreeService, em: EntityManager): AiChatTool[] {
    return [
        {
            definition: {
                name: "get_page",
                description:
                    "Read the content of a CMS Page document by its ID. Returns extracted text and raw block data. To find the document ID for a page tree node, call get_page_tree_node and use the returned documentId.",
                input_schema: {
                    type: "object",
                    properties: {
                        pageId: { type: "string", description: "The Page document UUID (not the page tree node ID)." },
                    },
                    required: ["pageId"],
                },
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const page = await em.findOne(Page, { id: i.pageId as string });
                if (!page) return JSON.stringify({ error: "Page not found." });
                const textContent = [...getSearchTextFromBlock(page.stage), ...getSearchTextFromBlock(page.content)];
                return JSON.stringify({
                    id: page.id,
                    updatedAt: page.updatedAt,
                    textContent,
                    content: page.content,
                    seo: page.seo,
                    stage: page.stage,
                });
            },
        },
        {
            definition: {
                name: "validate_save_page",
                description:
                    "Validate page block data without saving. Always call this before save_page to catch schema and constraint errors early. Returns a list of validation errors, or success if the data is valid.",
                input_schema: PAGE_BLOCK_INPUT_SCHEMA,
            },
            execute: async (input: unknown) => {
                const errors = await validatePageBlocks(input as Input);
                if (errors) {
                    return JSON.stringify({ valid: false, errors });
                }
                return JSON.stringify({ valid: true });
            },
        },
        {
            definition: {
                name: "save_page",
                description:
                    "Create or update a CMS Page document. Always call validate_save_page first with the same arguments — do not call save_page if validation fails. attachedPageTreeNodeId must be provided on every call.",
                input_schema: PAGE_BLOCK_INPUT_SCHEMA,
            },
            execute: async (input: unknown) => {
                const i = input as Input;
                const pageId = i.pageId as string;
                const attachedPageTreeNodeId = i.attachedPageTreeNodeId as string | undefined;

                if (attachedPageTreeNodeId) {
                    const node = await pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(attachedPageTreeNodeId);
                    if (node.visibility === PageTreeNodeVisibility.Archived) {
                        return JSON.stringify({ error: "Archived pages cannot be updated." });
                    }
                }

                const validationErrors = await validatePageBlocks(i);
                if (validationErrors) {
                    return JSON.stringify({ error: "Validation failed", details: validationErrors });
                }

                const blocks = createBlockInputs(i);

                let page = await em.findOne(Page, { id: pageId });
                if (page) {
                    page.assign({
                        content: blocks.content.transformToBlockData(),
                        seo: blocks.seo.transformToBlockData(),
                        stage: blocks.stage.transformToBlockData(),
                    });
                } else {
                    page = em.create(Page, {
                        id: pageId,
                        content: blocks.content.transformToBlockData(),
                        seo: blocks.seo.transformToBlockData(),
                        stage: blocks.stage.transformToBlockData(),
                    });
                    em.persist(page);
                }

                if (attachedPageTreeNodeId) {
                    await pageTreeService.attachDocument({ id: pageId, type: "Page" }, attachedPageTreeNodeId);
                }

                await em.flush();
                return JSON.stringify({ success: true, id: page.id, updatedAt: page.updatedAt });
            },
        },
        {
            definition: {
                name: "get_block_input_types",
                description: "Get TypeScript interfaces describing the shape of all CMS content blocks needed as input to eg save_page tool.",
                input_schema: {
                    type: "object",
                    properties: {},
                },
            },
            execute: async () => {
                if (!blockTypesCache) {
                    const raw = await readFile(join(process.cwd(), "block-meta.json"), "utf-8");
                    blockTypesCache = blockMetaToTypeScript(JSON.parse(raw));
                }
                return blockTypesCache;
            },
        },
        /*
        {
            definition: {
                name: "get_block_meta",
                description:
                    "Get full block schema metadata — field definitions, types, enums, and nesting for all CMS content blocks. Use get_block_types instead unless you need enum values or detailed field metadata. Note: large document (~3000 lines).",
                input_schema: {
                    type: "object",
                    properties: {},
                },
            },
            execute: async () => {
                return readFile(join(process.cwd(), "block-meta.json"), "utf-8");
            },
        },
        */
    ];
}
