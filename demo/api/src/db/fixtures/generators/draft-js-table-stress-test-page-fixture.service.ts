import { ExtractBlockInputFactoryProps, PageTreeNodeVisibility, PageTreeService } from "@dextinity/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { LinkBlock } from "@src/common/blocks/link.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { TextAlignment } from "@src/common/blocks/standalone-rich-text.block";
import { faker } from "@src/db/fixtures/faker";
import { LinkBlockFixtureService } from "@src/db/fixtures/generators/blocks/navigation/link-block-fixture.service";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";
import { StageBlock } from "@src/documents/pages/blocks/stage.block";
import { PageInput } from "@src/documents/pages/dto/page.input";
import { Page } from "@src/documents/pages/entities/page.entity";
import { PageTreeNodeCreateInput } from "@src/page-tree/dto/page-tree-node.input";
import { PageTreeNodeScope } from "@src/page-tree/dto/page-tree-node-scope";
import { PageTreeNodeCategory } from "@src/page-tree/page-tree-node-category";
import { UserGroup } from "@src/user-groups/user-group";

import { generateSeoBlock } from "./blocks/seo.generator";

type RichTextInput = ExtractBlockInputFactoryProps<typeof RichTextBlock>;
type LinkInput = ExtractBlockInputFactoryProps<typeof LinkBlock>;
type DraftInlineStyle = "BOLD" | "ITALIC" | "SUB" | "SUP";
type DraftBlockType =
    | "paragraph-standard"
    | "paragraph-small"
    | "header-one"
    | "header-two"
    | "header-three"
    | "unordered-list-item"
    | "ordered-list-item";

const COLUMN_COUNT = 12;
const DATA_ROW_COUNT = 60;
const LINK_POOL_SIZE = 8;
const linkEntityKey = 0;

const columnSizes = ["extraSmall", "small", "standard", "large", "extraLarge"];
const headerTypes: DraftBlockType[] = ["header-one", "header-two", "header-three"];

interface TextSegment {
    text: string;
    styles?: DraftInlineStyle[];
    isLink?: boolean;
}

interface DraftBlock {
    key: string;
    text: string;
    type: DraftBlockType;
    depth: number;
    inlineStyleRanges: { style: DraftInlineStyle; offset: number; length: number }[];
    entityRanges: { offset: number; length: number; key: number }[];
    data: Record<string, never>;
}

function createBlock(type: DraftBlockType, segments: TextSegment[]): DraftBlock {
    let offset = 0;
    let text = "";
    const inlineStyleRanges: DraftBlock["inlineStyleRanges"] = [];
    const entityRanges: DraftBlock["entityRanges"] = [];

    for (const segment of segments) {
        const length = segment.text.length;
        for (const style of segment.styles ?? []) {
            inlineStyleRanges.push({ style, offset, length });
        }
        if (segment.isLink) {
            entityRanges.push({ offset, length, key: linkEntityKey });
        }
        text += segment.text;
        offset += length;
    }

    return { key: faker.string.uuid(), text, type, depth: 0, inlineStyleRanges, entityRanges, data: {} };
}

function createRichText(blocks: DraftBlock[], link?: LinkInput): RichTextInput {
    const entityMap: RichTextInput["draftContent"]["entityMap"] = link
        ? { [linkEntityKey]: { type: "LINK", mutability: "MUTABLE", data: link } }
        : {};

    return { draftContent: { blocks, entityMap } };
}

const createPageBlock = <BlockType extends string, Props>(type: BlockType, props: Props) => ({
    key: faker.string.uuid(),
    visible: true,
    type,
    props,
    userGroup: UserGroup.all,
});

const getHeaderType = (cellIndex: number): DraftBlockType => headerTypes[cellIndex % headerTypes.length];

interface ContentMetrics {
    cells: number;
    blocks: number;
    headers: number;
    paragraphs: number;
    listItems: number;
    inlineStyleRanges: number;
    links: number;
    blockTypes: Set<string>;
    inlineStyles: Set<string>;
}

