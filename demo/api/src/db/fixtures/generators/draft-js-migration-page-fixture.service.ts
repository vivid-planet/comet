import { PageTreeNodeBaseCreateInput, PageTreeNodeVisibility, PageTreeService } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";
import { StageBlock } from "@src/documents/pages/blocks/stage.block";
import { PageInput } from "@src/documents/pages/dto/page.input";
import { Page } from "@src/documents/pages/entities/page.entity";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { UserGroup } from "@src/user-groups/user-group";

import { generateSeoBlock } from "./blocks/seo.generator";

// Hardcoded legacy DraftJS-shaped content. Exercises the createTipTapRichTextBlock
// `migrateFromDraftJs` migration path: blocks, headings, lists, inline styles, and a LINK entity.
const legacyDraftJsContent = {
    blocks: [
        {
            key: "11111111-1111-1111-1111-111111111111",
            text: "Migrated from DraftJS",
            type: "header-one",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: "22222222-2222-2222-2222-222222222222",
            text: "This paragraph has bold and italic text mixed in.",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
                { style: "BOLD", offset: 14, length: 4 },
                { style: "ITALIC", offset: 23, length: 6 },
            ],
            entityRanges: [],
            data: {},
        },
        {
            key: "33333333-3333-3333-3333-333333333333",
            text: "And here is a strikethrough plus a link to comet.",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [{ style: "STRIKETHROUGH", offset: 14, length: 13 }],
            entityRanges: [{ key: 0, offset: 43, length: 5 }],
            data: {},
        },
        {
            key: "44444444-4444-4444-4444-444444444444",
            text: "First bullet point",
            type: "unordered-list-item",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: "55555555-5555-5555-5555-555555555555",
            text: "Second bullet point",
            type: "unordered-list-item",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: "66666666-6666-6666-6666-666666666666",
            text: "First ordered item",
            type: "ordered-list-item",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: "77777777-7777-7777-7777-777777777777",
            text: "Second ordered item",
            type: "ordered-list-item",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
    entityMap: {
        "0": {
            type: "LINK",
            mutability: "MUTABLE",
            data: {
                attachedBlocks: [{ type: "external", props: { targetUrl: "https://comet-dxp.com", openInNewWindow: true } }],
                activeType: "external",
            },
        },
    },
};

@Injectable()
export class DraftJsMigrationPageFixtureService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly pageTreeService: PageTreeService,
    ) {}

    async execute(): Promise<void> {
        const documentId = "deadbeef-0000-4000-8000-000000000001";
        const scope: PageTreeNodeScope = { domain: "main", language: "en" };

        const node = await this.pageTreeService.createNode(
            {
                name: "DraftJS Migration Demo",
                slug: "draftjs-migration-demo",
                attachedDocument: { id: documentId, type: "Page" },
                userGroup: UserGroup.all,
            } as PageTreeNodeBaseCreateInput,
            PageTreeNodeCategory.mainNavigation,
            scope,
        );
        await this.pageTreeService.updateNodeVisibility(node.id, PageTreeNodeVisibility.Published);

        // Construct page content data via blockDataFactory (not blockInputFactory) so the
        // DraftJS-shaped props on the tipTapRichText slot flow through the
        // TipTapRichTextBlock.blockDataFactory migration pipeline.
        const content = PageContentBlock.blockDataFactory({
            blocks: [
                {
                    key: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
                    visible: true,
                    type: "tipTapRichText",
                    props: legacyDraftJsContent,
                    userGroup: UserGroup.all,
                },
            ],
        });

        const pageInput = new PageInput();
        pageInput.seo = generateSeoBlock();
        pageInput.stage = StageBlock.blockInputFactory({ blocks: [] });

        await this.entityManager.persistAndFlush(
            this.entityManager.create(Page, {
                id: documentId,
                content,
                seo: pageInput.seo.transformToBlockData(),
                stage: pageInput.stage.transformToBlockData(),
            }),
        );
    }
}
