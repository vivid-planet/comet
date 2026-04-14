import { getSearchTextFromBlock, PageTreeNodeVisibility, type PageTreeService } from "@comet/cms-api";
import { type EntityManager } from "@mikro-orm/postgresql";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";
import { SeoBlock } from "@src/documents/pages/blocks/seo.block";
import { StageBlock } from "@src/documents/pages/blocks/stage.block";
import { Page } from "@src/documents/pages/entities/page.entity";
import { tool } from "ai";
import { validate, type ValidationError } from "class-validator";
import { readFile } from "fs/promises";
import { join } from "path";
import { z } from "zod";

import { blockMetaToTypeScript } from "./block-meta-to-typescript";
import { type AiChatTools } from "./tool.interface";

function formatValidationErrors(errors: ValidationError[], prefix = ""): string[] {
    return errors.flatMap((e) => {
        const path = prefix ? `${prefix}.${e.property}` : e.property;
        const messages = Object.values(e.constraints ?? {}).map((msg) => `${path}: ${msg}`);
        const childMessages = e.children ? formatValidationErrors(e.children, path) : [];
        return [...messages, ...childMessages];
    });
}

type PageBlockInput = z.infer<typeof pageBlockInputSchema>;

function createBlockInputs(input: PageBlockInput) {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: PageContentBlock.blockInputFactory(input.content as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        seo: SeoBlock.blockInputFactory(input.seo as any),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stage: StageBlock.blockInputFactory(input.stage as any),
    };
}

async function validatePageBlocks(input: PageBlockInput): Promise<string[] | null> {
    const blocks = createBlockInputs(input);
    const errors = (await Promise.all([validate(blocks.content), validate(blocks.seo), validate(blocks.stage)])).flat();
    return errors.length > 0 ? formatValidationErrors(errors) : null;
}

let blockTypesCache: string | null = null;

const pageBlockInputSchema = z.object({
    pageId: z.string().describe("The Page document UUID. For a new page, generate a UUID."),
    content: z
        .record(z.string(), z.unknown())
        .describe("Main page content block data, must match PageContentBlockInputData from get_block_input_types"),
    seo: z.record(z.string(), z.unknown()).describe("SEO block data, must match SeoBlockInputData from get_block_input_types"),
    stage: z.record(z.string(), z.unknown()).describe("Stage/hero block data, must match StageBlockInputData from get_block_input_types"),
    attachedPageTreeNodeId: z.string().optional().describe("Page tree node UUID this page belongs to."),
});

export function createPagesTools(pageTreeService: PageTreeService, em: EntityManager): AiChatTools {
    return {
        get_page: tool({
            description:
                "Read the content of a CMS Page document by its ID. Returns extracted text and raw block data. To find the document ID for a page tree node, call get_page_tree_node and use the returned documentId.",
            inputSchema: z.object({
                pageId: z.string().describe("The Page document UUID (not the page tree node ID)."),
            }),
            execute: async (input) => {
                const page = await em.findOne(Page, { id: input.pageId });
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
        }),
        validate_save_page: tool({
            description:
                "Validate page block data without saving. Always call this before save_page to catch schema and constraint errors early. Returns a list of validation errors, or success if the data is valid.",
            inputSchema: pageBlockInputSchema,
            execute: async (input) => {
                const errors = await validatePageBlocks(input);
                if (errors) {
                    return JSON.stringify({ valid: false, errors });
                }
                return JSON.stringify({ valid: true });
            },
        }),
        save_page: tool({
            description:
                "Create or update a CMS Page document. Always call validate_save_page first with the same arguments — do not call save_page if validation fails. attachedPageTreeNodeId must be provided on every call.",
            inputSchema: pageBlockInputSchema,
            needsApproval: true,
            execute: async (input) => {
                return executeSavePage(input, pageTreeService, em);
            },
        }),
        get_block_input_types: tool({
            description: "Get TypeScript interfaces describing the shape of all CMS content blocks needed as input to eg save_page tool.",
            inputSchema: z.object({}),
            execute: async () => {
                if (!blockTypesCache) {
                    const raw = await readFile(join(process.cwd(), "block-meta.json"), "utf-8");
                    blockTypesCache = blockMetaToTypeScript(JSON.parse(raw));
                }
                return blockTypesCache;
            },
        }),
    };
}

async function executeSavePage(input: PageBlockInput, pageTreeService: PageTreeService, em: EntityManager): Promise<string> {
    const { pageId, attachedPageTreeNodeId } = input;

    if (attachedPageTreeNodeId) {
        const node = await pageTreeService.createReadApi({ visibility: "all" }).getNodeOrFail(attachedPageTreeNodeId);
        if (node.visibility === PageTreeNodeVisibility.Archived) {
            return JSON.stringify({ error: "Archived pages cannot be updated." });
        }
    }

    const validationErrors = await validatePageBlocks(input);
    if (validationErrors) {
        return JSON.stringify({ error: "Validation failed", details: validationErrors });
    }

    const blocks = createBlockInputs(input);

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
}