function collectMetrics(cellContents: RichTextInput[]): ContentMetrics {
    const metrics: ContentMetrics = {
        cells: cellContents.length,
        blocks: 0,
        headers: 0,
        paragraphs: 0,
        listItems: 0,
        inlineStyleRanges: 0,
        links: 0,
        blockTypes: new Set<string>(),
        inlineStyles: new Set<string>(),
    };

    for (const cellContent of cellContents) {
        metrics.links += Object.keys(cellContent.draftContent.entityMap).length;

        for (const draftBlock of cellContent.draftContent.blocks) {
            metrics.blocks++;
            metrics.blockTypes.add(draftBlock.type);
            metrics.inlineStyleRanges += draftBlock.inlineStyleRanges.length;
            for (const range of draftBlock.inlineStyleRanges) {
                metrics.inlineStyles.add(range.style);
            }

            if (draftBlock.type.startsWith("header-")) {
                metrics.headers++;
            } else if (draftBlock.type.endsWith("-list-item")) {
                metrics.listItems++;
            } else {
                metrics.paragraphs++;
            }
        }
    }

    return metrics;
}

function createSummaryContent({
    cellContents,
    columnCount,
    rowCount,
}: {
    cellContents: RichTextInput[];
    columnCount: number;
    rowCount: number;
}): RichTextInput {
    const metrics = collectMetrics(cellContents);
    const sortedBlockTypes = Array.from(metrics.blockTypes).sort();
    const sortedInlineStyles = Array.from(metrics.inlineStyles).sort();

    const createMetricItem = (label: string, value: number | string): DraftBlock =>
        createBlock("unordered-list-item", [{ text: `${label}: `, styles: ["BOLD"] }, { text: String(value) }]);

    return createRichText([
        createBlock("header-two", [{ text: "DraftJS table readonly stress test" }]),
        createBlock("paragraph-standard", [
            { text: "This page holds a single " },
            { text: "Table", styles: ["BOLD"] },
            { text: ` block. Every cell renders its own readonly DraftJS editor, so the admin has to mount ${metrics.cells} editors at once.` },
        ]),
        createMetricItem("Columns", columnCount),
        createMetricItem("Rows (incl. header)", rowCount),
        createMetricItem("Cells / readonly editors", metrics.cells),
        createMetricItem("Draft blocks", metrics.blocks),
        createMetricItem("Headers", metrics.headers),
        createMetricItem("Paragraphs", metrics.paragraphs),
        createMetricItem("List items", metrics.listItems),
        createMetricItem("Inline style ranges", metrics.inlineStyleRanges),
        createMetricItem("Link entities", metrics.links),
        createMetricItem("Distinct block types", `${metrics.blockTypes.size} (${sortedBlockTypes.join(", ")})`),
        createMetricItem("Distinct inline styles", `${metrics.inlineStyles.size} (${sortedInlineStyles.join(", ")})`),
    ]);
}

function createHeaderCellContent(columnIndex: number): RichTextInput {
    return createRichText([createBlock("paragraph-standard", [{ text: `Column ${columnIndex + 1}`, styles: ["BOLD"] }])]);
}

type CreateCellContent = (cell: { index: number; link: LinkInput }) => RichTextInput;

const cellContentVariants: CreateCellContent[] = [
    ({ index }) =>
        createRichText([
            createBlock(getHeaderType(index), [{ text: faker.commerce.productName() }]),
            createBlock("paragraph-standard", [
                { text: `${faker.lorem.sentence()} ` },
                { text: faker.lorem.words(2), styles: ["BOLD"] },
                { text: " " },
                { text: faker.lorem.words(2), styles: ["ITALIC"] },
            ]),
        ]),
    ({ link }) =>
        createRichText(
            [
                createBlock("paragraph-standard", [
                    { text: "bold ", styles: ["BOLD"] },
                    { text: "italic ", styles: ["ITALIC"] },
                    { text: "bold-italic ", styles: ["BOLD", "ITALIC"] },
                    { text: "H" },
                    { text: "2", styles: ["SUB"] },
                    { text: "O, E=mc" },
                    { text: "2", styles: ["SUP"] },
                    { text: " " },
                    { text: faker.lorem.words(2), isLink: true },
                ]),
            ],
            link,
        ),
    () =>
        createRichText([
            createBlock("paragraph-small", [{ text: `${faker.lorem.words(3)} ` }, { text: faker.lorem.words(2), styles: ["BOLD", "ITALIC"] }]),
        ]),
    ({ link }) =>
        createRichText(
            [
                createBlock("unordered-list-item", [{ text: faker.lorem.words(3), styles: ["BOLD"] }]),
                createBlock("unordered-list-item", [{ text: faker.lorem.words(3), styles: ["ITALIC"] }]),
                createBlock("unordered-list-item", [{ text: `${faker.lorem.words(2)} ` }, { text: "link", isLink: true }]),
            ],
            link,
        ),
    () =>
        createRichText([
            createBlock("ordered-list-item", [{ text: faker.lorem.words(3) }]),
            createBlock("ordered-list-item", [{ text: faker.lorem.words(2), styles: ["ITALIC"] }]),
            createBlock("ordered-list-item", [{ text: faker.lorem.words(3), styles: ["BOLD"] }]),
        ]),
    ({ link }) =>
        createRichText(
            [
                createBlock("paragraph-standard", [{ text: faker.company.catchPhrase() }]),
                createBlock("paragraph-small", [{ text: `${faker.lorem.sentence()} ` }, { text: "read more", isLink: true }]),
            ],
            link,
        ),
    ({ index }) =>
        createRichText([
            createBlock(getHeaderType(index), [{ text: faker.commerce.department() }]),
            createBlock("paragraph-standard", [{ text: faker.lorem.sentence() }]),
            createBlock("unordered-list-item", [{ text: faker.lorem.words(2) }]),
            createBlock("unordered-list-item", [{ text: faker.lorem.words(3), styles: ["BOLD"] }]),
        ]),
    () =>
        createRichText([
            createBlock("paragraph-small", [{ text: "formula a" }, { text: "n", styles: ["SUB"] }, { text: " + x" }, { text: "2", styles: ["SUP"] }]),
        ]),
    () =>
        createRichText([
            createBlock("paragraph-standard", [{ text: faker.lorem.sentence() }]),
            createBlock("paragraph-small", [{ text: faker.lorem.sentence() }]),
            createBlock("paragraph-standard", [{ text: faker.lorem.words(3), styles: ["ITALIC"] }]),
        ]),
];

function createCellContent(index: number, links: LinkInput[]): RichTextInput {
    const variant = cellContentVariants[index % cellContentVariants.length];
    return variant({ index, link: links[index % links.length] });
}

@Injectable()
export class DraftJsTableStressTestPageFixtureService {
    constructor(
        private readonly entityManager: EntityManager,
        private readonly pageTreeService: PageTreeService,
        private readonly linkBlockFixtureService: LinkBlockFixtureService,
    ) {}

    async execute(): Promise<void> {
        const documentId = "b8e4d2c3-1a5f-4d3b-9f2e-3e4d5c6b7a81";
        const scope: PageTreeNodeScope = { domain: "main", language: "en" };

        const createNodeInput: PageTreeNodeCreateInput = {
            name: "Table Stresstest (DraftJS)",
            slug: "table-stresstest-draftjs",
            attachedDocument: { id: documentId, type: "Page" },
            userGroup: UserGroup.all,
        };

        const node = await this.pageTreeService.createNode(createNodeInput, PageTreeNodeCategory.mainNavigation, scope);
        await this.pageTreeService.updateNodeVisibility(node.id, PageTreeNodeVisibility.Published);

        const links = await Promise.all(Array.from({ length: LINK_POOL_SIZE }, () => this.linkBlockFixtureService.generateBlockInput()));

        const columns = Array.from({ length: COLUMN_COUNT }, (_, columnIndex) => ({
            id: `column-${columnIndex}`,
            size: columnSizes[columnIndex % columnSizes.length],
            highlighted: columnIndex % 4 === 0,
        }));

        const headerRow = {
            id: faker.string.uuid(),
            highlighted: true,
            cellValues: columns.map((column, columnIndex) => ({ columnId: column.id, value: createHeaderCellContent(columnIndex) })),
        };

        const dataRows = Array.from({ length: DATA_ROW_COUNT }, (_, rowIndex) => ({
            id: faker.string.uuid(),
            highlighted: rowIndex % 5 === 0,
            cellValues: columns.map((column, columnIndex) => ({
                columnId: column.id,
                value: createCellContent(rowIndex * COLUMN_COUNT + columnIndex, links),
            })),
        }));

        const rows = [headerRow, ...dataRows];
        const cellContents = rows.flatMap((row) => row.cellValues.map((cellValue) => cellValue.value));

        const pageInput = new PageInput();
        pageInput.seo = generateSeoBlock();
        pageInput.content = PageContentBlock.blockInputFactory({
            blocks: [
                createPageBlock("richtext", {
                    richText: createSummaryContent({ cellContents, columnCount: columns.length, rowCount: rows.length }),
                    textAlignment: TextAlignment.left,
                }),
                createPageBlock("table", { columns, rows }),
            ],
        });
        pageInput.stage = StageBlock.blockInputFactory({ blocks: [] });

        await this.entityManager.persistAndFlush(
            this.entityManager.create(Page, {
                id: documentId,
                content: pageInput.content.transformToBlockData(),
                seo: pageInput.seo.transformToBlockData(),
                stage: pageInput.stage.transformToBlockData(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        );
    }
}
